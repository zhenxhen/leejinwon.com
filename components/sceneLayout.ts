/*
 * 씬의 배치 수치를 전부 모아둔 한 파일.
 *
 * 전에는 같은 성격의 값이 세 곳에 흩어져 있었다.
 *   constants.ts     프로젝트 기기의 월드 위치
 *   Experience.tsx   고정 기기 group 위치, 포커스 타깃, 장애물, 책상 치수
 *   DeviceObjects.tsx  기기별 로컬 오프셋·scale·자세
 * 하나를 옮기면 나머지 두 곳을 같이 고쳐야 해서 어긋나기 쉬웠다.
 *
 * 좌표계: 모든 값은 SCENE_OFFSET group 안의 로컬 좌표다.
 *   SCENE_OFFSET > mount(기기 자리) > local(모델 자체 오프셋) > scale/rotation
 */

export type V3 = [number, number, number];

export type BoxObstacle = { kind: 'box'; lp: V3; hs: V3 };
export type SphereObstacle = { kind: 'sphere'; lp: V3; r: number };
export type ObsDef = BoxObstacle | SphereObstacle;

// ───────────────────────── 씬 ─────────────────────────
export const SCENE_OFFSET: V3 = [0, 1, 0];

/** 기기 group이 올라앉는 책상 윗면 높이 */
export const SURFACE_Y = 0.1;

export const DESK = {
 width: 10,
 depth: 4,
 topThickness: 0.2,
 topRadius: 0.02,
 legRadius: 0.04,   // 가는 철제 다리
 legHeight: 3,
 frameWidth: 3,    // 측면 프레임 깊이
 frameOffset: 4,    // 측면 프레임 X 오프셋
} as const;

export const CAMERA = {
 minZoom: 20,
 maxZoom: 150,
 minPolarAngle: 1,
 maxPolarAngle: Math.PI / 2,
 minAzimuthAngle: -1,
 maxAzimuthAngle: 1,
 smoothTime: 0.4,
 /** 진입 연출: from에서 시작해 delayMs 뒤 to로 이동 */
 entry: { from: [0, 0, 50] as V3, to: [-20, 20, 40] as V3, delayMs: 500 },
} as const;

// ──────────────────────── 기기 ────────────────────────
export type DeviceLayout = {
 /** SCENE_OFFSET 안에서 이 기기 group이 놓이는 자리 */
 mount: V3;
 /** 모델 자체의 미세 오프셋 (GLB 원점이 제각각이라 필요) */
 local: V3;
 /** GLB 단위 -> 씬 단위 */
 scale: number;
 /** 평상시 자세 */
 rotation: V3;
 /** 선택됐을 때 자세 */
 tilt: V3;
 /** 선택됐을 때 떠오르는 높이 (local.y 기준) */
 selectedY: number;
 /** 클릭 시 카메라가 잡는 지점 */
 focus: { target: V3; zoom: number };
 /** 본문 텍스트가 피해 가야 할 영역 */
 obstacle: ObsDef;
};

export const DEVICES: Record<string, DeviceLayout> = {
 'xr-calendar': {
 mount: [0, SURFACE_Y + 1.0, -0.5],
 local: [-3.5, -0.8, 0.3],
 scale: 2.6,
 rotation: [0, -0.9, 0],
 tilt: [-0.5, -1.5, 0],
 selectedY: 0,
 focus: { target: [-3.5, 1.55, 0], zoom: 90 },
 obstacle: { kind: 'sphere', lp: [0, SURFACE_Y + 1.0, -0.5], r: 1.3 },
 },

 'mobile-music': {
 mount: [-1.2, SURFACE_Y + 0.15, 0.8],
 local: [-0.2, -0.15, -1],
 scale: 0.4,
 rotation: [0, Math.PI / 2 + Math.PI, Math.PI / 2],
 tilt: [-2.4, Math.PI / 2 + Math.PI + 2.7, 1.2],
 selectedY: 0.7,
 focus: { target: [-0.2, 0.05, -1], zoom: 100 },
 obstacle: { kind: 'sphere', lp: [-1.2, 0.25, 0.8], r: 0.9 },
 },

 'watch-alarm': {
 mount: [0.2, SURFACE_Y + 0.08, 1.2],
 local: [3.5, 0.07, -2],
 scale: 0.4,
 rotation: [0, 1 + Math.PI, 0.2],
 tilt: [-Math.PI / 2 - 0.5, Math.PI / 2 + Math.PI + 1, -1.5],
 selectedY: 0.4,
 focus: { target: [3.5, 0.38, -0.8], zoom: 130 },
 obstacle: { kind: 'sphere', lp: [0.2, 0.18, 1.2], r: 0.8 },
 },

 monitor: {
 mount: [0, SURFACE_Y, -1.5],
 local: [0, 0, 0.2],
 scale: 5.5,
 rotation: [0, 0, 0],
 tilt: [0, 0, 0],
 selectedY: 0.2,
 focus: { target: [0, 1.4, -1.0], zoom: 110 },
 obstacle: { kind: 'box', lp: [0, SURFACE_Y, -1.5], hs: [1.3, 1.4, 0.6] },
 },

 headphone: {
 mount: [4, SURFACE_Y, 1.5],
 local: [0, 0.27, -0.4],
 scale: 1.4,
 rotation: [0, Math.PI / 2 + 2, Math.PI / 2 + 0.2],
 tilt: [Math.PI / 2, Math.PI + Math.PI / 2, Math.PI / 2],
 selectedY: 1,
 focus: { target: [4, 0.37, 0.1], zoom: 90 },
 obstacle: { kind: 'sphere', lp: [4, SURFACE_Y, 1.5], r: 1.4 },
 },

 publication: {
 mount: [0, SURFACE_Y, -0.1],
 local: [2, 0, 0.2],
 scale: 10,
 rotation: [0, -0.3, 0],
 tilt: [0.5, -0.3, 0],
 selectedY: 0.7,
 focus: { target: [0, 0.5, -0.1], zoom: 90 },
 // 책이 놓인 자리보다 살짝 앞을 막는다 (텍스트가 표지를 덮지 않게)
 obstacle: { kind: 'sphere', lp: [0, SURFACE_Y, 0.3], r: 1.0 },
 },
};

// ─────────────────── 떠 있는 UI 카드 ───────────────────
export const FLOATING_ICONS = {
 group: [0, 2, -2] as V3,
 /** 카드 높이. 가로는 텍스처 비율로 정해진다 */
 height: 1.25,
 items: [
 { key: 'calendar', position: [-3, -1, -0.5] as V3, obstacle: { kind: 'sphere', lp: [-3, 1.0, -2.5], r: 1.3 } as ObsDef },
 { key: 'clock', position: [-1.5, 1, 0] as V3, obstacle: { kind: 'sphere', lp: [-1.5, 3.0, -2.0], r: 1.1 } as ObsDef },
 { key: 'reminder', position: [2, 0.5, 0.5] as V3, obstacle: { kind: 'sphere', lp: [2, 2.5, -1.5], r: 1.1 } as ObsDef },
 ],
} as const;

// ───────────────────── 장애물 전체 ─────────────────────
/** 책상 자체 — 기기와 달리 group이 없어 직접 적는다 */
const DESK_OBSTACLES: ObsDef[] = [
 { kind: 'box', lp: [0, SURFACE_Y, 0], hs: [5, 0.12, 2] },   // 상판
 { kind: 'box', lp: [0, -1.5, 0], hs: [4.3, 1.6, 1.8] },  // 프레임·다리
];

export const OBSTACLES: ObsDef[] = [
 ...DESK_OBSTACLES,
 ...Object.values(DEVICES).map(d => d.obstacle),
 ...FLOATING_ICONS.items.map(i => i.obstacle),
];
