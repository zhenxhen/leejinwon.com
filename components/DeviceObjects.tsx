import React, { useRef, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

import { DeviceType } from '../types';
import { DEVICES } from './sceneLayout';

// Draco 디코더를 자체 호스팅한다.
// 기본값은 https://www.gstatic.com/draco/versioned/decoders/… 로, 모델을 풀기 전에
// 외부 도메인으로 DNS+TLS+요청 왕복이 한 번 더 생긴다. same-origin으로 바꾸면
// 번들과 같은 커넥션을 쓰고 브라우저 캐시도 길게 먹는다.
const DRACO_PATH = `${import.meta.env.BASE_URL}draco/`;

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
 // Floating Animation
 const baseHeight = selectedY !== undefined ? selectedY : (initialY + 0.2);
 targetY = baseHeight + Math.sin(state.clock.getElapsedTime() * 2) * 0.05;
 } else if (isHovered) {
 // Hover Lift: Fixed at 0.2
 targetY = initialY + 0.2;
 }


 // Smoothly interpolate to the target position
 // Using lerp prevents jumps when switching between states (e.g. Select -> Default)
 groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, delta * 5);

 // Rotation Animation
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

export const XRHeadset: React.FC<DeviceProps> = ({ color, roughness, isSelected, isHovered, onClick, onPointerOver, onPointerOut }) => {
 const { scene } = useGLTF(`${import.meta.env.BASE_URL}models/XR.glb`, DRACO_PATH);
 const layout = DEVICES['xr-calendar'];
 const groupRef = useHoverAnimation(
  layout.local[1], isHovered, isSelected, layout.rotation, layout.tilt, layout.selectedY
 );

 const clone = useMemo(() => {
 const c = scene.clone();
 c.traverse((child: any) => {
 if (child.isMesh && child.material) {
 child.material = child.material.clone();
 child.material.roughness = roughness ?? 1;
 }
 });
 return c;
 }, [scene, roughness]);

 return (
 <group
 ref={groupRef}
 //XR position
 onClick={onClick}
 onPointerOver={onPointerOver}
 onPointerOut={onPointerOut}
 position={layout.local}
 rotation={layout.rotation}
 >
 <primitive
 object={clone}
 scale={layout.scale}
 />
 </group>
 );
};





export const MobilePhone: React.FC<DeviceProps> = ({ color, roughness, isSelected, isHovered, onClick, onPointerOver, onPointerOut }) => {
 const { scene } = useGLTF(`${import.meta.env.BASE_URL}models/phone.glb`, DRACO_PATH);
 const layout = DEVICES['mobile-music'];
 const groupRef = useHoverAnimation(
  layout.local[1], isHovered, isSelected, layout.rotation, layout.tilt, layout.selectedY
 );

 // Clone the scene to allow independent rendering if used multiple times
 const clone = useMemo(() => {
 const c = scene.clone();
 c.traverse((child: any) => {
 if (child.isMesh && child.material) {
 child.material = child.material.clone();
 child.material.roughness = roughness ?? 1; // Default from user edit
 }
 });
 return c;
 }, [scene, roughness]);

 // phone position
 return (
 <group
 ref={groupRef}
 position={layout.local}
 rotation={layout.rotation}
 onClick={onClick}
 onPointerOver={onPointerOver}
 onPointerOut={onPointerOut}
 >
 <primitive
 object={clone}
 scale={layout.scale}
 />
 </group>
 );
};

export const Watch: React.FC<DeviceProps> = ({ color, roughness, isSelected, isHovered, onClick, onPointerOver, onPointerOut }) => {
 const { scene } = useGLTF(`${import.meta.env.BASE_URL}models/smartwatch.glb`, DRACO_PATH);
 const layout = DEVICES['watch-alarm'];
 const groupRef = useHoverAnimation(
  layout.local[1], isHovered, isSelected, layout.rotation, layout.tilt, layout.selectedY
 );

 const clone = useMemo(() => {
 const c = scene.clone();
 c.traverse((child: any) => {
 if (child.isMesh && child.material) {
 child.material = child.material.clone();
 child.material.roughness = roughness ?? 1;
 }
 });
 return c;
 }, [scene, roughness]);

 // watch position
 return (
 <group
 ref={groupRef}
 position={layout.local}
 rotation={layout.rotation}
 // Rotation handled by hook now
 onClick={onClick}
 onPointerOver={onPointerOver}
 onPointerOut={onPointerOut}
 >
 <primitive
 object={clone}
 scale={layout.scale}
 />
 </group>
 );
};

export const Monitor: React.FC<DeviceProps> = ({ isSelected, roughness, isHovered, onClick, onPointerOver, onPointerOut }) => {
 const { scene } = useGLTF(`${import.meta.env.BASE_URL}models/monitor.glb`, DRACO_PATH);
 const layout = DEVICES['monitor'];
 const groupRef = useHoverAnimation(
  layout.local[1], isHovered, isSelected, layout.rotation, layout.tilt, layout.selectedY
 );

 const clone = useMemo(() => {
 const c = scene.clone();
 c.traverse((child: any) => {
 if (child.isMesh && child.material) {
 child.material = child.material.clone();
 child.material.roughness = roughness ?? 1;
 }
 });
 return c;
 }, [scene, roughness]);

 return (
 <group
 ref={groupRef}
 //monitor position
 onClick={onClick}
 onPointerOver={onPointerOver}
 onPointerOut={onPointerOut}
 position={layout.local}
 rotation={layout.rotation}
 >
 <primitive
 object={clone}
 scale={layout.scale}
 />
 </group>
 );
};

export const Headphone: React.FC<DeviceProps> = ({ isSelected, roughness, isHovered, onClick, onPointerOver, onPointerOut }) => {
 const { scene } = useGLTF(`${import.meta.env.BASE_URL}models/headphone.glb`, DRACO_PATH);
 const layout = DEVICES['headphone'];
 const groupRef = useHoverAnimation(
  layout.local[1], isHovered, isSelected, layout.rotation, layout.tilt, layout.selectedY
 );

 const clone = useMemo(() => {
 const c = scene.clone();
 c.traverse((child: any) => {
 if (child.isMesh && child.material) {
 child.material = child.material.clone();
 child.material.roughness = roughness ?? 1;
 }
 });
 return c;
 }, [scene, roughness]);

 return (
 <group
 ref={groupRef}
 //headphone position
 onClick={onClick}
 onPointerOver={onPointerOver}
 onPointerOut={onPointerOut}
 position={layout.local}
 rotation={layout.rotation}
 >
 <primitive
 object={clone}
 scale={layout.scale}
 />
 </group>
 );
};

export const Publication: React.FC<DeviceProps> = ({ isSelected, roughness, isHovered, onClick, onPointerOver, onPointerOut }) => {
 const { scene } = useGLTF(`${import.meta.env.BASE_URL}models/news.glb`, DRACO_PATH);
 const layout = DEVICES['publication'];
 const groupRef = useHoverAnimation(
  layout.local[1], isHovered, isSelected, layout.rotation, layout.tilt, layout.selectedY
 );

 const clone = useMemo(() => {
 const c = scene.clone();
 c.traverse((child: any) => {
 if (child.isMesh && child.material) {
 child.material = child.material.clone();
 child.material.roughness = roughness ?? 1;
 }
 });
 return c;
 }, [scene, roughness]);

 return (
 <group
 ref={groupRef}
 onClick={onClick}
 onPointerOver={onPointerOver}
 onPointerOut={onPointerOut}
 position={layout.local}
 rotation={layout.rotation}
 >
 <primitive
 object={clone}
 scale={layout.scale}
 />
 </group>
 );
};

// Preload all GLB models so they start downloading before Suspense mounts
useGLTF.preload(`${import.meta.env.BASE_URL}models/XR.glb`, DRACO_PATH);
useGLTF.preload(`${import.meta.env.BASE_URL}models/phone.glb`, DRACO_PATH);
useGLTF.preload(`${import.meta.env.BASE_URL}models/smartwatch.glb`, DRACO_PATH);
useGLTF.preload(`${import.meta.env.BASE_URL}models/monitor.glb`, DRACO_PATH);
useGLTF.preload(`${import.meta.env.BASE_URL}models/headphone.glb`, DRACO_PATH);
useGLTF.preload(`${import.meta.env.BASE_URL}models/news.glb`, DRACO_PATH);