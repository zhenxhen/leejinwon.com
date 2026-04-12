import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, ContactShadows, OrthographicCamera, CameraControls, RoundedBox, Float, Preload } from '@react-three/drei';
import { PROJECTS, MONITOR_DATA, HEADPHONE_DATA, PUBLICATION_DATA } from '../constants';
import { DeviceType, Project, ScreenRect } from '../types';
import { XRHeadset, MobilePhone, Watch, Monitor, Headphone, Publication } from './DeviceObjects';
import FloatingIcons from './FloatingIcons';
import * as THREE from 'three';

interface ExperienceProps {
  currentProjectId: string | null;
  onProjectSelect: (project: Project | null) => void;
  onObstacleUpdate?: (rects: ScreenRect[]) => void;
}

// ---------- Obstacle Tracker ----------

type BoxDef = { kind: 'box'; lp: [number, number, number]; hs: [number, number, number] };
type SphereDef = { kind: 'sphere'; lp: [number, number, number]; r: number };
type ObsDef = BoxDef | SphereDef;

// All positions are LOCAL within the sceneOffset group.
// Monitor/Headphone: group at [x, 0.1, z] inside sceneOffset
// Projects group: [0, 0.1, 0] + project.position
// FloatingIcons: group at [0, 2, -2]
const OBSTACLE_DEFS: ObsDef[] = [
  // ── Desk surface (box projection = accurate screen rect) ──────
  { kind: 'box', lp: [0, 0.1, 0], hs: [5, 0.12, 2] }, // desk top
  { kind: 'box', lp: [0, -1.5, 0], hs: [4.3, 1.6, 1.8] }, // desk frame & legs
  // ── Static devices ────────────────────────────────────────────
  { kind: 'box', lp: [0, 0.1, -1.5], hs: [1.3, 1.4, 0.6] }, // Monitor
  { kind: 'sphere', lp: [4, 0.1, 1.5], r: 1.4 },  // Headphone
  { kind: 'sphere', lp: [0, 0.1, 0.3], r: 1.0 },  // Publication
  // ── Project devices ───────────────────────────────────────────
  { kind: 'sphere', lp: [0, 0.1 + 1.0, -0.5], r: 1.3 }, // XR Headset
  { kind: 'sphere', lp: [-1.2, 0.25, 0.8], r: 0.9 }, // Mobile
  { kind: 'sphere', lp: [0.2, 0.18, 1.2], r: 0.8 }, // Watch
  // ── Floating icons (group [0,2,-2] + mesh offsets) ────────────
  { kind: 'sphere', lp: [-3, 1.0, -2.5], r: 1.3 }, // Calendar
  { kind: 'sphere', lp: [-1.5, 3.0, -2.0], r: 1.1 }, // Clock
  { kind: 'sphere', lp: [2, 2.5, -1.5], r: 1.1 }, // Reminder
];

// Project a world-space axis-aligned box onto screen space by projecting all 8 corners.
function projectBox(
  lp: [number, number, number], hs: [number, number, number],
  off: [number, number, number], cam: THREE.Camera,
  cvs: { width: number; height: number }, v: THREE.Vector3,
  margin = 8,
): ScreenRect {
  let mnX = Infinity, mxX = -Infinity, mnY = Infinity, mxY = -Infinity;
  for (const dx of [-1, 1]) for (const dy of [-1, 1]) for (const dz of [-1, 1]) {
    v.set(lp[0] + dx * hs[0] + off[0], lp[1] + dy * hs[1] + off[1], lp[2] + dz * hs[2] + off[2]);
    v.project(cam);
    const px = (v.x + 1) / 2 * cvs.width, py = (-v.y + 1) / 2 * cvs.height;
    if (px < mnX) mnX = px; if (px > mxX) mxX = px;
    if (py < mnY) mnY = py; if (py > mxY) mxY = py;
  }
  return { x: mnX - margin, y: mnY - margin, w: mxX - mnX + margin * 2, h: mxY - mnY + margin * 2 };
}

// Project a sphere obstacle using zoom × world-radius as screen radius.
function projectSphere(
  lp: [number, number, number], r: number,
  off: [number, number, number], cam: THREE.Camera,
  cvs: { width: number; height: number }, v: THREE.Vector3,
): ScreenRect {
  v.set(lp[0] + off[0], lp[1] + off[1], lp[2] + off[2]);
  v.project(cam);
  const cx = (v.x + 1) / 2 * cvs.width, cy = (-v.y + 1) / 2 * cvs.height;
  const sr = r * ((cam as THREE.OrthographicCamera).zoom ?? 60);
  return { x: cx - sr, y: cy - sr, w: sr * 2, h: sr * 2 };
}

interface ObstacleTrackerProps {
  sceneOffset: [number, number, number];
  onUpdate: (rects: ScreenRect[]) => void;
}

const ObstacleTracker: React.FC<ObstacleTrackerProps> = ({ sceneOffset, onUpdate }) => {
  const { camera, size } = useThree();
  const tickRef = useRef(0);
  const v = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (t - tickRef.current < 0.083) return; // ~12 fps

    tickRef.current = t;
    const rects: ScreenRect[] = OBSTACLE_DEFS.map(def =>
      def.kind === 'box'
        ? projectBox(def.lp, def.hs, sceneOffset, camera, size, v)
        : projectSphere(def.lp, def.r, sceneOffset, camera, size, v),
    );
    onUpdate(rects);
  });

  return null;
};

// Focus Targets for Camera Animation (Calculated from Group + Internal Offsets)
const FOCUS_TARGETS: { [key: string]: { target: [number, number, number], zoom: number } } = {
  // Hardcoded Objects
  'monitor': { target: [0, 1.4, -1.0], zoom: 110 },
  'publication': { target: [0, 0.5, -0.1], zoom: 90 },
  'headphone': { target: [4, 0.37, 0.1], zoom: 90 },

  // Dynamic Projects (Project Position + Device Internal Position)
  'xr-calendar': { target: [-3.5, 1.55, 0], zoom: 90 },
  'mobile-music': { target: [-0.2, 0.05, -1], zoom: 100 },
  'watch-alarm': { target: [3.5, 0.38, -0.8], zoom: 130 },
};

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


      <Environment preset="studio" blur={1} background={false} environmentIntensity={0.5} />
    </>
  );
};

const DeskEnvironment = () => {
  const legRadius = 0.04; // Thin tubular steel
  const legHeight = 3;
  const deskWidth = 10;
  const deskDepth = 4;
  const frameWidth = 3; // Depth of the side frame
  const frameOffset = 4; // X-offset for side frames
  const materialProps = { color: "#e2e8f0", roughness: .5, metalness: .1 }; // Chrome-like

  return (
    <group position={[0, 0, 0]}>
      {/* Desk Top - Clean White */}
      <RoundedBox args={[deskWidth, 0.2, deskDepth]} radius={0.02} smoothness={4} position={[0, 0, 0]} receiveShadow castShadow>
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

const SceneContent: React.FC<SceneContentProps> = ({ currentProjectId, onProjectSelect, hoveredId, setHoveredId, onObstacleUpdate }) => {
  const controlsRef = useRef<CameraControls>(null);
  const [sceneOffset, setSceneOffset] = useState<[number, number, number]>([0, 1, 0]);

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
      setTimeout(() => {
        controlsRef.current?.setLookAt(-20, 20, 40, 0, 0, 0, true);
      }, 10);
    }

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

          controlsRef.current.setTarget(...target, true);
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
        minZoom={20}
        maxZoom={150}
        minPolarAngle={1}
        maxPolarAngle={Math.PI / 2}
        minAzimuthAngle={-1}
        maxAzimuthAngle={1}
        dollySpeed={0} // Disable Scroll Zoom via speed
        mouseButtons={{ left: 1, middle: 0, right: 0, wheel: 0 }} // Disable wheel capture to allow page scroll
        touches={{ one: 1, two: 0, three: 0 }} // Enable touch rotation (1=ROTATE) to match mouse
        smoothTime={0.4} // Improved responsiveness while maintaining smoothness
        enabled={true}
      />

      <LightingController />

      <group position={sceneOffset}>
        <DeskEnvironment />

        {/* Publication */}
        <group position={[0, 0.1, -0.1]}>
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
        <group position={[0, 0.1, -1.5]}>
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

        <group position={[4, 0.1, 1.5]}>
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
        <group position={[0, 0.1, 0]}>
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
              <group key={project.id} position={project.position}>
                {project.deviceType === DeviceType.XR_HEADSET && <XRHeadset {...commonProps} />}
                {project.deviceType === DeviceType.MOBILE && <MobilePhone {...commonProps} />}
                {project.deviceType === DeviceType.WATCH && <Watch {...commonProps} />}
              </group>
            );
          })}
        </group>
      </group>

      {/* Reports 3D device screen projections to 2D text layout each frame */}
      {onObstacleUpdate && (
        <ObstacleTracker sceneOffset={sceneOffset} onUpdate={onObstacleUpdate} />
      )}
    </>
  );
};

export const Experience: React.FC<ExperienceProps> = (props) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
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