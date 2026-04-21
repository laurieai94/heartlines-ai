
import { useEffect, useState } from 'react';

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  animationDuration: number;
  delay: number;
}

const BubbleBackground = () => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  const colors = [
    'hsl(var(--coral-100))',
    'hsl(var(--coral-200))',
    'hsl(var(--peach-100))',
    'hsl(var(--peach-200))',
    'hsl(var(--coral-50))',
    'hsl(var(--peach-50))',
    'hsl(330, 100%, 95%)', // light pink
    'hsl(320, 85%, 90%)',  // soft pink
    'hsl(340, 90%, 92%)',  // rose pink
    'hsl(310, 80%, 88%)',  // magenta pink
    'hsl(350, 95%, 94%)'   // blush pink
  ];

  useEffect(() => {
    const generateBubbles = () => {
      const newBubbles: Bubble[] = [];
      // Reduce bubble count for cleaner look - fewer on mobile
      const bubbleCount = window.innerWidth < 768 ? 6 : 10;
      
      for (let i = 0; i < bubbleCount; i++) {
        newBubbles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 50 + 15, // Smaller bubbles (15-65px vs 20-100px)
          color: colors[Math.floor(Math.random() * colors.length)],
          animationDuration: Math.random() * 25 + 20, // Slower, more gentle movement
          delay: Math.random() * 8
        });
      }
      setBubbles(newBubbles);
    };

    // Respect user's motion preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!prefersReducedMotion.matches) {
      generateBubbles();
    }
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {bubbles.map((bubble, index) => (
        <div
          key={bubble.id}
          className="absolute rounded-full animate-float"
          style={{
            left: `${bubble.x}%`,
            top: `${bubble.y}%`,
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            backgroundColor: bubble.color,
            animationDuration: `${bubble.animationDuration}s`,
            animationDelay: `${bubble.delay}s`,
            filter: 'blur(2px)',
            // Vary opacity for more natural look - some more subtle than others
            opacity: 0.08 + (index % 3) * 0.04 // Creates 0.08, 0.12, 0.16 opacity levels
          }}
        />
      ))}
    </div>
  );
};

export default BubbleBackground;
