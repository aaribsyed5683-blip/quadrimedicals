import React from 'react';
import * as LucideIcons from 'lucide-react';

interface DynamicIconProps {
  name: string;
  className?: string;
  fallback?: string;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({
  name,
  className = 'w-5 h-5',
  fallback = 'ShieldCheck',
}) => {
  const IconComponent = (LucideIcons as any)[name] || (LucideIcons as any)[fallback] || LucideIcons.ShieldCheck;
  return <IconComponent className={className} />;
};
