interface PremiumBackgroundProps {
  className?: string;
}

const PremiumBackground = ({ className = "" }: PremiumBackgroundProps) => {
  return (
    <>
      {/* Animated orbs */}
      <div className={`absolute inset-0 pointer-events-none hidden md:block ${className}`}>
        <div 
          className="absolute top-1/4 left-1/6 w-96 h-96 bg-gradient-to-r from-burgundy-600/15 via-burgundy-500/10 to-burgundy-700/15 rounded-full blur-3xl animate-pulse" 
          style={{ animationDuration: '6s' }}
        />
        <div 
          className="absolute bottom-1/3 right-1/5 w-80 h-80 bg-gradient-to-r from-burgundy-700/15 via-burgundy-600/10 to-burgundy-500/15 rounded-full blur-3xl animate-pulse" 
          style={{ animationDuration: '7s', animationDelay: '1.5s' }}
        />
        <div 
          className="absolute top-2/3 left-1/3 w-64 h-64 bg-gradient-to-r from-burgundy-500/12 via-burgundy-600/8 to-burgundy-700/12 rounded-full blur-3xl animate-pulse" 
          style={{ animationDuration: '8s', animationDelay: '3s' }}
        />
      </div>

    </>
  );
};

export default PremiumBackground;
