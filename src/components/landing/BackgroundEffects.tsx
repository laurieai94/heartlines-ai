
const BackgroundEffects = () => {
  return (
    <>
      {/* Enhanced Background with Electric Accents */}
      <div className="absolute inset-0 bg-gradient-to-br from-graphite/60 via-dark-gray/40 to-rich-black/80 animate-gradient"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-electric-blue/3 via-soft-gray/5 to-electric-purple/4 animate-gradient" style={{ animationDelay: '1s' }}></div>
      <div className="absolute inset-0 bg-gradient-to-bl from-dark-gray/20 via-neon-cyan/2 to-rich-black/30 animate-gradient" style={{ animationDelay: '2s' }}></div>

      {/* Enhanced Floating Particles with Electric Colors */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 rounded-full ${
              i % 6 === 0 ? 'bg-electric-blue/40 animate-electric-pulse' : 
              i % 6 === 1 ? 'bg-neon-cyan/30 animate-electric-pulse' :
              i % 6 === 2 ? 'bg-electric-purple/35 animate-electric-pulse' :
              i % 6 === 3 ? 'bg-lavender/30 animate-lavender-pulse' : 
              'bg-warm-white/20 animate-monochrome-pulse'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Enhanced Floating Geometric Shapes with Electric Borders */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-20 h-20 rounded-lg animate-spin ${
              i % 5 === 0 ? 'border border-electric-blue/25' :
              i % 5 === 1 ? 'border border-neon-cyan/20' :
              i % 5 === 2 ? 'border border-electric-purple/25' :
              i % 5 === 3 ? 'border border-lavender/20' : 
              'border border-warm-white/10'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${10 + Math.random() * 20}s`,
              transform: `rotate(${Math.random() * 360}deg)`
            }}
          />
        ))}
      </div>

      {/* Code-like Background Elements - Enhanced with Electric Colors */}
      <div className="absolute inset-0 overflow-hidden opacity-5">
        <div className="absolute top-20 left-10 font-mono text-xs text-electric-blue">
          {`const love = { understanding: true, growth: infinite }`}
        </div>
        <div className="absolute top-1/3 right-20 font-mono text-xs text-neon-cyan">
          {`if (relationship.status === 'complicated') { ai.help() }`}
        </div>
        <div className="absolute bottom-1/3 left-1/4 font-mono text-xs text-electric-purple">
          {`return personalized.advice.filter(advice => advice.isRelevant)`}
        </div>
      </div>
    </>
  );
};

export default BackgroundEffects;
