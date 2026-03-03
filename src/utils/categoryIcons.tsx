// Utility function for getting category icons
// Exported from section3-resource-center.tsx to fix react-refresh warning
import React from 'react';
import { Ship, User, Wrench, Anchor, ChefHat, Sofa, Users } from 'lucide-react';

export const getCategoryIcon = (category?: string): React.ReactElement => {
  const iconClass = "text-[#0487D9] text-[32px]";
  
  switch (category?.toLowerCase()) {
    case 'captain':
      return <Ship className={iconClass} />;
    case 'crew':
      return <User className={iconClass} />;
    case 'engineering':
      return <Wrench className={iconClass} />;
    case 'exterior':
      return <Anchor className={iconClass} />;
    case 'galley/chefs':
      return <ChefHat className={iconClass} />;
    case 'interior':
      return <Sofa className={iconClass} />;
    default:
      return <Users className={iconClass} />;
  }
};
