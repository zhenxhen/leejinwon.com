import React, { useRef } from 'react';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';

const FloatingIcons: React.FC = () => {
 // useLoader를 세 번 따로 부르면 각 호출이 Suspense를 걸기 때문에
 // 앞 텍스처가 끝나야 다음 요청이 나가는 폭포(waterfall)가 된다.
 // 실측상 calendar -> clock -> reminder가 순차로 ~400ms를 잡아먹었다.
 // 배열로 한 번에 넘기면 세 개가 병렬로 내려온다.
 const [calendarTex, clockTex, reminderTex] = useLoader(THREE.TextureLoader, [
  `${import.meta.env.BASE_URL}3DUI/calendar.png`,
  `${import.meta.env.BASE_URL}3DUI/clock.png`,
  `${import.meta.env.BASE_URL}3DUI/reminder.png`,
 ]);

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
