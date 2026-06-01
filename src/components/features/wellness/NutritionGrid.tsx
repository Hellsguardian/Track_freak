import React from 'react';
import { Utensils } from 'lucide-react';
import IconButton from '../../ui/IconButton';
import type { NutritionState } from '../../../types';

interface NutritionGridProps {
  nutrition: NutritionState;
  setNutrition: React.Dispatch<React.SetStateAction<NutritionState>>;
}

const NutritionGrid = ({ nutrition, setNutrition }: NutritionGridProps) => (
  <div className="flex flex-col gap-4">
    <div className="grid grid-cols-3 gap-4">
      <IconButton 
        active={nutrition.breakfast} 
        onClick={() => setNutrition({...nutrition, breakfast: !nutrition.breakfast})} 
        icon={Utensils} 
        label="B-Fast" 
      />
      <IconButton 
        active={nutrition.lunch} 
        onClick={() => setNutrition({...nutrition, lunch: !nutrition.lunch})} 
        icon={Utensils} 
        label="Midday" 
      />
      <IconButton 
        active={nutrition.dinner} 
        onClick={() => setNutrition({...nutrition, dinner: !nutrition.dinner})} 
        icon={Utensils} 
        label="Night" 
      />
    </div>
  </div>
);

export default NutritionGrid;
