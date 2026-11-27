"""GLB 텍스처 최적화: 이미지 리사이즈 + WebP 변환 후 GLB 재작성.
메시(Draco 포함), 머티리얼, 노드 구조는 건드리지 않는다."""
import json, struct, sys, os, io, argparse
from PIL import Image

JSON_CHUNK, BIN_CHUNK = 0x4E4F534A, 0x004E4942

def read_glb(p):
    data = open(p, 'rb').read()
    assert data[:4] == b'glTF', f"{p}: not a GLB"
    off, j, bin_ = 12, None, b''
    while off < len(data):
        ln, ty = struct.unpack_from('<II', data, off); off += 8
        chunk = data[off:off+ln]; off += ln
        if ty == JSON_CHUNK: j = json.loads(chunk)
        elif ty == BIN_CHUNK: bin_ = chunk
    return j, bin_

def write_glb(path, j, bin_):
    js = json.dumps(j, separators=(',', ':')).encode('utf-8')
    js += b' ' * ((4 - len(js) % 4) % 4)
    bn = bin_ + b'\x00' * ((4 - len(bin_) % 4) % 4)
    total = 12 + 8 + len(js) + (8 + len(bn) if bn else 0)
    out = bytearray()
    out += b'glTF' + struct.pack('<II', 2, total)
    out += struct.pack('<II', len(js), JSON_CHUNK) + js
    if bn:
        out += struct.pack('<II', len(bn), BIN_CHUNK) + bn
    open(path, 'wb').write(out)

def to_webp(raw, max_size, quality):
    img = Image.open(io.BytesIO(raw))
    has_alpha = img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info)
    img = img.convert('RGBA' if has_alpha else 'RGB')
    w, h = img.size
    if max(w, h) > max_size:
        s = max_size / max(w, h)
        img = img.resize((max(1, round(w * s)), max(1, round(h * s))), Image.LANCZOS)
    buf = io.BytesIO()
    img.save(buf, format='WEBP', quality=quality, method=6)
    return buf.getvalue(), img.size

def optimize(src, dst, max_size, quality):
    j, bin_ = read_glb(src)
    images = j.get('images', [])
    new_data = {}
    for i, im in enumerate(images):
        bv_i = im.get('bufferView')
        if bv_i is None:
            continue
        bv = j['bufferViews'][bv_i]
        o = bv.get('byteOffset', 0)
        raw = bin_[o:o + bv['byteLength']]
        try:
            enc, size = to_webp(raw, max_size, quality)
        except Exception as e:
            print(f"    ! image {i} skipped ({e})"); continue
        if len(enc) < len(raw):
            new_data[bv_i] = enc
            im['mimeType'] = 'image/webp'
        # 더 커지면 원본 유지

    # webp가 된 이미지를 가리키는 텍스처는 EXT_texture_webp 형태로 옮긴다
    webp_images = {i for i, im in enumerate(images) if im.get('mimeType') == 'image/webp'}
    for t in j.get('textures', []):
        src_i = t.get('source')
        if src_i in webp_images:
            t.setdefault('extensions', {})['EXT_texture_webp'] = {'source': src_i}
            del t['source']
    if webp_images:
        for key in ('extensionsUsed', 'extensionsRequired'):
            lst = j.setdefault(key, [])
            if 'EXT_texture_webp' not in lst:
                lst.append('EXT_texture_webp')

    # BIN 청크 재구성 (bufferView 인덱스는 유지, 오프셋만 다시 계산)
    out = bytearray()
    for idx, bv in enumerate(j.get('bufferViews', [])):
        o = bv.get('byteOffset', 0)
        data = new_data.get(idx, bin_[o:o + bv['byteLength']])
        if len(out) % 4:
            out += b'\x00' * (4 - len(out) % 4)
        bv['byteOffset'] = len(out)
        bv['byteLength'] = len(data)
        out += data
    if j.get('buffers'):
        j['buffers'][0]['byteLength'] = len(out)
        j['buffers'][0].pop('uri', None)
    write_glb(dst, j, bytes(out))

if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('--max-size', type=int, default=1024)
    ap.add_argument('--quality', type=int, default=85)
    ap.add_argument('src'); ap.add_argument('dst')
    a = ap.parse_args()
    optimize(a.src, a.dst, a.max_size, a.quality)
    b, n = os.path.getsize(a.src), os.path.getsize(a.dst)
    print(f"  {os.path.basename(a.src):18s} {b/1024:7.0f}KB -> {n/1024:7.0f}KB  ({100*(1-n/b):+.0f}%)")

# 사용 예 (public/models 재생성):
#   python3 scripts/optimize-glb.py --max-size 512  --quality 86 src.glb out.glb
#   python3 scripts/optimize-glb.py --max-size 1024 --quality 85 src.glb out.glb
#
# 이번에 적용한 값:
#   XR.glb         --max-size 512  --quality 86   1170KB -> 500KB
#   headphone.glb  --max-size 1024 --quality 85    654KB -> 270KB
#   news.glb       --max-size 512  --quality 88    286KB ->  74KB
#   smartwatch.glb --max-size 1024 --quality 88    257KB -> 120KB
#   monitor.glb    --max-size 1280 --quality 86     89KB ->  33KB
#   phone.glb      --max-size 1024 --quality 88     74KB ->  70KB
