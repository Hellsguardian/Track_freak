import React from 'react';
import { Moon } from 'lucide-react';
import ControlSection from '../../ui/ControlSection';
import SectionHeader from '../../ui/SectionHeader';
import SleepTracker from './SleepTracker';
import NutritionGrid from './NutritionGrid';
import HydrationControl from './HydrationControl';
import type { SleepState, SleepBatch, NutritionState } from '../../../types';

interface WellnessSectionProps {
  sleep: SleepState;
  setSleep: React.Dispatch<React.SetStateAction<SleepState>>;
  sleepError: string | null;
  currentSessionSeconds: number;
  batches: SleepBatch[];
  totalRestSeconds: number;
  toggleSleep: () => void;
  pushManualSleep: () => void;
  nutrition: NutritionState;
  setNutrition: React.Dispatch<React.SetStateAction<NutritionState>>;
  water: number;
  setWater: React.Dispatch<React.SetStateAction<number>>;
  isWaterDragging: boolean;
  waterRef: React.RefObject<HTMLDivElement | null>;
  onWaterPointerDown: (e: React.PointerEvent) => void;
  onWaterPointerMove: (e: React.PointerEvent) => void;
  onWaterPointerUp: (e: React.PointerEvent) => void;
}

const WellnessSection = ({
  sleep, setSleep, sleepError, currentSessionSeconds, batches, totalRestSeconds,
  toggleSleep, pushManualSleep,
  nutrition, setNutrition,
  water, setWater, isWaterDragging, waterRef,
  onWaterPointerDown, onWaterPointerMove, onWaterPointerUp,
}: WellnessSectionProps) => (
  <ControlSection>
    <SectionHeader icon={Moon} title="Wellness Hub" subtitle="Physical Restoration & Biometrics" />
    
    <div className="flex flex-col gap-10">
      <SleepTracker
        sleep={sleep}
        setSleep={setSleep}
        sleepError={sleepError}
        currentSessionSeconds={currentSessionSeconds}
        batches={batches}
        totalRestSeconds={totalRestSeconds}
        toggleSleep={toggleSleep}
        pushManualSleep={pushManualSleep}
      />

      {/* Quick Actions */}
      <NutritionGrid nutrition={nutrition} setNutrition={setNutrition} />

      {/* Water Control */}
      <HydrationControl
        water={water}
        setWater={setWater}
        isWaterDragging={isWaterDragging}
        waterRef={waterRef}
        onWaterPointerDown={onWaterPointerDown}
        onWaterPointerMove={onWaterPointerMove}
        onWaterPointerUp={onWaterPointerUp}
      />
    </div>
  </ControlSection>
);

export default WellnessSection;
