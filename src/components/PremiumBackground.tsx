interface PremiumBackgroundProps {
  className?: string;
}

const PremiumBackground = ({ className = "" }: PremiumBackgroundProps) => {
  return (
    <>
      {/* Animated orbs */}
      <div className={`absolute inset-0 pointer-events-none ${className}`}>
        <div 
          className="absolute top-1/4 left-1/6 w-96 h-96 bg-gradient-to-r from-pink-500/15 via-coral-400/10 to-orange-500/15 rounded-full blur-3xl animate-pulse" 
          style={{ animationDuration: '6s' }}
        />
        <div 
          className="absolute bottom-1/3 right-1/5 w-80 h-80 bg-gradient-to-r from-orange-500/15 via-pink-500/10 to-coral-400/15 rounded-full blur-3xl animate-pulse" 
          style={{ animationDuration: '7s', animationDelay: '1.5s' }}
        />
        <div 
          className="absolute top-2/3 left-1/3 w-64 h-64 bg-gradient-to-r from-coral-400/12 via-pink-400/8 to-orange-400/12 rounded-full blur-3xl animate-pulse" 
          style={{ animationDuration: '8s', animationDelay: '3s' }}
        />
      </div>

      {/* Code snippet decorations */}
      <div className="absolute inset-0 overflow-hidden opacity-5 pointer-events-none">
        <div className="absolute top-20 left-10 font-mono text-xs text-pink-200">
          {`const love = { understanding: true, growth: infinite }`}
        </div>
        <div className="absolute top-1/3 right-20 font-mono text-xs text-coral-200">
          {`if (relationship.status === 'complicated') { ai.help() }`}
        </div>
        <div className="absolute bottom-1/3 left-1/4 font-mono text-xs text-pink-200">
          {`return personalized.advice.filter(advice => advice.isRelevant)`}
        </div>
      </div>
    </>
  );
};

export default PremiumBackground;
