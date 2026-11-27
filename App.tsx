import React, { useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { UIOverlay } from './components/UIOverlay';
import { Sidebar } from './components/Sidebar';
import { ProjectList } from './components/ProjectList';
import { Project, ScreenRect } from './types';

// three + drei + react-three-fiber는 메인 번들에서 떼어낸다.
// 사이드바와 히어로 텍스트는 이 청크를 기다리지 않고 바로 그려지고,
// 3D 청크는 그와 병렬로 내려받는다.
const Experience = lazy(() =>
  import('./components/Experience').then(m => ({ default: m.Experience }))
);

// 상세 페이지들도 라우트 단위로 분리 — 첫 화면에서는 받을 이유가 없다.
const About = lazy(() => import('./components/About').then(m => ({ default: m.About })));
const Contact = lazy(() => import('./components/Contact').then(m => ({ default: m.Contact })));
const SamsungReminder = lazy(() => import('./components/projects/SamsungReminder').then(m => ({ default: m.SamsungReminder })));
const SamsungCalendar = lazy(() => import('./components/projects/SamsungCalendar').then(m => ({ default: m.SamsungCalendar })));
const GalaxyOneUIWidget = lazy(() => import('./components/projects/GalaxyOneUIWidget').then(m => ({ default: m.GalaxyOneUIWidget })));
const SamsungClock = lazy(() => import('./components/projects/SamsungClock').then(m => ({ default: m.SamsungClock })));
const Review = lazy(() => import('./components/projects/Review').then(m => ({ default: m.Review })));
const Bloomy = lazy(() => import('./components/projects/Bloomy').then(m => ({ default: m.Bloomy })));
const DigitalGarden = lazy(() => import('./components/projects/DigitalGarden').then(m => ({ default: m.DigitalGarden })));
import { PROJECTS, NAVIGATION_ORDER, MONITOR_DATA, HEADPHONE_DATA, PUBLICATION_DATA, WORK_ITEMS } from './constants';

const MainLayout: React.FC = () => {
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [obstacleRects, setObstacleRects] = useState<ScreenRect[]>([]);
  const [isExperienceReady, setIsExperienceReady] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Determine active page for Sidebar
  const activePage = location.pathname === '/' ? 'home'
    : location.pathname === '/about' ? 'about'
      : location.pathname === '/contact' ? 'contact'
        : 'project-detail';

  const handleProjectSelect = (project: Project | null) => {
    setCurrentProject(project);
  };

  const handleNavigation = (page: string) => {
    if (page === 'home') navigate('/');
    else if (page === 'about') navigate('/about');
    else if (page === 'contact') navigate('/contact');

    setCurrentProject(null);
    window.scrollTo(0, 0);
  };

  const handleWorkSelect = (workId: string) => {
    navigate(`/project/${workId}`);
  };

  return (
    <div className="relative w-full min-h-screen bg-white overflow-y-auto selection:bg-black selection:text-white">
      {/* Sidebar Navigation */}
      <Sidebar onNavigate={handleNavigation} activePage={activePage} />

      {/* Main Content Area */}
      <main className="flex-1 ml-0 md:ml-64 relative min-h-screen">
        <Routes>
          <Route path="/" element={
            <>
              {/* 3D Background / Hero Section */}
              <div className="fixed inset-0 md:left-64 w-auto h-full z-0">
                <Suspense fallback={<div className="w-full h-full bg-white" />}>
                  <Experience
                    currentProjectId={currentProject?.id || null}
                    onProjectSelect={handleProjectSelect}
                    onObstacleUpdate={setObstacleRects}
                    onReady={() => setIsExperienceReady(true)}
                  />
                </Suspense>
              </div>

              {/* Project List */}
              <div className="relative z-10 pt-[75vh] pointer-events-none">
                <div id="projects-section">
                  <ProjectList onProjectClick={handleWorkSelect} />
                </div>
              </div>

              {/* UI Overlay */}
              <UIOverlay
                selectedProject={currentProject}
                obstacleRects={obstacleRects}
                onClose={() => setCurrentProject(null)}
                onNext={() => {
                  if (!currentProject) return;
                  const currentIndex = NAVIGATION_ORDER.indexOf(currentProject.id);
                  const nextIndex = (currentIndex + 1) % NAVIGATION_ORDER.length;
                  const nextId = NAVIGATION_ORDER[nextIndex];

                  if (nextId === 'monitor') handleProjectSelect(MONITOR_DATA);
                  else if (nextId === 'headphone') handleProjectSelect(HEADPHONE_DATA);
                  else if (nextId === 'publication') handleProjectSelect(PUBLICATION_DATA);
                  else {
                    const nextProject = PROJECTS.find(p => p.id === nextId);
                    handleProjectSelect(nextProject || null);
                  }
                }}
                onPrev={() => {
                  if (!currentProject) return;
                  const currentIndex = NAVIGATION_ORDER.indexOf(currentProject.id);
                  const prevIndex = (currentIndex - 1 + NAVIGATION_ORDER.length) % NAVIGATION_ORDER.length;
                  const prevId = NAVIGATION_ORDER[prevIndex];

                  if (prevId === 'monitor') handleProjectSelect(MONITOR_DATA);
                  else if (prevId === 'headphone') handleProjectSelect(HEADPHONE_DATA);
                  else if (prevId === 'publication') handleProjectSelect(PUBLICATION_DATA);
                  else {
                    const prevProject = PROJECTS.find(p => p.id === prevId);
                    handleProjectSelect(prevProject || null);
                  }
                }}
                currentIndex={currentProject ? NAVIGATION_ORDER.indexOf(currentProject.id) : -1}
                totalCount={NAVIGATION_ORDER.length}
                isExperienceReady={isExperienceReady}
              />
            </>
          } />
          <Route path="/about" element={<Suspense fallback={null}><About /></Suspense>} />
          <Route path="/contact" element={<Suspense fallback={null}><Contact /></Suspense>} />
          <Route path="/project/samsung-reminder" element={<Suspense fallback={null}><SamsungReminder /></Suspense>} />
          <Route path="/project/samsung-calendar" element={<Suspense fallback={null}><SamsungCalendar /></Suspense>} />
          <Route path="/project/galaxy-one-ui-widget" element={<Suspense fallback={null}><GalaxyOneUIWidget /></Suspense>} />
          <Route path="/project/samsung-clock" element={<Suspense fallback={null}><SamsungClock /></Suspense>} />
          <Route path="/project/review" element={<Suspense fallback={null}><Review /></Suspense>} />
          <Route path="/project/bloomy" element={<Suspense fallback={null}><Bloomy /></Suspense>} />
          <Route path="/project/digital-garden" element={<Suspense fallback={null}><DigitalGarden /></Suspense>} />
        </Routes>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
};

export default App;