import React from 'react';
import {
  FileText,
  Link as LinkIcon,
  Scale,
  Building,
  HardHat,
  User,
  Home,
  Briefcase,
  FileWarning,
  TrendingUp,
  Workflow,
  ScrollText,
  Handshake,
  Gavel,
  ClipboardList,
  ShieldCheck
} from 'lucide-react';

const ICON_MAP = {
  FileText,
  Link: LinkIcon,
  Scale,
  Building,
  HardHat,
  User,
  Home,
  Briefcase,
  FileWarning,
  TrendingUp,
  Workflow,
  ScrollText,
  Handshake,
  Gavel,
  ClipboardList,
  ShieldCheck
};

export default function IconCircle({ name, icon: IconProp, size = 26, strokeWidth = 2.4, className = "" }) {
  const IconComponent = IconProp || ICON_MAP[name] || FileText;

  return (
    <div className={`icon-circle ${className}`} aria-hidden="true">
      <IconComponent size={size} strokeWidth={strokeWidth} color="#F2B632" />
    </div>
  );
}
