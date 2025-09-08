import millennial_woman from "@/assets/millennial-woman-portrait.jpg";

interface PhotoSplitBannerProps {
  imageSrc?: string;
  alt?: string;
  heading?: string;
  align?: 'left' | 'right';
}

const PhotoSplitBanner = ({ 
  imageSrc = millennial_woman,
  alt = "Woman smiling confidently",
  heading = "Real relationships\nstart with real\nconversations.",
  align = 'right'
}: PhotoSplitBannerProps) => {
  return (
    <section className="relative h-[70vh] md:h-[80vh] overflow-hidden">
      {/* Full-bleed image */}
      <div className="absolute inset-0">
        <img 
          src={imageSrc} 
          alt={alt}
          className="w-full h-full object-cover object-center"
        />
        
        {/* Dark overlay gradient */}
        <div className={`absolute inset-0 ${
          align === 'right' 
            ? 'bg-gradient-to-l from-burgundy-900/95 via-burgundy-900/60 to-burgundy-900/20' 
            : 'bg-gradient-to-r from-burgundy-900/95 via-burgundy-900/60 to-burgundy-900/20'
        }`}></div>
        
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,hsl(var(--burgundy-900))_100%)] opacity-30"></div>
      </div>

      {/* Content overlay */}
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-4 sm:px-6">
          <div className={`max-w-2xl ${align === 'right' ? 'ml-auto' : 'mr-auto'}`}>
            <div className={`${align === 'right' ? 'text-right' : 'text-left'} space-y-4`}>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-playfair font-normal leading-[1.1] text-white animate-fade-in">
                {heading.split('\n').map((line, index) => (
                  <span key={index} className="block">
                    {index === 0 && (
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-coral-400 to-pink-400">
                        {line}
                      </span>
                    )}
                    {index > 0 && line}
                  </span>
                ))}
              </h2>
              
              {/* Subtle accent line */}
              <div className={`w-20 h-1 bg-gradient-to-r from-coral-400 to-pink-400 ${
                align === 'right' ? 'ml-auto' : 'mr-auto'
              } animate-fade-in`} style={{ animationDelay: '0.5s' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade transition */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-burgundy-900 to-transparent"></div>
    </section>
  );
};

export default PhotoSplitBanner;