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
 /**
  * 기기를 선택했을 때 카메라 타깃을 이만큼 올린다.
  * 타깃이 화면 중앙에 오므로, 타깃을 올리면 씬 전체가 화면 아래로 내려가고
  * 좌상단 제목·설명문 자리가 비워진다.
  */
 activeTargetLift: 0.8,
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
 },

 'mobile-music': {
 mount: [-1.2, SURFACE_Y + 0.15, 0.8],
 local: [-0.2, -0.15, -1],
 scale: 0.4,
 rotation: [0, Math.PI / 2 + Math.PI, Math.PI / 2],
 tilt: [-2.4, Math.PI / 2 + Math.PI + 2.7, 1.2],
 selectedY: 0.7,
 focus: { target: [-0.2, 0.05, -1], zoom: 100 },
 },

 'watch-alarm': {
 mount: [0.2, SURFACE_Y + 0.08, 1.2],
 local: [3.5, 0.07, -2],
 scale: 0.4,
 rotation: [0, 1 + Math.PI, 0.2],
 tilt: [-Math.PI / 2 - 0.5, Math.PI / 2 + Math.PI + 1, -1.5],
 selectedY: 0.4,
 focus: { target: [3.5, 0.38, -0.8], zoom: 130 },
 },

 monitor: {
 mount: [0, SURFACE_Y, -1.5],
 local: [0, 0, 0.2],
 scale: 5.5,
 rotation: [0, 0, 0],
 tilt: [0, 0, 0],
 selectedY: 0.2,
 focus: { target: [0, 1.4, -1.0], zoom: 110 },
 },

 headphone: {
 mount: [4, SURFACE_Y, 1.5],
 local: [0, 0.27, -0.4],
 scale: 1.4,
 rotation: [0, Math.PI / 2 + 2, Math.PI / 2 + 0.2],
 tilt: [Math.PI / 2, Math.PI + Math.PI / 2, Math.PI / 2],
 selectedY: 1,
 focus: { target: [4, 0.37, 0.1], zoom: 90 },
 },

 publication: {
 mount: [0, SURFACE_Y, -0.1],
 local: [2, 0, 0.2],
 scale: 10,
 rotation: [0, -0.3, 0],
 tilt: [0.5, -0.3, 0],
 selectedY: 0.7,
 focus: { target: [0, 0.5, -0.1], zoom: 90 },
 },
};

// ─────────────────── 떠 있는 UI 카드 ───────────────────
export const FLOATING_ICONS = {
 group: [0, 2, -2] as V3,
 /** 카드 높이. 가로는 텍스처 비율로 정해진다 */
 height: 1.25,
 items: [
 { key: 'calendar', position: [-3, -1, -0.5] as V3 },
 { key: 'clock', position: [-1.5, 1, 0] as V3 },
 { key: 'reminder', position: [2, 0.5, 0.5] as V3 },
 ],
} as const;
