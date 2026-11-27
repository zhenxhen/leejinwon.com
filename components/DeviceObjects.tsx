import React, { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

import { DeviceType } from '../types';

/*
 * 기기들을 GLB 대신 프리미티브로 직접 만든다.
 *
 * 이전: 모델 6개 1,067KB(대부분 텍스처) + Draco 디코더 245KB를 받고 풀어야
 *       비로소 책상 위에 아무거나 나타났다.
 * 지금: 형상은 코드라 0바이트. 내용이 담긴 두 장(모니터 화면, 잡지 표지)만
 *       이미지로 남긴다.
 *
 * 각 컴포넌트는 바닥이 y=0에 오도록 그리고, 책상 높이는 바깥 group이 잡는다.
 */

// 책상 윗면 높이 (Experience의 desk top: lp[0,0.1,0] + hs[,0.12,])
const DESK = 0.22;

const SCREEN_URL = `${import.meta.env.BASE_URL}3DUI/screen.webp`;
const COVER_URL = `${import.meta.env.BASE_URL}3DUI/cover.webp`;
useLoader.preload(THREE.TextureLoader, [SCREEN_URL, COVER_URL]);

// 흰 스튜디오 룩에 맞춘 팔레트
const SHELL = '#f1f2f4';   // 흰 플라스틱/알루미늄
const SHELL_2 = '#dcdfe4';  // 한 톤 어두운 면
const GLASS = '#17191d';   // 화면·렌즈
const FABRIC = '#c8ccd3';   // 니트 밴드
const METAL = '#b9bfc7';

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

// Custom Hook for Smooth Hover Animation
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

// 자주 쓰는 재질
const shell = (roughness?: number, color = SHELL) => (
 <meshStandardMaterial color={color} roughness={roughness ?? 0.55} metalness={0.05} />
);

export const XRHeadset: React.FC<DeviceProps> = ({ roughness, isSelected, isHovered, onClick, onPointerOver, onPointerOut }) => {
 const initialY = DESK;
 const baseRotation: [number, number, number] = [0, -0.9, 0];
 const tiltRotation: [number, number, number] = [-0.45, -1.4, 0];
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
  {/* 바이저 본체 — 흰 프레임이 글래스를 둘러싸도록 한 치수 크게 */}
  <RoundedBox args={[1.22, 0.66, 0.5]} radius={0.2} smoothness={4} position={[0, 0.35, 0]}>
  {shell(roughness)}
  </RoundedBox>
  {/* 전면 글래스 — 앞으로 살짝만 내밀어 알약처럼 보이지 않게 */}
  <RoundedBox args={[1.02, 0.48, 0.52]} radius={0.13} smoothness={4} position={[0, 0.35, 0.04]}>
  <meshStandardMaterial color="#2a2e35" roughness={0.16} metalness={0.35} />
  </RoundedBox>
  {/* 니트 밴드 */}
  <mesh position={[0, 0.36, -0.42]} rotation={[Math.PI / 2, 0, 0]}>
  <torusGeometry args={[0.3, 0.075, 10, 24, Math.PI * 1.15]} />
  <meshStandardMaterial color={FABRIC} roughness={0.95} />
  </mesh>
  {/* 하단 받침 */}
  <RoundedBox args={[0.9, 0.08, 0.42]} radius={0.04} smoothness={3} position={[0, 0.04, -0.02]}>
  {shell(roughness, SHELL_2)}
  </RoundedBox>
 </group>
 );
};

export const MobilePhone: React.FC<DeviceProps> = ({ roughness, isSelected, isHovered, onClick, onPointerOver, onPointerOut }) => {
 const initialY = DESK;
 // 책상 위에 눕혀둔 상태. 선택되면 세워서 화면을 보여준다.
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
  <RoundedBox args={[0.42, 0.88, 0.035]} radius={0.05} smoothness={4}>
  {shell(roughness, SHELL_2)}
  </RoundedBox>
  {/* 화면 */}
  <RoundedBox args={[0.37, 0.82, 0.042]} radius={0.04} smoothness={4} position={[0, 0, 0.002]}>
  <meshStandardMaterial color={GLASS} roughness={0.15} metalness={0.2} />
  </RoundedBox>
  {/* 후면 카메라 3구 */}
  {[0.26, 0.14, 0.02].map((y, i) => (
  <mesh key={i} position={[-0.13, y, -0.03]} rotation={[Math.PI / 2, 0, 0]}>
   <cylinderGeometry args={[0.038, 0.038, 0.02, 16]} />
   <meshStandardMaterial color={GLASS} roughness={0.2} metalness={0.5} />
  </mesh>
  ))}
 </group>
 );
};

export const Watch: React.FC<DeviceProps> = ({ roughness, isSelected, isHovered, onClick, onPointerOver, onPointerOut }) => {
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
  {/* 스트랩 */}
  <RoundedBox args={[0.19, 0.98, 0.025]} radius={0.015} smoothness={3}>
  <meshStandardMaterial color={FABRIC} roughness={0.9} />
  </RoundedBox>
  {/* 케이스 */}
  <RoundedBox args={[0.32, 0.38, 0.14]} radius={0.07} smoothness={4} position={[0, 0, 0.08]}>
  {shell(roughness, METAL)}
  </RoundedBox>
  {/* 디스플레이 */}
  <RoundedBox args={[0.26, 0.32, 0.15]} radius={0.06} smoothness={4} position={[0, 0, 0.095]}>
  <meshStandardMaterial color={GLASS} roughness={0.12} metalness={0.25} />
  </RoundedBox>
  {/* 용두 */}
  <mesh position={[0.17, 0.07, 0.085]} rotation={[0, 0, Math.PI / 2]}>
  <cylinderGeometry args={[0.025, 0.025, 0.04, 12]} />
  <meshStandardMaterial color={METAL} roughness={0.3} metalness={0.7} />
  </mesh>
 </group>
 );
};

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
  {/* 받침 */}
  <RoundedBox args={[1.0, 0.045, 0.62]} radius={0.02} smoothness={3} position={[0, 0.022, 0.1]}>
  {shell(roughness, SHELL_2)}
  </RoundedBox>
  {/* 목 */}
  <RoundedBox args={[0.5, 0.62, 0.07]} radius={0.03} smoothness={3} position={[0, 0.34, 0]}>
  {shell(roughness, SHELL_2)}
  </RoundedBox>
  {/* 본체 */}
  <RoundedBox args={[2.75, 1.72, 0.07]} radius={0.05} smoothness={4} position={[0, 1.52, 0]}>
  {shell(roughness)}
  </RoundedBox>
  {/* 화면 (내용이라 이미지로 유지) */}
  <mesh position={[0, 1.58, 0.038]}>
  <planeGeometry args={[2.56, 1.44]} />
  <meshBasicMaterial map={screen} toneMapped={false} />
  </mesh>
 </group>
 );
};

export const Headphone: React.FC<DeviceProps> = ({ isSelected, roughness, isHovered, onClick, onPointerOver, onPointerOut }) => {
 const initialY = DESK;
 const baseRotation: [number, number, number] = [0, 0.5, 0];
 const tiltRotation: [number, number, number] = [0.35, 0.9, 0];
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
  {/* 헤드밴드 — torus 기본 평면(XY)이 곧 호 방향이라 회전시키지 않는다 */}
  <mesh position={[0, 0.53, 0]}>
  <torusGeometry args={[0.38, 0.062, 12, 32, Math.PI]} />
  <meshStandardMaterial color="#e3e6eb" roughness={0.5} metalness={0.1} />
  </mesh>
  {/* 밴드 쿠션 */}
  <RoundedBox args={[0.5, 0.07, 0.13]} radius={0.035} smoothness={3} position={[0, 0.92, 0]}>
  <meshStandardMaterial color={FABRIC} roughness={0.95} />
  </RoundedBox>
  {/* 이어컵 */}
  {[-0.38, 0.38].map((x, i) => (
  <group key={i} position={[x, 0.28, 0]}>
   <RoundedBox args={[0.2, 0.5, 0.44]} radius={0.12} smoothness={4}>
   {shell(roughness)}
   </RoundedBox>
   <mesh position={[x < 0 ? 0.11 : -0.11, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
   <cylinderGeometry args={[0.21, 0.21, 0.08, 20]} />
   <meshStandardMaterial color="#aeb4bd" roughness={0.95} />
   </mesh>
  </group>
  ))}
 </group>
 );
};

export const Publication: React.FC<DeviceProps> = ({ isSelected, roughness, isHovered, onClick, onPointerOver, onPointerOut }) => {
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
  {/* 책 묶음 */}
  <RoundedBox args={[1.0, 0.05, 1.3]} radius={0.008} smoothness={2} position={[0, 0.025, 0]}>
  {shell(roughness, '#ffffff')}
  </RoundedBox>
  {/* 표지 (내용이라 이미지로 유지) */}
  <mesh position={[0, 0.051, 0]} rotation={[-Math.PI / 2, 0, 0]}>
  <planeGeometry args={[0.96, 1.26]} />
  <meshBasicMaterial map={cover} toneMapped={false} />
  </mesh>
 </group>
 );
};
