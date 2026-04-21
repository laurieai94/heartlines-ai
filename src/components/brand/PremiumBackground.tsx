interface PremiumBackgroundProps {
  className?: string;
}

const PremiumBackground = ({ className = "" }: PremiumBackgroundProps) => {
  return (
    <>
      {/* Animated orbs */}
      <div className={`absolute inset-0 pointer-events-none -z-10 ${className}`}>
        <div 
          className="absolute top-1/4 left-1/6 w-96 h-96 bg-gradient-to-r from-pink-500/50 via-coral-400/40 to-orange-500/50 rounded-full blur-3xl animate-pulse" 
          style={{ animationDuration: '6s' }}
        />
        <div 
          className="absolute bottom-1/3 right-1/5 w-80 h-80 bg-gradient-to-r from-orange-500/50 via-pink-500/40 to-coral-400/50 rounded-full blur-3xl animate-pulse" 
          style={{ animationDuration: '7s', animationDelay: '1.5s' }}
        />
        <div 
          className="absolute top-2/3 left-1/3 w-64 h-64 bg-gradient-to-r from-coral-400/20 via-pink-400/15 to-orange-400/20 rounded-full blur-[100px] animate-pulse" 
          style={{ animationDuration: '8s', animationDelay: '3s' }}
        />
        <div 
          className="absolute top-1/4 right-1/6 w-96 h-96 bg-gradient-to-l from-pink-500/50 via-coral-400/40 to-orange-500/50 rounded-full blur-3xl animate-pulse" 
          style={{ animationDuration: '8.5s', animationDelay: '2s' }}
        />
      </div>

    </>
  );
};

export default PremiumBackground;
