
const BackgroundEffects = () => {
  return (
    <>
      {/* Simplified black background with minimal gradients */}
      <div className="absolute inset-0 bg-black"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-gray-900/20"></div>

      {/* Clean floating particles - only white and electric colors */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 rounded-full ${
              i % 4 === 0 ? 'bg-electric-blue/40 animate-subtle-pulse' : 
              i % 4 === 1 ? 'bg-electric-purple/40 animate-subtle-pulse' :
              'bg-white/20 animate-fade-in'
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

      {/* Clean geometric shapes with electric borders */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-20 h-20 rounded-lg animate-float ${
              i % 3 === 0 ? 'border border-electric-blue/20' :
              i % 3 === 1 ? 'border border-electric-purple/20' :
              'border border-white/10'
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

      {/* Minimal code-like elements */}
      <div className="absolute inset-0 overflow-hidden opacity-5">
        <div className="absolute top-20 left-10 font-mono text-xs text-white">
          {`const love = { understanding: true, growth: infinite }`}
        </div>
        <div className="absolute top-1/3 right-20 font-mono text-xs text-electric-blue">
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
