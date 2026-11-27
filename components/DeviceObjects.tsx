import React, { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

import { DeviceType } from '../types';

/*
 * 기기들을 GLB 대신 프리미티브로 만든다 (모델 파일 0바이트).
 *
 * 투박해 보이지 않으려면 실루엣이 둥글어야 하고 실제 부품이 있어야 한다.
 * RoundedBox는 radius를 크게 + smoothness를 높이고, 곡면이 필요한 곳
 * (바이저, 워치 글래스)은 납작하게 누른 구를 쓴다. 베젤·카메라 링·금속 암·
 * 쿠션처럼 눈이 "저거구나" 하고 알아보는 디테일을 따로 넣는다.
 *
 * 각 기기는 바닥이 y=0에 오도록 그리고, 책상 높이는 바깥 group이 잡는다.
 */

const DESK = 0.22;

const SCREEN_URL = `${import.meta.env.BASE_URL}3DUI/screen.webp`;
const COVER_URL = `${import.meta.env.BASE_URL}3DUI/cover.webp`;
useLoader.preload(THREE.TextureLoader, [SCREEN_URL, COVER_URL]);

// 흰 스튜디오 룩 팔레트
const WHITE = '#f7f8fa';
const SHELL_2 = '#dde0e5';
const GLASS = '#15171b';
const VISOR = '#232830';   // 완전 검정보다 살짝 들뜨게
const FABRIC = '#c4c9d1';
const FABRIC_2 = '#a7adb6';
const METAL = '#b4bac2';
const TITAN = '#3b4149';

interface DeviceProps {
 type: DeviceType;
 color: string;
 roughness?: number;
 isSelected: boolean;
 isHovered: boolean;
 onClick: (e: any) => void;
 onPointerOver: (e: any) => void;
 onPointerOut: () => void;
}

const useHoverAnimation = (
 initialY: number,
 isHovered: boolean,
 isSelected: boolean,
 baseRotation?: [number, number, number],
 tiltRotation?: [number, number, number],
 selectedY?: number
) => {
 const groupRef = useRef<THREE.Group>(null);

 useFrame((state, delta) => {
 if (groupRef.current) {
 let targetY = initialY;

 if (isSelected) {
 const baseHeight = selectedY !== undefined ? selectedY : (initialY + 0.2);
 targetY = baseHeight + Math.sin(state.clock.getElapsedTime() * 2) * 0.05;
 } else if (isHovered) {
 targetY = initialY + 0.2;
 }

 groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, delta * 5);

 if (baseRotation && tiltRotation) {
 const targetRotation = isSelected ? tiltRotation : baseRotation;
 groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotation[0], delta * 5);
 groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotation[1], delta * 5);
 groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRotation[2], delta * 5);
 }
 }
 });

 return groupRef;
};

// ---------- 공통 재질 ----------
const Plastic = ({ color = WHITE, roughness = 0.42 }: { color?: string; roughness?: number }) => (
 <meshStandardMaterial color={color} roughness={roughness} metalness={0.04} />
);
const Glassy = ({ color = GLASS }: { color?: string }) => (
 <meshStandardMaterial color={color} roughness={0.1} metalness={0.35} />
);
const Fabric = ({ color = FABRIC }: { color?: string }) => (
 <meshStandardMaterial color={color} roughness={0.98} metalness={0} />
);
const Metal = ({ color = METAL }: { color?: string }) => (
 <meshStandardMaterial color={color} roughness={0.3} metalness={0.75} />
);

// ================= XR Headset =================
export const XRHeadset: React.FC<DeviceProps> = ({ roughness, isSelected, isHovered, onClick, onPointerOver, onPointerOut }) => {
 const initialY = DESK;
 const baseRotation: [number, number, number] = [0, -0.9, 0];
 const tiltRotation: [number, number, number] = [-0.4, -1.4, 0];
 const groupRef = useHoverAnimation(initialY, isHovered, isSelected, baseRotation, tiltRotation, DESK + 0.8);

 return (
 <group
  ref={groupRef}
  onClick={onClick}
  onPointerOver={onPointerOver}
  onPointerOut={onPointerOut}
  position={[-3.5, initialY, 0.3]}
  rotation={baseRotation}
 >
  {/* 흰 알루미늄 프레임 */}
  <RoundedBox args={[1.16, 0.6, 0.4]} radius={0.27} smoothness={8} position={[0, 0.33, -0.02]}>
  <Plastic roughness={roughness ?? 0.4} />
  </RoundedBox>

  {/* 바이저 — 납작하게 누른 구라 반사가 곡면을 따라 흐른다 */}
  <mesh position={[0, 0.33, 0.14]} scale={[0.56, 0.27, 0.2]}>
  <sphereGeometry args={[1, 40, 28]} />
  <Glassy color={VISOR} />
  </mesh>

  {/* 페이스 쿠션 */}
  <RoundedBox args={[0.94, 0.48, 0.16]} radius={0.18} smoothness={6} position={[0, 0.32, -0.21]}>
  <Fabric color={FABRIC_2} />
  </RoundedBox>

  {/* 측면 힌지 */}
  {[-0.56, 0.56].map((x, i) => (
  <mesh key={i} position={[x, 0.33, -0.05]} rotation={[0, 0, Math.PI / 2]}>
   <cylinderGeometry args={[0.07, 0.07, 0.09, 20]} />
   <Metal />
  </mesh>
  ))}

  {/* 니트 밴드 — 머리 뒤를 감싸는 수평 루프 */}
  <mesh position={[0, 0.33, -0.3]} rotation={[Math.PI / 2, 0, 0]}>
  <torusGeometry args={[0.3, 0.055, 12, 28, Math.PI * 1.25]} />
  <Fabric />
  </mesh>

  {/* 상단 스트랩 */}
  <mesh position={[0, 0.36, -0.16]} scale={[1, 0.75, 1]}>
  <torusGeometry args={[0.3, 0.032, 10, 28, Math.PI]} />
  <Fabric color={FABRIC_2} />
  </mesh>
 </group>
 );
};

// ================= Phone =================
export const MobilePhone: React.FC<DeviceProps> = ({ isSelected, isHovered, onClick, onPointerOver, onPointerOut }) => {
 const initialY = DESK;
 const baseRotation: [number, number, number] = [-Math.PI / 2, 0, 0.35];
 const tiltRotation: [number, number, number] = [-1.0, 0, 0.1];
 const groupRef = useHoverAnimation(initialY, isHovered, isSelected, baseRotation, tiltRotation, DESK + 0.7);

 return (
 <group
  ref={groupRef}
  position={[-0.2, initialY, -1]}
  rotation={baseRotation}
  onClick={onClick}
  onPointerOver={onPointerOver}
  onPointerOut={onPointerOut}
 >
  {/* 티타늄 프레임 — 살짝 크게 깔아 테두리로 보이게 */}
  <RoundedBox args={[0.455, 0.935, 0.03]} radius={0.042} smoothness={8}>
  <Metal color={TITAN} />
  </RoundedBox>
  {/* 후면 유리 */}
  <RoundedBox args={[0.44, 0.92, 0.032]} radius={0.038} smoothness={8} position={[0, 0, -0.002]}>
  <meshStandardMaterial color="#4a515a" roughness={0.35} metalness={0.5} />
  </RoundedBox>
  {/* 전면 디스플레이 */}
  <RoundedBox args={[0.425, 0.905, 0.034]} radius={0.036} smoothness={8} position={[0, 0, 0.003]}>
  <Glassy />
  </RoundedBox>

  {/* 후면 카메라 3구 — 링 + 렌즈 */}
  {[0.3, 0.175, 0.05].map((y, i) => (
  <group key={i} position={[-0.135, y, -0.022]}>
   <mesh rotation={[Math.PI / 2, 0, 0]}>
   <cylinderGeometry args={[0.046, 0.046, 0.016, 24]} />
   <Metal color="#6a717a" />
   </mesh>
   <mesh position={[0, 0, -0.006]} rotation={[Math.PI / 2, 0, 0]}>
   <cylinderGeometry args={[0.032, 0.032, 0.018, 24]} />
   <Glassy color="#0d0f12" />
   </mesh>
  </group>
  ))}
 </group>
 );
};

// ================= Watch =================
export const Watch: React.FC<DeviceProps> = ({ isSelected, isHovered, onClick, onPointerOver, onPointerOut }) => {
 const initialY = DESK;
 const baseRotation: [number, number, number] = [-Math.PI / 2, 0, 0.9];
 const tiltRotation: [number, number, number] = [-1.1, 0, 0.6];
 const groupRef = useHoverAnimation(initialY, isHovered, isSelected, baseRotation, tiltRotation, DESK + 0.4);

 return (
 <group
  ref={groupRef}
  position={[3.5, initialY, -2]}
  rotation={baseRotation}
  onClick={onClick}
  onPointerOver={onPointerOver}
  onPointerOut={onPointerOut}
 >
  {/* 스트랩 — 멀어질수록 가늘어지게 두 토막으로 */}
  <RoundedBox args={[0.2, 0.34, 0.028]} radius={0.014} smoothness={4} position={[0, 0.33, 0.01]}>
  <Fabric color={FABRIC_2} />
  </RoundedBox>
  <RoundedBox args={[0.17, 0.34, 0.025]} radius={0.012} smoothness={4} position={[0, 0.62, 0.005]}>
  <Fabric color={FABRIC_2} />
  </RoundedBox>
  <RoundedBox args={[0.2, 0.34, 0.028]} radius={0.014} smoothness={4} position={[0, -0.33, 0.01]}>
  <Fabric color={FABRIC_2} />
  </RoundedBox>
  <RoundedBox args={[0.17, 0.34, 0.025]} radius={0.012} smoothness={4} position={[0, -0.62, 0.005]}>
  <Fabric color={FABRIC_2} />
  </RoundedBox>

  {/* 케이스 — 스퀘어클 */}
  <RoundedBox args={[0.32, 0.38, 0.12]} radius={0.088} smoothness={8} position={[0, 0, 0.065]}>
  <Metal />
  </RoundedBox>
  {/* 글래스 — 살짝 볼록 */}
  <mesh position={[0, 0, 0.122]} scale={[0.137, 0.167, 0.022]}>
  <sphereGeometry args={[1, 32, 24]} />
  <Glassy />
  </mesh>
  {/* 용두 + 사이드 버튼 */}
  <mesh position={[0.168, 0.05, 0.075]} rotation={[0, 0, Math.PI / 2]}>
  <cylinderGeometry args={[0.026, 0.026, 0.035, 16]} />
  <Metal />
  </mesh>
  <RoundedBox args={[0.02, 0.1, 0.035]} radius={0.008} smoothness={3} position={[0.165, -0.09, 0.075]}>
  <Metal />
  </RoundedBox>
 </group>
 );
};

// ================= Monitor =================
export const Monitor: React.FC<DeviceProps> = ({ isSelected, roughness, isHovered, onClick, onPointerOver, onPointerOut }) => {
 const screen = useLoader(THREE.TextureLoader, SCREEN_URL);
 screen.colorSpace = THREE.SRGBColorSpace;

 const initialY = DESK;
 const baseRotation: [number, number, number] = [0, 0, 0];
 const tiltRotation: [number, number, number] = [0, 0, 0];
 const groupRef = useHoverAnimation(initialY, isHovered, isSelected, baseRotation, tiltRotation, DESK + 0.2);

 return (
 <group
  ref={groupRef}
  onClick={onClick}
  onPointerOver={onPointerOver}
  onPointerOut={onPointerOut}
  position={[0, initialY, 0.2]}
  rotation={baseRotation}
 >
  {/* 타원형 받침 */}
  <mesh position={[0, 0.016, 0.08]} scale={[1, 1, 0.62]}>
  <cylinderGeometry args={[0.52, 0.54, 0.032, 48]} />
  <Plastic color={SHELL_2} roughness={roughness ?? 0.45} />
  </mesh>
  {/* 목 */}
  <RoundedBox args={[0.42, 0.66, 0.05]} radius={0.022} smoothness={6} position={[0, 0.35, 0.02]}>
  <Plastic color={SHELL_2} roughness={roughness ?? 0.45} />
  </RoundedBox>

  {/* 본체 */}
  <RoundedBox args={[2.78, 1.72, 0.05]} radius={0.06} smoothness={8} position={[0, 1.52, 0]}>
  <Plastic roughness={roughness ?? 0.4} />
  </RoundedBox>
  {/* 어두운 베젤 — 화면이 흰 본체에 그냥 박힌 느낌을 없앤다 */}
  <RoundedBox args={[2.62, 1.52, 0.052]} radius={0.028} smoothness={6} position={[0, 1.59, 0.012]}>
  <meshStandardMaterial color="#20232a" roughness={0.45} metalness={0.1} />
  </RoundedBox>
  {/* 화면 */}
  <mesh position={[0, 1.59, 0.04]}>
  <planeGeometry args={[2.54, 1.44]} />
  <meshBasicMaterial map={screen} toneMapped={false} />
  </mesh>
 </group>
 );
};

// ================= Headphone =================
export const Headphone: React.FC<DeviceProps> = ({ isSelected, roughness, isHovered, onClick, onPointerOver, onPointerOut }) => {
 const initialY = DESK;
 const baseRotation: [number, number, number] = [0, 0.5, 0];
 const tiltRotation: [number, number, number] = [0.3, 0.9, 0];
 const groupRef = useHoverAnimation(initialY, isHovered, isSelected, baseRotation, tiltRotation, DESK + 0.9);

 return (
 <group
  ref={groupRef}
  onClick={onClick}
  onPointerOver={onPointerOver}
  onPointerOut={onPointerOut}
  position={[0, initialY, -0.4]}
  rotation={baseRotation}
 >
  {/* 헤드밴드 금속 프레임 (torus 기본 평면이 XY라 그대로 두면 머리 위로 호를 그린다) */}
  <mesh position={[0, 0.56, 0]}>
  <torusGeometry args={[0.43, 0.026, 12, 40, Math.PI]} />
  <Metal />
  </mesh>
  {/* 메시 캐노피 — 프레임 안쪽을 채우는 천. z로 눌러 납작한 띠로 */}
  <mesh position={[0, 0.56, 0]} scale={[1, 1, 0.42]}>
  <torusGeometry args={[0.4, 0.075, 14, 40, Math.PI]} />
  <Fabric />
  </mesh>

  {/* 이어컵을 잇는 금속 암 */}
  {[-1, 1].map((s, i) => (
  <mesh key={i} position={[s * 0.42, 0.52, 0]} rotation={[0, 0, s * 0.12]}>
   <cylinderGeometry args={[0.019, 0.019, 0.22, 14]} />
   <Metal />
  </mesh>
  ))}

  {/* 이어컵 */}
  {[-0.41, 0.41].map((x, i) => (
  <group key={i} position={[x, 0.3, 0]}>
   <RoundedBox args={[0.21, 0.58, 0.5]} radius={0.17} smoothness={8}>
   <Plastic roughness={roughness ?? 0.38} />
   </RoundedBox>
   {/* 메모리폼 쿠션 */}
   <mesh position={[x < 0 ? 0.105 : -0.105, 0, 0]} rotation={[0, 0, Math.PI / 2]} scale={[1, 1, 1.12]}>
   <cylinderGeometry args={[0.205, 0.205, 0.075, 28]} />
   <Fabric color={FABRIC_2} />
   </mesh>
  </group>
  ))}
 </group>
 );
};

// ================= Publication =================
export const Publication: React.FC<DeviceProps> = ({ isSelected, isHovered, onClick, onPointerOver, onPointerOut }) => {
 const cover = useLoader(THREE.TextureLoader, COVER_URL);
 cover.colorSpace = THREE.SRGBColorSpace;

 const initialY = DESK;
 const baseRotation: [number, number, number] = [0, -0.3, 0];
 const tiltRotation: [number, number, number] = [0.5, -0.3, 0];
 const groupRef = useHoverAnimation(initialY, isHovered, isSelected, baseRotation, tiltRotation, DESK + 0.7);

 return (
 <group
  ref={groupRef}
  onClick={onClick}
  onPointerOver={onPointerOver}
  onPointerOut={onPointerOut}
  position={[2, initialY, 0.2]}
  rotation={baseRotation}
 >
  {/* 아래 깔린 책들 — 살짝씩 어긋나게 쌓아 한 덩어리로 안 보이게 */}
  <RoundedBox args={[1.02, 0.022, 1.32]} radius={0.006} smoothness={2} position={[0.015, 0.011, -0.012]}>
  <Plastic color={SHELL_2} roughness={0.8} />
  </RoundedBox>
  <RoundedBox args={[1.0, 0.02, 1.3]} radius={0.006} smoothness={2} position={[-0.01, 0.032, 0.008]}>
  <Plastic roughness={0.8} />
  </RoundedBox>
  {/* 맨 위 표지 */}
  <RoundedBox args={[0.99, 0.016, 1.29]} radius={0.005} smoothness={2} position={[0, 0.05, 0]}>
  <Plastic color="#ffffff" roughness={0.75} />
  </RoundedBox>
  <mesh position={[0, 0.059, 0]} rotation={[-Math.PI / 2, 0, 0]}>
  <planeGeometry args={[0.95, 1.25]} />
  <meshBasicMaterial map={cover} toneMapped={false} />
  </mesh>
 </group>
 );
};
