import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Footer } from '../Footer';

/**
 * 전시 사이트의 로고 생성기(generator.html + script.js)를 그대로 옮긴 것.
 *
 * 원본 규칙:
 *  - 시드 난수는 frac(sin(seed++) * 10000)
 *  - 픽셀 강도 [8, 12, 16, 18]짜리 박스 4개를 로고 영역 안에 생성
 *  - 각 박스는 자기 강도에 비례하는 속도로 좌우로 흐르고, 화면 밖으로 나가면 반대편에서 다시 들어옴
 *  - 박스 안쪽만 그 강도로 픽셀화해서 베이스 로고 위에 덮어 그림
 */
const LOGO_SRC = '/interplay/logo.webp';
const OFFICIAL_SEED = 72228804;
const INTENSITIES = [8, 12, 16, 18];
/**
 * 박스 이동 속도 계수. 원본(script.js)은 pixelSize * 0.2인데, 원본 캔버스는
 * 1685px이고 여기는 900px로 줄여 쓰기 때문에 같은 값이면 마크 대비 더 빨리 흐른다.
 * 읽으면서 볼 수 있을 만큼 늦춘다.
 */
const SPEED = 0.06;

type Box = { floatX: number; x: number; y: number; w: number; h: number; pixelSize: number; speed: number; direction: number };

const LogoGenerator: React.FC = () => {
 const canvasRef = useRef<HTMLCanvasElement>(null);
 const imgRef = useRef<HTMLImageElement | null>(null);
 const boxesRef = useRef<Box[]>([]);
 const rafRef = useRef<number>(0);
 const boundsRef = useRef<{ x: number; y: number; w: number; h: number } | null>(null);
 const [seed, setSeed] = useState(OFFICIAL_SEED);
 const [ready, setReady] = useState(false);

 // 로고를 한 번 로드하고, 글자가 실제로 있는 영역(불투명 픽셀)을 재둔다.
 // 원본도 이 영역 안에서만 박스를 만든다 — 투명 여백에 박스가 떠버리면 안 된다.
 useEffect(() => {
  const img = new Image();
  img.src = LOGO_SRC;
  img.onload = () => {
   const c = document.createElement('canvas');
   c.width = img.naturalWidth;
   c.height = img.naturalHeight;
   const cx = c.getContext('2d', { willReadFrequently: true });
   if (cx) {
    cx.drawImage(img, 0, 0);
    const { data } = cx.getImageData(0, 0, c.width, c.height);
    let minX = c.width, minY = c.height, maxX = 0, maxY = 0, found = false;
    for (let y = 0; y < c.height; y += 2) {
     for (let x = 0; x < c.width; x += 2) {
      const i = (y * c.width + x) * 4;
      // 알파가 있거나, 흰 배경 위의 어두운 글자
      if (data[i + 3] > 20 && (data[i] < 200 || data[i + 1] < 200 || data[i + 2] < 200)) {
       found = true;
       if (x < minX) minX = x; if (x > maxX) maxX = x;
       if (y < minY) minY = y; if (y > maxY) maxY = y;
      }
     }
    }
    boundsRef.current = found
     ? { x: minX, y: minY, w: maxX - minX, h: maxY - minY }
     : { x: 0, y: 0, w: c.width, h: c.height };
   }
   imgRef.current = img;
   setReady(true);
  };
 }, []);

 // 시드가 바뀌면 박스를 다시 만든다
 useEffect(() => {
  if (!ready || !imgRef.current) return;
  const img = imgRef.current;
  let state = seed;
  const rnd = () => { const x = Math.sin(state++) * 10000; return x - Math.floor(x); };

  const b = boundsRef.current ?? { x: 0, y: 0, w: img.naturalWidth, h: img.naturalHeight };
  const { w: maxW, h: maxH, x: startX, y: startY } = b;

  boxesRef.current = INTENSITIES.map((pSize, i) => {
   const wRaw = rnd() * (maxW * 0.4) + maxW * 0.3;
   const hRaw = rnd() * (maxH * 0.3) + maxH * 0.2;
   const xRaw = startX + rnd() * Math.max(0, maxW - wRaw);
   const yRaw = startY + rnd() * Math.max(0, maxH - hRaw);
   return {
    floatX: xRaw,
    x: Math.round(xRaw / pSize) * pSize,
    y: Math.round(yRaw / pSize) * pSize,
    w: Math.max(pSize, Math.round(wRaw / pSize) * pSize),
    h: Math.max(pSize, Math.round(hRaw / pSize) * pSize),
    pixelSize: pSize,
    speed: pSize * SPEED,
    direction: i % 2 === 1 ? 1 : -1,
   };
  });
 }, [seed, ready]);

 // 애니메이션 + 렌더
 useEffect(() => {
  if (!ready || !imgRef.current) return;
  const img = imgRef.current;
  const canvas = canvasRef.current;
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return;

  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;

  const tmp = document.createElement('canvas');
  const tctx = tmp.getContext('2d');
  if (!tctx) return;

  const draw = () => {
   const boxes = boxesRef.current;
   ctx.clearRect(0, 0, canvas.width, canvas.height);
   ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
   ctx.imageSmoothingEnabled = false;

   for (const box of boxes) {
    box.floatX += box.speed * box.direction;
    const b = boundsRef.current ?? { x: 0, w: canvas.width };
    if (box.direction === -1) {
     if (box.floatX + box.w < b.x - 30) box.floatX = b.x + b.w + 30;
    } else if (box.floatX > b.x + b.w + 30) {
     box.floatX = b.x - box.w - 50;
    }
    box.x = Math.round(box.floatX / box.pixelSize) * box.pixelSize;

    // 전체를 축소했다 다시 키워 계단이 생기게 하고, 박스 영역만 잘라 덮는다
    const p = box.pixelSize;
    const smallW = Math.max(1, Math.ceil(canvas.width / p));
    const smallH = Math.max(1, Math.ceil(canvas.height / p));
    tmp.width = smallW;
    tmp.height = smallH;
    tctx.imageSmoothingEnabled = false;
    tctx.clearRect(0, 0, smallW, smallH);
    tctx.drawImage(img, 0, 0, smallW, smallH);

    ctx.save();
    ctx.beginPath();
    ctx.rect(box.x, box.y, box.w, box.h);
    ctx.clip();
    ctx.clearRect(box.x, box.y, box.w, box.h);
    ctx.drawImage(tmp, 0, 0, smallW, smallH, 0, 0, smallW * p, smallH * p);
    ctx.restore();
   }
   rafRef.current = requestAnimationFrame(draw);
  };

  rafRef.current = requestAnimationFrame(draw);
  return () => cancelAnimationFrame(rafRef.current);
 }, [ready]);

 return (
  <div className="w-full">
   <div className="border border-gray-100 bg-white p-4 flex items-center justify-center">
    <canvas ref={canvasRef} className="w-full h-auto" aria-label="InterPlay logo, pixel transformation" />
   </div>

   <div className="flex items-center gap-4 mt-6 flex-wrap">
    <button
     onClick={() => setSeed(Math.floor(Math.random() * 89999999) + 10000000)}
     className="subtext border border-gray-400 text-gray-500 hover:text-black hover:border-black transition-colors rounded-full px-4 py-1"
    >
     Generate
    </button>
    <button
     onClick={() => setSeed(OFFICIAL_SEED)}
     className="subtext text-gray-400 hover:text-black transition-colors"
    >
     Official seed
    </button>
    <span className="subtext text-gray-400 tabular-nums">seed : {seed}</span>
   </div>
  </div>
 );
};

export const InterPlay: React.FC = () => {
 useEffect(() => {
  window.scrollTo(0, 0);
 }, []);

 return (
  <div className="w-full min-h-screen bg-white text-black p-8 mt-12 md:mt-0 mx-auto">
   {/* Header / Navigation */}
   <header className="mb-8">
    <Link
     to="/"
     className="mb-8 text-sm text-gray-500 hover:text-black transition-colors flex items-center gap-2 inline-block"
    >
     ← Back to Projects
    </Link>
    <h1 className="title mb-2">
     InterPlay
    </h1>
    <p className="subtitle text-gray-600 max-w-2xl">
     Exhibition Identity &amp; Website, 2026
    </p>
   </header>

   {/* Main Media & Overview */}
   <section className="layout-vertical-media">
    <div className="layout-vertical-media-left">
     <img
      src="/interplay/04-mobile.webp"
      alt="InterPlay home screen with the generative identity behind the logotype"
      className="w-full h-auto"
     />
    </div>

    <div className="layout-vertical-media-right">
     <div className="mb-12">
      <h2 className="mb-8 text-lg">Overview</h2>
      <ul className="space-y-4 text-gray-600">
       <li>
        <span className="block text-gray-400 tracking-wider mb-1 ">Role</span>
        Visual Director, Web Design &amp; Development
       </li>
       <li>
        <span className="block text-gray-400 tracking-wider mb-1 ">Year</span>
        2026
       </li>
       <li>
        <span className="block text-gray-400 tracking-wider mb-1 ">Organised by</span>
        UAL Creative Computing Institute
       </li>
       <li>
        <span className="block text-gray-400 tracking-wider mb-1 ">Built with</span>
        Vanilla HTML / CSS / JS, three.js, Canvas, GitHub Pages
       </li>
      </ul>
     </div>
     <div>
      <h2 className="mb-8 text-lg">Mission</h2>
      <div className="project-description space-y-6">
       <p>
        InterPlay is the postgraduate exhibition of UAL Creative Computing Institute,
        presenting 28 works by artists, designers and researchers from five continents.
        I led the visual direction and designed and built the exhibition website.
       </p>
       <p>
        The brief was awkward in a useful way: one identity had to hold 28 works that
        shared no medium — TouchDesigner installations, p5.js sketches, physical
        computing, games, moving image. Rather than flatten them under one fixed mark,
        the identity was made to vary.
       </p>
      </div>
     </div>
    </div>
   </section>

   {/* 1. Generative identity */}
   <section className="border-t border-gray-100 pt-16 -mx-8 px-8 mb-32">
    <div className="grid grid-cols-1 dt:grid-cols-2 gap-4 lg:gap-24 items-top mb-4">
     <div>
      <h2 className="text-3xl md:text-4xl font-normal leading-tight text-black mb-8">
       One Mark, Many Seeds
      </h2>
      <div className="project-description space-y-6">
       <p>
        The logotype is drawn once and then disturbed. A numeric seed places four bands
        across the mark, each pixelating the artwork underneath at its own resolution —
        8, 12, 16 and 18 pixels — and each drifting sideways at a speed set by its own
        coarseness. The letterforms stay legible while the surface keeps breaking and
        reforming. The exhibition ships with one canonical variant, seed 72228804, and
        every committee member could generate their own.
       </p>
       <p>
        This turned the identity into something the team played with rather than policed.
        It also matched the exhibition&apos;s own argument: technology is treated as a
        material that talks back, not a neutral tool.
       </p>
      </div>
     </div>
     <div className="w-full h-full">
      <LogoGenerator />
     </div>
    </div>
   </section>

   {/* 2. One dataset, 28 rooms */}
   <section className="border-t border-gray-100 pt-16 -mx-8 px-8 mb-32">
    <div className="grid grid-cols-1 dt:grid-cols-2 gap-4 lg:gap-24 items-top mb-4">
     <div className="w-full h-full md:order-1 flex items-top justify-top">
      <img
       src="/interplay/02-project.webp"
       alt="A work page — Post Literature, shown in the template every exhibit uses"
       className="w-full h-full object-cover"
      />
     </div>
     <div className="md:order-2">
      <h2 className="text-3xl md:text-4xl font-normal leading-tight text-black mb-8">
       One Dataset, Twenty-Eight Rooms
      </h2>
      <div className="project-description space-y-6">
       <p>
        Every work page is the same template reading from a single JSON file. Each entry
        carries a statement, technical label, artist links and three media sets — final
        images, behind the scenes, artist photos — and the page adapts to whatever
        exists, falling back gracefully when a field is missing or a still is actually a
        video.
       </p>
       <p>
        Artists submitted media as folders, not as markup. A sync script walks the
        directory tree and rewrites the media paths in the JSON to match what is
        actually on disk, so adding footage never meant editing code. With 28 teams
        delivering on their own schedule, that was the difference between a website and
        a bottleneck.
       </p>
      </div>
     </div>
    </div>
   </section>

   {/* 3. Generative visual */}
   <section className="border-t border-gray-100 pt-16 -mx-8 px-8 mb-32">
    <div className="grid grid-cols-1 dt:grid-cols-2 gap-4 lg:gap-24 items-top mb-4">
     <div>
      <h2 className="text-3xl md:text-4xl font-normal leading-tight text-black mb-8">
       A Background That Answers Back
      </h2>
      <div className="project-description space-y-6">
       <p>
        Behind the index sits a WebGL field of translucent blooms, rendered with three.js
        on a transparent canvas so the type and the work list stay plain HTML — legible,
        selectable, indexable. A raycaster tracks the pointer and the blooms respond,
        giving the page the feeling of a room you are walking through.
       </p>
       <p>
        Keeping the 3D strictly decorative was a deliberate constraint. The visual is the
        first thing you notice and the first thing that can be dropped: if WebGL fails,
        the exhibition still reads.
       </p>
      </div>
     </div>
     <div className="w-full h-full">
      <img
       src="/interplay/01-home.webp"
       alt="The index: generative blooms on the left, the list of 28 works on the right"
       className="w-full h-full object-cover"
      />
     </div>
    </div>
   </section>

   {/* Links */}
   <section className="border-t border-gray-100 pt-16 -mx-8 px-8 mb-32">
    <h2 className="text-3xl md:text-4xl font-normal leading-tight text-black mb-16">
     Links
    </h2>
    <div className="grid grid-cols-1 dt:grid-cols-2 gap-4 lg:gap-24 items-top mb-4">
     <div className="group">
      <h3 className="text-xl text-black mb-4">Exhibition</h3>
      <p className="text-lg leading-relaxed">
       <a target="_blank" rel="noreferrer" href="https://interplay-cci.co.uk/" className="link-underline">interplay-cci.co.uk</a>
       <br />
       <a target="_blank" rel="noreferrer" href="https://interplay-cci.co.uk/generator.html" className="link-underline">Logo generator</a>
      </p>
     </div>
     <div className="group">
      <h3 className="text-xl text-black mb-4">Source</h3>
      <p className="text-lg leading-relaxed">
       <a target="_blank" rel="noreferrer" href="https://github.com/zhenxhen/exhibition_web" className="link-underline">github.com/zhenxhen/exhibition_web</a>
       <br />
       <Link to="/project/post-literature" className="link-underline">Post Literature — my work in the show</Link>
      </p>
     </div>
    </div>
   </section>

   <Footer />
  </div>
 );
};
