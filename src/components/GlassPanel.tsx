
import { ReactNode } from 'react';

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
}

const GlassPanel = ({ children, className = "" }: GlassPanelProps) => {
  return (
    <div className={`relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl"></div>
      <div className="relative z-10 p-8">
        {children}
      </div>
    </div>
  );
};

export default GlassPanel;
