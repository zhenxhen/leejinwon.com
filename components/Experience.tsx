import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer, ContactShadows, OrthographicCamera, CameraControls, RoundedBox, Float, Preload, useProgress } from '@react-three/drei';
import { PROJECTS, MONITOR_DATA, HEADPHONE_DATA, PUBLICATION_DATA } from '../constants';
import { DeviceType, Project } from '../types';
import { SCENE_OFFSET, DESK, CAMERA, DEVICES, FLOATING_ICONS } from './sceneLayout';
import { XRHeadset, MobilePhone, Watch, Monitor, Headphone, Publication } from './DeviceObjects';
import FloatingIcons from './FloatingIcons';
import * as THREE from 'three';

interface ExperienceProps {
  currentProjectId: string | null;
  onProjectSelect: (project: Project | null) => void;
  onReady?: () => void;
  // 로딩 % 를 바깥(UIOverlay)으로 올려준다. useProgress를 UIOverlay에서 직접
  // 부르면 drei가 메인 번들에 정적으로 딸려와 코드 스플리팅이 무효가 된다.
  onProgress?: (progress: number) => void;
}

const FOCUS_TARGETS: { [key: string]: { target: [number, number, number]; zoom: number } } =
  Object.fromEntries(Object.entries(DEVICES).map(([id, d]) => [id, d.focus]));

// Lighting Controller - Static Studio Lighting
const LightingController = () => {
  return (
    <>
      <ambientLight intensity={1} color="#ffffff" />

      <directionalLight
        position={[100, 5, 0]}
        intensity={5}
        castShadow
        shadow-bias={0}
        shadow-mapSize={[2048, 2048]}
      />

      {/* 보조 광원. 우측/좌측에서 오는 반사광 역할 */}
      <directionalLight position={[0, 5, 30]} intensity={5} color="#eef2ff" />


      {/*
        이전: <Environment preset="studio" /> — drei가 raw.githack.com에서
        studio_small_03_1k.hdr(1.68MB, cache-control 5분)을 매번 받아왔고,
        그게 끝나기 전엔 Suspense가 풀리지 않아 3D가 아예 안 떴다.
        아래는 같은 스튜디오 룩을 Lightformer로 직접 구성한 것. 네트워크 요청 0바이트.
      */}
      <Environment resolution={256} background={false} environmentIntensity={0.5}>
        {/* 상단 대형 소프트박스 (키 라이트) */}
        <Lightformer
          form="rect"
          intensity={3}
          position={[0, 8, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={[14, 14, 1]}
          color="#ffffff"
        />
        {/* 정면 필 — 기기 전면을 밝게 */}
        <Lightformer
          form="rect"
          intensity={1.8}
          position={[0, 2, 10]}
          scale={[16, 9, 1]}
          color="#f6f8ff"
        />
        {/* 좌우 반사 스트립 — 금속/글래스 하이라이트 */}
        <Lightformer
          form="rect"
          intensity={2.2}
          position={[-10, 2, 2]}
          rotation={[0, Math.PI / 2, 0]}
          scale={[12, 7, 1]}
          color="#ffffff"
        />
        <Lightformer
          form="rect"
          intensity={2.2}
          position={[10, 2, 2]}
          rotation={[0, -Math.PI / 2, 0]}
          scale={[12, 7, 1]}
          color="#eef2ff"
        />
        {/* 후면 림 라이트 */}
        <Lightformer
          form="rect"
          intensity={1.2}
          position={[0, 4, -10]}
          rotation={[0, Math.PI, 0]}
          scale={[14, 7, 1]}
          color="#ffffff"
        />
        {/* 바닥 바운스 — 흰 책상 반사 */}
        <Lightformer
          form="rect"
          intensity={0.8}
          position={[0, -4, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[14, 14, 1]}
          color="#ffffff"
        />
      </Environment>
    </>
  );
};

const DeskEnvironment = () => {
  const { legRadius, legHeight, width: deskWidth, depth: deskDepth, frameWidth, frameOffset } = DESK;
  const materialProps = { color: "#e2e8f0", roughness: .5, metalness: .1 }; // Chrome-like

  return (
    <group position={[0, 0, 0]}>
      {/* Desk Top - Clean White */}
      <RoundedBox args={[deskWidth, DESK.topThickness, deskDepth]} radius={DESK.topRadius} smoothness={4} position={[0, 0, 0]} receiveShadow castShadow>
        <meshStandardMaterial color="#f8fafc" roughness={0.1} metalness={0.1} />
      </RoundedBox>

      {/* Eiermann Frame Structure */}
      <group position={[0, -legHeight / 2 - 0.1, 0]}>

        {/* Left Side Frame */}
        <group position={[-frameOffset, 0, 0]}>
          {/* Vertical Posts */}
          <mesh position={[0, 0, frameWidth / 2]} receiveShadow castShadow>
            <cylinderGeometry args={[legRadius, legRadius, legHeight, 16]} />
            <meshStandardMaterial {...materialProps} />
          </mesh>
          <mesh position={[0, 0, -frameWidth / 2]} receiveShadow castShadow>
            <cylinderGeometry args={[legRadius, legRadius, legHeight, 16]} />
            <meshStandardMaterial {...materialProps} />
          </mesh>
          {/* Bottom Runner */}
          <mesh position={[0, -legHeight / 2 + 0.5, 0]} rotation={[Math.PI / 2, 0, 0]} receiveShadow castShadow>
            <cylinderGeometry args={[legRadius, legRadius, frameWidth, 16]} />
            <meshStandardMaterial {...materialProps} />
          </mesh>
          {/* Top Runner */}
          <mesh position={[0, legHeight / 2 - 0.5, 0]} rotation={[Math.PI / 2, 0, 0]} receiveShadow castShadow>
            <cylinderGeometry args={[legRadius, legRadius, frameWidth, 16]} />
            <meshStandardMaterial {...materialProps} />
          </mesh>
        </group>

        {/* Right Side Frame */}
        <group position={[frameOffset, 0, 0]}>
          {/* Vertical Posts */}
          <mesh position={[0, 0, frameWidth / 2]} receiveShadow castShadow>
            <cylinderGeometry args={[legRadius, legRadius, legHeight, 16]} />
            <meshStandardMaterial {...materialProps} />
          </mesh>
          <mesh position={[0, 0, -frameWidth / 2]} receiveShadow castShadow>
            <cylinderGeometry args={[legRadius, legRadius, legHeight, 16]} />
            <meshStandardMaterial {...materialProps} />
          </mesh>
          {/* Bottom Runner */}
          <mesh position={[0, -legHeight / 2 + 0.5, 0]} rotation={[Math.PI / 2, 0, 0]} receiveShadow castShadow>
            <cylinderGeometry args={[legRadius, legRadius, frameWidth, 16]} />
            <meshStandardMaterial {...materialProps} />
          </mesh>
          {/* Top Runner */}
          <mesh position={[0, legHeight / 2 - 0.5, 0]} rotation={[Math.PI / 2, 0, 0]} receiveShadow castShadow>
            <cylinderGeometry args={[legRadius, legRadius, frameWidth, 16]} />
            <meshStandardMaterial {...materialProps} />
          </mesh>
        </group>

        {/* Cross Brace (The "X") */}
        {/* Connecting back-left to front-right and front-left to back-right centre bars */}
        <group position={[0, 0, 0]}>
          {/* 
  Math for Diagonal:
  Width = frameOffset * 2 = 8
  Height = legHeight = 3
  Hypotenuse = sqrt(8^2 + 3^2) = sqrt(73) ≈ 8.544
  Angle from Vertical (Cylinder default): atan(Width / Height) = atan(8/3) ≈ 1.212 rad (69.4 deg)
  */}

          {/* Bar 1: Top-Left to Bottom-Right */}
          {/* Offset Z slightly to avoid intersection */}
          <mesh position={[0, 0, 0]} rotation={[0, 0, -Math.atan((frameOffset * 2 + 4) / legHeight)]} receiveShadow castShadow>
            <cylinderGeometry args={[legRadius, legRadius, Math.hypot(frameOffset * 2 - .3, legHeight), 16]} />
            <meshStandardMaterial {...materialProps} />
          </mesh>

          {/* Bar 2: Bottom-Left to Top-Right */}
          {/* Offset Z slightly opposite */}
          <mesh position={[0, 0, -legRadius]} rotation={[0, 0, Math.atan((frameOffset * 2 + 4) / legHeight)]} receiveShadow castShadow>
            <cylinderGeometry args={[legRadius, legRadius, Math.hypot(frameOffset * 2 - .3, legHeight), 16]} />
            <meshStandardMaterial {...materialProps} />
          </mesh>
        </group>

      </group>
      <ContactShadows position={[0, 0.11, 0]} opacity={0.1} scale={10} blur={1.5} far={4} color="#000000" />
    </group>
  );
};

interface SceneContentProps extends ExperienceProps {
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
}

const SceneContent: React.FC<SceneContentProps> = ({ currentProjectId, onProjectSelect, hoveredId, setHoveredId, onReady }) => {
  const controlsRef = useRef<CameraControls>(null);
  const [sceneOffset, setSceneOffset] = useState<[number, number, number]>(SCENE_OFFSET);

  // Handle responsive scene position
  useEffect(() => {
    const handleLayoutResize = () => {
      // Mobile: Move slightly down (-0.5) to avoid overlap with top UI
      // Desktop: Keep original position (1)
      const isMobile = window.innerWidth < 768;
      setSceneOffset(isMobile ? [0, -1, 0] : [0, 1, 0]);
    };

    handleLayoutResize();
    window.addEventListener('resize', handleLayoutResize);
    return () => window.removeEventListener('resize', handleLayoutResize);
  }, []);

  // Calculate responsive zoom based on window width
  const getResponsiveZoom = () => {
    if (typeof window === 'undefined') return 50;
    // Account for Sidebar width (256px) on desktop
    const effectiveWidth = window.innerWidth > 768 ? window.innerWidth - 256 : window.innerWidth;
    return Math.max(40, Math.min(100, (effectiveWidth / 1600) * 100));
  };

  const initialZoom = getResponsiveZoom();

  // Sync Camera with Settings - Runs ONLY if props are provided (Admin Mode)


  // Dynamic Zoom & Position Logic
  useEffect(() => {
    const handleResize = () => {
      if (controlsRef.current) {
        // Return to responsive zoom level
        const defaultZoom = getResponsiveZoom();
        controlsRef.current.zoomTo(defaultZoom, true);
      }
    };

    // Initial set
    handleResize();

    // Camera Entry Animation
    if (controlsRef.current) {
      controlsRef.current.setLookAt(0, 0, 50, 0, 0, 0, false);
      // Wait for models to fully settle before starting animation
      setTimeout(() => {
        controlsRef.current?.setLookAt(-20, 20, 40, 0, 0, 0, true);
      }, 500);
    }

    if (onReady) onReady();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Zoom & Focus Animation Effect
  useEffect(() => {
    const updateCamera = () => {
      if (controlsRef.current) {
        if (currentProjectId && FOCUS_TARGETS[currentProjectId]) {
          // Focus on selected object with responsive zoom
          const { target, zoom } = FOCUS_TARGETS[currentProjectId];
          // Calculate effective width (matching layout logic)
          const effectiveWidth = window.innerWidth > 768 ? window.innerWidth - 256 : window.innerWidth;

          // Scale zoom: 100% at 1200px effective width, linearly down to 60% minimum
          // User requested proportional scaling for smaller screens
          const scaleFactor = Math.min(1, Math.max(0.4, effectiveWidth / 1200));
          const responsiveZoom = zoom * scaleFactor;

          // 선택 중에는 타깃을 올려 씬을 아래로 내린다 (상단 텍스트 가독성)
          controlsRef.current.setTarget(target[0], target[1] + CAMERA.activeTargetLift, target[2], true);
          controlsRef.current.zoomTo(responsiveZoom, true);
        } else {
          // Reset to default view
          controlsRef.current.setTarget(0, 0, 0, true);

          // Return to responsive zoom level
          const defaultZoom = getResponsiveZoom();
          controlsRef.current.zoomTo(defaultZoom, true);
        }
      }
    };

    updateCamera();

    // Add resize listener to update zoom dynamically even when selected
    window.addEventListener('resize', updateCamera);
    return () => window.removeEventListener('resize', updateCamera);
  }, [currentProjectId]);

  const handlePointerOver = (id: string) => (e: any) => {
    e.stopPropagation(); // Stop propagation to avoid bubbling to other objects
    document.body.style.cursor = 'pointer';
    setHoveredId(id);
  };

  const handlePointerOut = () => {
    document.body.style.cursor = 'auto';
    setHoveredId(null);
  };

  return (
    <>
      {/* Orthographic Camera for Isometric View */}
      <OrthographicCamera
        makeDefault
        position={[0, 0, 50]} // Start at Front View
        zoom={initialZoom}
        near={-10}
        far={100}
      />

      <CameraControls
        ref={controlsRef}
        // polarAngle={Math.PI / 2}
        // azimuthAngle={0}
        minZoom={CAMERA.minZoom}
        maxZoom={CAMERA.maxZoom}
        minPolarAngle={CAMERA.minPolarAngle}
        maxPolarAngle={CAMERA.maxPolarAngle}
        minAzimuthAngle={CAMERA.minAzimuthAngle}
        maxAzimuthAngle={CAMERA.maxAzimuthAngle}
        dollySpeed={0} // Disable Scroll Zoom via speed
        mouseButtons={{ left: 1, middle: 0, right: 0, wheel: 0 }} // Disable wheel capture to allow page scroll
        touches={{ one: 1, two: 0, three: 0 }} // Enable touch rotation (1=ROTATE) to match mouse
        smoothTime={CAMERA.smoothTime}
        enabled={true}
      />

      <LightingController />

      <group position={sceneOffset}>
        <DeskEnvironment />

        {/* Publication */}
        <group position={DEVICES.publication.mount}>
          <Publication
            type={DeviceType.PUBLICATION}
            color="#000000"
            isSelected={currentProjectId === 'publication'}
            isHovered={hoveredId === 'publication'}
            onClick={(e: any) => {
              e.stopPropagation();
              onProjectSelect(currentProjectId === 'publication' ? null : PUBLICATION_DATA);
            }}
            onPointerOver={handlePointerOver('publication')}
            onPointerOut={handlePointerOut}
          />
        </group>

        {/* Monitor - Static Central Piece */}
        <group position={DEVICES.monitor.mount}>
          <Monitor
            type={DeviceType.MONITOR}
            color="#000000"
            isSelected={currentProjectId === 'monitor'}
            isHovered={hoveredId === 'monitor'}
            onClick={(e: any) => {
              e.stopPropagation();
              onProjectSelect(currentProjectId === 'monitor' ? null : MONITOR_DATA);
            }}
            onPointerOver={handlePointerOver('monitor')}
            onPointerOut={handlePointerOut}
          />
        </group>

        <group position={DEVICES.headphone.mount}>
          <Headphone
            type={DeviceType.HEADPHONE}
            color="#000000"
            roughness={1}
            isSelected={currentProjectId === 'headphone'}
            isHovered={hoveredId === 'headphone'}
            onClick={(e: any) => {
              e.stopPropagation();
              onProjectSelect(currentProjectId === 'headphone' ? null : HEADPHONE_DATA);
            }}
            onPointerOver={handlePointerOver('headphone')}
            onPointerOut={handlePointerOut}
          />
        </group>

        {/* Floating 3D UI Icons */}
        <FloatingIcons />

        {/* Render Projects */}
        {/* 높이는 각 기기 mount(SURFACE_Y 포함)가 가지므로 여기서 더하지 않는다 */}
        <group>
          {PROJECTS.map((project) => {
            const isSelected = currentProjectId === project.id;

            const commonProps = {
              key: project.id,
              type: project.deviceType,
              color: project.color,
              roughness: 0.6, // Default roughness
              isSelected: isSelected,
              isHovered: hoveredId === project.id,
              onClick: (e: any) => {
                e.stopPropagation();
                onProjectSelect(project.id === currentProjectId ? null : project);
              },
              onPointerOver: handlePointerOver(project.id),
              onPointerOut: handlePointerOut
            };

            return (
              <group key={project.id} position={DEVICES[project.id].mount}>
                {project.deviceType === DeviceType.XR_HEADSET && <XRHeadset {...commonProps} />}
                {project.deviceType === DeviceType.MOBILE && <MobilePhone {...commonProps} />}
                {project.deviceType === DeviceType.WATCH && <Watch {...commonProps} />}
              </group>
            );
          })}
        </group>
      </group>

    </>
  );
};

export const Experience: React.FC<ExperienceProps> = (props) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // 이 컴포넌트는 lazy 청크 안에 있으므로 여기서 useProgress를 쓰는 건 공짜다.
  const { progress } = useProgress();
  const { onProgress } = props;
  useEffect(() => { onProgress?.(progress); }, [progress, onProgress]);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (tooltipRef.current) {
        // Offset tooltip by 15px to not overlap cursor
        tooltipRef.current.style.transform = `translate(${e.clientX + 15}px, ${e.clientY + 15}px)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Configuration for 3D Object Names (Tooltip)
  const DEVICE_NAMES: { [key: string]: string } = {
    'monitor': 'Web Design',
    'publication': 'Publication',
    'headphone': 'PlayGroud🎉',
    'xr-calendar': 'XR UX',
    'mobile-music': 'Mobile UX',
    'watch-alarm': 'Wearable UX',
  };

  const getDeviceName = (id: string | null) => {
    if (!id) return '';
    return DEVICE_NAMES[id] || '';
  };

  return (
    <>
      <Canvas
        shadows
        dpr={[1, 2]}
        className="w-full h-full bg-white touch-none"
        onPointerMissed={() => props.onProjectSelect(null)}
      >
        <color attach="background" args={['#ffffff']} />
        <React.Suspense fallback={null}>
          <SceneContent {...props} hoveredId={hoveredId} setHoveredId={setHoveredId} />
        </React.Suspense>
        <Preload all />
      </Canvas>


      {/* Custom Cursor Tooltip */}
      <div
        ref={tooltipRef}
        className={`tooltip ${hoveredId ? 'opacity-100' : 'opacity-0'}`}
      >
        {getDeviceName(hoveredId)}
      </div>
    </>
  );
};