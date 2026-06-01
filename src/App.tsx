import { useState, useEffect, useCallback } from 'react';

// Hooks
import { useWellness } from './hooks/useWellness';
import { useProductivity } from './hooks/useProductivity';
import { useDigitalBehavior } from './hooks/useDigitalBehavior';
import { useVibe } from './hooks/useVibe';
import { useProjects } from './hooks/useProjects';
import { useTheme } from './hooks/useTheme';
import { useResetAll } from './hooks/useResetAll';
import { useHorizontalScroll } from './hooks/useHorizontalScroll';

// Layout
import Background from './components/layout/Background';
import Navbar from './components/layout/Navbar';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Features
import WellnessSection from './components/features/wellness/WellnessSection';
import ProductivitySection from './components/features/productivity/ProductivitySection';
import DigitalBehaviorSection from './components/features/digital/DigitalBehaviorSection';
import VibeSensorSection from './components/features/vibe/VibeSensorSection';
import ProjectsSection from './components/features/projects/ProjectsSection';
import ProjectModal from './components/features/projects/ProjectModal';

export default function App() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Domain hooks
  const wellness = useWellness();
  const productivity = useProductivity();
  const digital = useDigitalBehavior();
  const vibe = useVibe();
  const projects = useProjects();
  const theme = useTheme();
  const { scrollRef } = useHorizontalScroll(mounted);

  // Reset orchestration — combines all domain reset callbacks
  const handleResetAll = useCallback(() => {
    wellness.resetWellness();
    productivity.resetProductivity();
    digital.resetDigitalBehavior();
    vibe.resetVibe();
    projects.resetProjectsToday();
  }, [wellness, productivity, digital, vibe, projects]);

  const reset = useResetAll(handleResetAll);

  if (!mounted) return null;

  return (
    <div className="min-h-screen relative font-sans selection:bg-accent selection:text-white pb-24 bg-[#050505]">
      {/* --- Environment Architecture --- */}
      <Background />
      
      {/* Top Navigation / Status Bar */}
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 pt-12 flex flex-col gap-12 relative z-10">
        
        {/* Cinematic Header */}
        <Header 
          isLightMode={theme.isLightMode}
          setIsLightMode={theme.setIsLightMode}
          isResetHolding={reset.isResetHolding}
          setIsResetHolding={reset.setIsResetHolding}
          holdProgress={reset.holdProgress}
        />

        {/* Section: Wellness Hub */}
        <WellnessSection
          sleep={wellness.sleep}
          setSleep={wellness.setSleep}
          currentSessionSeconds={wellness.currentSessionSeconds}
          batches={wellness.batches}
          totalRestSeconds={wellness.totalRestSeconds}
          toggleSleep={wellness.toggleSleep}
          pushManualSleep={wellness.pushManualSleep}
          nutrition={wellness.nutrition}
          setNutrition={wellness.setNutrition}
          water={wellness.water}
          setWater={wellness.setWater}
          isWaterDragging={wellness.isWaterDragging}
          waterRef={wellness.waterRef}
          onWaterPointerDown={wellness.onWaterPointerDown}
          onWaterPointerMove={wellness.onWaterPointerMove}
          onWaterPointerUp={wellness.onWaterPointerUp}
        />

        {/* Section: Productivity & Work */}
        <ProductivitySection
          timerSeconds={productivity.timerSeconds}
          isTimerRunning={productivity.isTimerRunning}
          setIsTimerRunning={productivity.setIsTimerRunning}
          reading={productivity.reading}
          setReading={productivity.setReading}
          ukulele={productivity.ukulele}
          setUkulele={productivity.setUkulele}
          training={productivity.training}
          setTraining={productivity.setTraining}
          addTime={productivity.addTime}
        />

        {/* Section: Digital Behavior */}
        <DigitalBehaviorSection
          consoleLogHours={digital.consoleLogHours}
          hyperSocialMinutes={digital.hyperSocialMinutes}
          incrementConsoleLog={digital.incrementConsoleLog}
          incrementHyperSocial={digital.incrementHyperSocial}
          resetDigitalBehavior={digital.resetDigitalBehavior}
        />

        {/* Section: Psych-Calibration */}
        <VibeSensorSection
          mood={vibe.mood}
          setMood={vibe.setMood}
          stress={vibe.stress}
          setStress={vibe.setStress}
        />

        {/* Section: Project Archive */}
        <ProjectsSection
          projects={projects.projects}
          isWorkedToday={projects.isWorkedToday}
          deleteProject={projects.deleteProject}
          toggleProjectSuccess={projects.toggleProjectSuccess}
          setIsModalOpen={projects.setIsModalOpen}
          scrollRef={scrollRef}
        />

        <ProjectModal 
          isOpen={projects.isModalOpen} 
          onClose={() => projects.setIsModalOpen(false)} 
          onAdd={projects.addProject} 
        />

        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
}
