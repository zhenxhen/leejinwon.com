import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Experience } from './components/Experience';
import { UIOverlay } from './components/UIOverlay';
import { Sidebar } from './components/Sidebar';
import { ProjectList } from './components/ProjectList';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { SamsungReminder } from './components/projects/SamsungReminder';
import { SamsungCalendar } from './components/projects/SamsungCalendar';
import { GalaxyOneUIWidget } from './components/projects/GalaxyOneUIWidget';
import { SamsungClock } from './components/projects/SamsungClock';
import { Review } from './components/projects/Review';
import { Bloomy } from './components/projects/Bloomy';
import { DigitalGarden } from './components/projects/DigitalGarden';
import { Project, ScreenRect } from './types';
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
                <Experience
                  currentProjectId={currentProject?.id || null}
                  onProjectSelect={handleProjectSelect}
                  onObstacleUpdate={setObstacleRects}
                  onReady={() => setIsExperienceReady(true)}
                />
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
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/project/samsung-reminder" element={<SamsungReminder />} />
          <Route path="/project/samsung-calendar" element={<SamsungCalendar />} />
          <Route path="/project/galaxy-one-ui-widget" element={<GalaxyOneUIWidget />} />
          <Route path="/project/samsung-clock" element={<SamsungClock />} />
          <Route path="/project/review" element={<Review />} />
          <Route path="/project/bloomy" element={<Bloomy />} />
          <Route path="/project/digital-garden" element={<DigitalGarden />} />
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