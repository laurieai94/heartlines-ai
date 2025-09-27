import React from "react";
import { Heart } from "lucide-react";

const FrostedHeartShowcase = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Molten Metallic Blob Background */}
      <div className="absolute inset-0">
        {/* Primary molten blob */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-burgundy-500/30 via-burgundy-600/40 to-burgundy-700/30 rounded-full blur-3xl animate-pulse opacity-60 animate-bounce" 
             style={{
               animationDuration: "8s",
               animationDirection: "alternate",
               animationIterationCount: "infinite"
             }}>
        </div>
        
        {/* Secondary molten blob */}
        <div className="absolute top-1/2 right-1/3 w-80 h-80 bg-gradient-to-tl from-rose-400/25 via-burgundy-500/35 to-burgundy-800/25 rounded-full blur-2xl opacity-50 animate-pulse"
             style={{
               animationDuration: "10s",
               animationDirection: "alternate-reverse",
               animationIterationCount: "infinite"
             }}>
        </div>
        
        {/* Tertiary accent blob */}
        <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-gradient-to-r from-burgundy-400/20 via-rose-300/30 to-burgundy-600/25 rounded-full blur-xl opacity-40 animate-pulse"
             style={{
               animationDuration: "14s",
               animationDirection: "alternate",
               animationIterationCount: "infinite"
             }}>
        </div>
      </div>


    </section>
  );
};

export default FrostedHeartShowcase;