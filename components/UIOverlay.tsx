import React, { useEffect, useState, useMemo } from 'react';
import { Project, ScreenRect } from '../types';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useProgress } from '@react-three/drei';
import { prepareWithSegments, layoutNextLine } from '@chenglou/pretext';
import type { LayoutCursor } from '@chenglou/pretext';

interface UIOverlayProps {
 selectedProject: Project | null;
 onClose: () => void;
 onNext: () => void;
 onPrev: () => void;
 currentIndex: number;
 totalCount: number;
 obstacleRects: ScreenRect[];
}

// ---------- pretext layout (project details only) ----------
const FONT_SIZE = 15;
const LINE_HEIGHT = 26;
const FONT_STR = `${FONT_SIZE}px "golos-text", sans-serif`;
const TEXT_LEFT = 32;
const MIN_LINE_W = 80;

interface RenderedLine { x: number; y: number; text: string }

function getFreeSegments(
 lineTop: number,
 lineBot: number,
 textLeft: number,
 textRight: number,
 obstacles: ScreenRect[],
 pad = 70,
): [number, number][] {
 const blocked: [number, number][] = [];
 for (const obs of obstacles) {
 if (obs.y + obs.h <= lineTop || obs.y >= lineBot) continue;
 const oL = obs.x - pad, oR = obs.x + obs.w + pad;
 if (oR <= textLeft || oL >= textRight) continue;
 blocked.push([Math.max(textLeft, oL), Math.min(textRight, oR)]);
 }
 blocked.sort((a, b) => a[0] - b[0]);
 const merged: [number, number][] = [];
 for (const r of blocked) {
 if (!merged.length || r[0] > merged[merged.length - 1][1]) merged.push([r[0], r[1]]);
 else merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], r[1]);
 }
 const free: [number, number][] = [];
 let cur = textLeft;
 for (const [bl, br] of merged) {
 if (bl - cur >= MIN_LINE_W) free.push([cur, bl]);
 cur = br;
 }
 if (textRight - cur >= MIN_LINE_W) free.push([cur, textRight]);
 return free;
}

function computeLines(
 text: string,
 obstacles: ScreenRect[],
 startY: number,
 endY: number,
 textRight: number,
): RenderedLine[] {
 const out: RenderedLine[] = [];
 const prepared = prepareWithSegments(text, FONT_STR);
 let cursor: LayoutCursor = { segmentIndex: 0, graphemeIndex: 0 };
 let y = startY;

 while (y + LINE_HEIGHT <= endY) {
 const lineTop = y;
 const segs = getFreeSegments(lineTop, lineTop + LINE_HEIGHT, TEXT_LEFT, textRight, obstacles);
 let done = false;
 for (const [segL, segR] of segs) {
 const line = layoutNextLine(prepared, cursor, segR - segL);
 if (!line) { done = true; break; }
 out.push({ x: segL, y: lineTop + FONT_SIZE + 2, text: line.text });
 cursor = line.end;
 }
 y += LINE_HEIGHT;
 if (done) break;
 }
 return out;
}

// ---------- FlowText (project details) ----------
interface FlowTextProps {
 text: string;
 obstacles: ScreenRect[];
 visible: boolean;
 startY: number;
}

const FlowText: React.FC<FlowTextProps> = ({ text, obstacles, visible, startY }) => {
 const [vp, setVp] = useState({ w: window.innerWidth, h: window.innerHeight });
 useEffect(() => {
 const fn = () => setVp({ w: window.innerWidth, h: window.innerHeight });
 window.addEventListener('resize', fn);
 return () => window.removeEventListener('resize', fn);
 }, []);

 const canvasW = vp.w > 768 ? vp.w - 256 : vp.w;
 const textRight = canvasW - 48;
 const endY = vp.h - 80; // leave room for nav controls

 const lines = useMemo(
 () => (visible && text ? computeLines(text, obstacles, startY, endY, textRight) : []),
 // eslint-disable-next-line react-hooks/exhaustive-deps
 [text, obstacles, visible, startY, textRight, endY],
 );

 return (
 <svg
 aria-hidden="true"
 style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'visible' }}
 >
 {lines.map((ln, i) => (
 <text
  key={i}
  x={ln.x}
  y={ln.y}
  fontFamily='"golos-text", sans-serif'
  fontSize={FONT_SIZE}
  fill="#6b7280"
  letterSpacing="-0.01em"
 >
  {ln.text}
 </text>
 ))}
 </svg>
 );
};

// ---------- main export ----------
export const UIOverlay: React.FC<UIOverlayProps> = ({
 selectedProject,
 onClose: _onClose,
 onNext,
 onPrev,
 currentIndex,
 totalCount,
 obstacleRects,
}) => {
 const [isVisible, setIsVisible] = useState(false);
 const { progress, active } = useProgress();
 const [hasLoaded, setHasLoaded] = useState(false);

 useEffect(() => {
 if (progress === 100 && !active) setTimeout(() => setHasLoaded(true), 500);
 }, [progress, active]);

 useEffect(() => { setIsVisible(!!selectedProject); }, [selectedProject]);

 const formatNumber = (n: number) => n.toString().padStart(2, '0');

 // startY: title top(32) + words×48px line-height + gap
 const titleWords = selectedProject?.title.split(' ').length ?? 2;
 const detailStartY = 32 + titleWords * 48 + 20;

 return (
 <div className="fixed inset-0 md:left-64 z-5 pointer-events-none">

 {/* ── Project details FlowText (pretext, shown on project select) ── */}
 {hasLoaded && (
 <div className={`absolute inset-0 transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
  <FlowText
  text={selectedProject?.details ?? ''}
  obstacles={obstacleRects}
  visible={isVisible && hasLoaded && !!selectedProject}
  startY={detailStartY}
  />
 </div>
 )}

 {/* ── Loading % / About title + description ─────────────────────── */}
 <div
 className={`absolute top-16 md:top-8 left-8 select-none transition-all duration-700 ease-in-out ${isVisible ? 'opacity-0 -translate-x-12' : 'opacity-100 translate-x-0'}`}
 >
 {!hasLoaded ? (
  <h1 className="title tabular-nums">{Math.round(progress)}%</h1>
 ) : (
  <div className="animate-fade-in">
  <h1 className="title">UX Designer<br />& Media Artist</h1>
  <p className="text mt-4 max-w-xs text-gray-500">
  I specialize in designing new usability and developing systems across diverse devices and platforms.
  </p>
  </div>
 )}
 </div>

 {/* ── Project title ──────────────────────────────────────────────── */}
 <div
 className={`absolute top-16 md:top-8 left-8 select-none transition-all duration-700 ease-in-out ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}
 >
 {selectedProject && (
  <div className="flex items-start gap-4">
  <h2 className="title">
  {selectedProject.title.split(' ').map((word, i) => (
  <span key={i} className="block">{word}</span>
  ))}
  </h2>
  {selectedProject.id === 'headphone' && (
  <button
  onClick={() => window.open('https://www.instagram.com/eeezeen', '_blank')}
  className="subtext border border-gray-400 text-gray-500 hover:text-black hover:border-black transition-colors rounded-full px-4 py-1 whitespace-nowrap mt-1 pointer-events-auto"
  >
  Welcome to Playground
  </button>
  )}
  </div>
 )}
 </div>

 {/* ── Navigation controls ────────────────────────────────────────── */}
 <div
 className={`absolute bottom-8 left-8 transition-all duration-700 ease-in-out pointer-events-auto ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
 >
 <div className="flex items-center gap-6">
  <button onClick={onPrev} className="nav-btn group -ml-2">
  <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-black transition-colors" />
  </button>
  <span className="subtext text-gray-900">
  {formatNumber(currentIndex + 1)}{' '}
  <span className="text-gray-300 mx-1">/</span>{' '}
  {formatNumber(totalCount)}
  </span>
  <button onClick={onNext} className="nav-btn group">
  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-black transition-colors" />
  </button>
 </div>
 </div>
 </div>
 );
};
