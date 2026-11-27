import React, { useRef } from 'react';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';

// useLoader를 세 번 따로 부르면 호출마다 Suspense가 걸려
// 앞 텍스처가 끝나야 다음 요청이 나가는 폭포(waterfall)가 된다. 배열로 넘겨 병렬화한다.
const ICON_URLS = [
 `${import.meta.env.BASE_URL}3DUI/calendar.webp`,
 `${import.meta.env.BASE_URL}3DUI/clock.webp`,
 `${import.meta.env.BASE_URL}3DUI/reminder.webp`,
];

// 모델은 useGLTF.preload가 있어서 모듈 평가 시점에 바로 받기 시작하는데
// 이 텍스처들만 빠져 있었다. 그래서 GLB가 전부 끝나고 React가 이 컴포넌트까지
// 렌더해야 비로소 요청이 나갔고, 실측상 GLB 완료 후 약 1.2초 뒤에야 시작했다.
// 같은 시점에 미리 걸어두면 GLB와 나란히 내려온다.
useLoader.preload(THREE.TextureLoader, ICON_URLS);

const FloatingIcons: React.FC = () => {
 const [calendarTex, clockTex, reminderTex] = useLoader(THREE.TextureLoader, ICON_URLS);

 // Ensure SRGB encoding for correct color output
 calendarTex.colorSpace = THREE.SRGBColorSpace;
 clockTex.colorSpace = THREE.SRGBColorSpace;
 reminderTex.colorSpace = THREE.SRGBColorSpace;

 const calendarRatio = calendarTex.image.width / calendarTex.image.height;
 const clockRatio = clockTex.image.width / clockTex.image.height;
 const reminderRatio = reminderTex.image.width / reminderTex.image.height;

 // Base height for consistency
 const height = 1.25;

 return (
 <group position={[0, 2, -2]}>
  {/* Calendar */}
  <mesh position={[-3, -1, -.5]}>
  <planeGeometry args={[height * calendarRatio, height]} />
  <meshBasicMaterial map={calendarTex} transparent side={THREE.DoubleSide} toneMapped={false} color="white" />
  </mesh>

  {/* Clock */}
  <mesh position={[-1.5, 1, 0]}>
  <planeGeometry args={[height * clockRatio, height]} />
  <meshBasicMaterial map={clockTex} transparent side={THREE.DoubleSide} toneMapped={false} color="white" />
  </mesh>

  {/* Reminder */}
  <mesh position={[2, .5, .5]}>
  <planeGeometry args={[height * reminderRatio, height]} />
  <meshBasicMaterial map={reminderTex} transparent side={THREE.DoubleSide} toneMapped={false} color="white" />
  </mesh>
 </group>
 );
};

export default FloatingIcons;
