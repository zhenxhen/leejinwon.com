import React, { useEffect, useState, useMemo } from 'react';
import { Project } from '../types';
import { ArrowLeft, ArrowRight } from 'lucide-react';
// useProgress를 여기서 import하면 drei -> r3f -> three가 통째로 메인 번들에
// 정적 의존으로 끌려와, 사이드바 글자 한 줄 그리는 데도 3D 번들 전체를
// 기다리게 된다. 진행률은 lazy로 분리된 Experience 쪽에서 받아 쓴다.

interface UIOverlayProps {
 selectedProject: Project | null;
 onClose: () => void;
 onNext: () => void;
 onPrev: () => void;
 currentIndex: number;
 totalCount: number;
 isExperienceReady: boolean;
 progress: number;
}

// ---------- main export ----------
export const UIOverlay: React.FC<UIOverlayProps> = ({
 selectedProject,
 onClose: _onClose,
 onNext,
 onPrev,
 currentIndex,
 totalCount,
 isExperienceReady,
 progress,
}) => {
 const [isVisible, setIsVisible] = useState(false);
 const [hasLoaded, setHasLoaded] = useState(false);

 useEffect(() => {
  if (progress === 100 && isExperienceReady) setHasLoaded(true);
  }, [progress, isExperienceReady]);

 useEffect(() => { setIsVisible(!!selectedProject); }, [selectedProject]);

 const formatNumber = (n: number) => n.toString().padStart(2, '0');


 return (
 <div className="fixed inset-0 md:left-64 z-5 pointer-events-none">

 {/* ── Loading % / About title + description ─────────────────────── */}
 <div
 className={`absolute top-16 md:top-8 left-8 select-none transition-all duration-700 ease-in-out ${isVisible ? 'opacity-0 -translate-x-12' : 'opacity-100 translate-x-0'}`}
 >
 {!hasLoaded ? (
  <h1 className="title tabular-nums">{Math.round(progress)}%</h1>
 ) : (
  <div className="animate-fade-in">
  <h1 className="title">Product Designer<br />& New Media Artist</h1>
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
 {/* 설명문 — 예전에는 pretext로 3D 오브젝트를 피해 흐르게 했지만
   지금은 평범한 문단으로 둔다 */}
 {selectedProject && (
  <p className="text mt-6 max-w-md text-gray-500">
  {selectedProject.details}
  </p>
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
