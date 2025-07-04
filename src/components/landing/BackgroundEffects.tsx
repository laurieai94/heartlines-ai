
const BackgroundEffects = () => {
  return (
    <>
      {/* Clean Black Background */}
      <div className="absolute inset-0 bg-black"></div>
      
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-black/95 to-black/90"></div>

      {/* Clean Floating Particles - Electric Colors Only */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 rounded-full ${
              i % 3 === 0 ? 'bg-electric-blue/40 animate-subtle-pulse' : 
              i % 3 === 1 ? 'bg-electric-purple/40 animate-subtle-pulse' :
              'bg-white/30 animate-subtle-pulse'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Clean Geometric Shapes - No Blur */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-20 h-20 rounded-lg border ${
              i % 3 === 0 ? 'border-electric-blue/20' :
              i % 3 === 1 ? 'border-electric-purple/20' :
              'border-white/10'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${15 + Math.random() * 10}s`,
              transform: `rotate(${Math.random() * 360}deg)`
            }}
          />
        ))}
      </div>

      {/* Code Elements - Clean Electric Colors */}
      <div className="absolute inset-0 overflow-hidden opacity-8">
        <div className="absolute top-20 left-10 font-mono text-xs text-electric-blue/60">
          {`const love = { understanding: true, growth: infinite }`}
        </div>
        <div className="absolute top-1/3 right-20 font-mono text-xs text-electric-purple/60">
          {`if (relationship.status === 'complicated') { ai.help() }`}
        </div>
        <div className="absolute bottom-1/3 left-1/4 font-mono text-xs text-white/40">
          {`return personalized.advice.filter(advice => advice.isRelevant)`}
        </div>
      </div>
    </>
  );
};

export default BackgroundEffects;
