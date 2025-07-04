
import { useState, useEffect } from "react";
import { Heart, MessageCircle } from "lucide-react";

const DatingProfileDemo = () => {
  const [currentProfile, setCurrentProfile] = useState(0);

  const datingProfiles = [
    { 
      name: "Emma", 
      age: 28, 
      photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face", 
      bio: "Photographer & dog mom" 
    },
    { 
      name: "Jake", 
      age: 31, 
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face", 
      bio: "Chef & weekend surfer" 
    },
    { 
      name: "Zoe", 
      age: 24, 
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face", 
      bio: "Designer & music lover" 
    },
    { 
      name: "Chris", 
      age: 33, 
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face", 
      bio: "Teacher & rock climber" 
    },
    { 
      name: "Lily", 
      age: 27, 
      photo: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=400&h=400&fit=crop&crop=face", 
      bio: "Writer & coffee enthusiast" 
    },
    { 
      name: "Alex", 
      age: 30, 
      photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face", 
      bio: "Engineer & marathon runner" 
    },
    { 
      name: "Maya", 
      age: 25, 
      photo: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=400&h=400&fit=crop&crop=face", 
      bio: "Artist & yoga instructor" 
    }
  ];

  useEffect(() => {
    const profileTimer = setInterval(() => {
      setCurrentProfile((prev) => (prev + 1) % datingProfiles.length);
    }, 2000);

    return () => clearInterval(profileTimer);
  }, []);

  return (
    <div className="relative flex items-center justify-center">
      <div className="relative">
        {/* Phone Frame with Electric Border */}
        <div className="relative w-80 h-[600px] bg-rich-black rounded-[2.5rem] p-3 shadow-3xl border border-electric-blue/25">
          {/* Phone Screen */}
          <div className="w-full h-full bg-gradient-to-b from-graphite to-rich-black rounded-[2rem] overflow-hidden relative">
            {/* Status Bar */}
            <div className="flex justify-between items-center px-6 py-3 text-warm-white text-sm">
              <span>9:41 AM</span>
              <div className="flex gap-1">
                <div className="w-4 h-2 bg-electric-blue/80 rounded-sm"></div>
                <div className="w-4 h-2 bg-electric-blue/60 rounded-sm"></div>
                <div className="w-4 h-2 bg-warm-white/40 rounded-sm"></div>
              </div>
            </div>

            {/* App Header with Electric Accent */}
            <div className="px-6 pb-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-warm-white via-electric-blue to-neon-cyan">RealSwipe</h2>
                <div className="w-8 h-8 bg-gradient-to-r from-electric-blue to-electric-purple rounded-full flex items-center justify-center neon-glow-blue">
                  <Heart className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>

            {/* Dating Profile Card */}
            <div className="px-6 pb-6 flex-1">
              <div 
                key={currentProfile}
                className="bg-gradient-to-b from-warm-white/10 to-warm-white/5 backdrop-blur-md rounded-3xl p-6 h-96 relative border border-electric-blue/20 animate-fade-in"
              >
                {/* Profile Photo */}
                <div className="w-full h-48 bg-gradient-to-br from-medium-gray/20 to-graphite/20 rounded-2xl overflow-hidden mb-4 border border-electric-blue/15">
                  <img 
                    src={datingProfiles[currentProfile].photo} 
                    alt={datingProfiles[currentProfile].name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Profile Info */}
                <div className="text-warm-white">
                  <h3 className="text-2xl font-light mb-1">
                    {datingProfiles[currentProfile].name}, {datingProfiles[currentProfile].age}
                  </h3>
                  <p className="text-medium-gray text-sm mb-4">{datingProfiles[currentProfile].bio}</p>
                </div>

                {/* Action Buttons with Electric Colors */}
                <div className="absolute bottom-6 left-6 right-6 flex justify-center gap-4">
                  <div className="w-12 h-12 bg-red-500/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-red-400/30">
                    <span className="text-red-400 text-xl">✕</span>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-electric-blue/30 to-electric-purple/30 backdrop-blur-sm rounded-full flex items-center justify-center border border-electric-blue/50 neon-glow-blue">
                    <Heart className="w-5 h-5 text-electric-blue" />
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-neon-cyan/20 to-electric-blue/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-neon-cyan/40">
                    <MessageCircle className="w-5 h-5 text-neon-cyan" />
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Dots with Electric Active State */}
            <div className="flex justify-center gap-2 pb-6">
              {datingProfiles.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentProfile ? 'bg-electric-blue neon-glow-blue' : 'bg-warm-white/30'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Phone Home Indicator */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-electric-blue/40 rounded-full"></div>
        </div>

        {/* Enhanced Floating Elements with Electric Colors */}
        <div className="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-r from-electric-blue/25 to-electric-purple/25 backdrop-blur-sm rounded-full flex items-center justify-center border border-electric-blue/40 animate-electric-pulse neon-glow-blue">
          <Heart className="w-6 h-6 text-electric-blue" />
        </div>
        <div className="absolute -bottom-8 -left-8 w-16 h-16 bg-gradient-to-r from-neon-cyan/20 to-electric-blue/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-neon-cyan/30 animate-electric-pulse" style={{ animationDelay: '1s' }}>
          <MessageCircle className="w-6 h-6 text-neon-cyan" />
        </div>
      </div>
    </div>
  );
};

export default DatingProfileDemo;
