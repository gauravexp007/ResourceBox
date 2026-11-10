import React from 'react';
import { 
  Wrench, 
  Camera, 
  Bike, 
  Compass, 
  Gamepad2, 
  Home, 
  Music, 
  Activity, 
  Package 
} from 'lucide-react';

interface CategoryIconProps {
  name: string;
  className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ name, className = 'w-5 h-5' }) => {
  switch (name) {
    case 'Wrench':
      return <Wrench className={className} />;
    case 'Camera':
      return <Camera className={className} />;
    case 'Bike':
      return <Bike className={className} />;
    case 'Compass':
      return <Compass className={className} />;
    case 'Gamepad2':
      return <Gamepad2 className={className} />;
    case 'Home':
      return <Home className={className} />;
    case 'Music':
      return <Music className={className} />;
    case 'Activity':
      return <Activity className={className} />;
    default:
      return <Package className={className} />;
  }
};
