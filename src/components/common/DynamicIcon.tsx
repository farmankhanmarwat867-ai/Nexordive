import React from 'react';
import {
  Code2,
  LineChart,
  Smartphone,
  Lightbulb,
  Gamepad2,
  Flame,
  PlaySquare,
  Wand2,
  Sparkles,
  Diamond,
  Coins,
  Shield,
  ShieldCheck,
  Clock,
  Users,
  Award,
  TrendingUp,
  CheckCircle2,
  Zap,
  Globe,
  Layers,
  Cpu,
  Palette,
  Rocket,
  Briefcase,
  Terminal,
  Activity,
  Compass,
  Headphones,
  Laptop,
  Radio,
  Server,
  Star,
  FileCode,
} from 'lucide-react';

export const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Code2,
  LineChart,
  Smartphone,
  Lightbulb,
  Gamepad2,
  Flame,
  PlaySquare,
  Wand2,
  Sparkles,
  Diamond,
  Coins,
  Shield,
  ShieldCheck,
  Clock,
  Users,
  Award,
  TrendingUp,
  CheckCircle2,
  Zap,
  Globe,
  Layers,
  Cpu,
  Palette,
  Rocket,
  Briefcase,
  Terminal,
  Activity,
  Compass,
  Headphones,
  Laptop,
  Radio,
  Server,
  Star,
  FileCode,
};

interface DynamicIconProps {
  name: string;
  className?: string;
  fallback?: React.ComponentType<{ className?: string }>;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({
  name,
  className = 'w-5 h-5',
  fallback: FallbackIcon = Sparkles,
}) => {
  const IconComponent = ICON_MAP[name] || FallbackIcon;
  return <IconComponent className={className} />;
};
