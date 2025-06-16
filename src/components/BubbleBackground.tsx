
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
    'hsl(var(--peach-50))'
  ];

  useEffect(() => {
    const generateBubbles = () => {
      const newBubbles: Bubble[] = [];
      for (let i = 0; i < 12; i++) {
        newBubbles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 80 + 20,
          color: colors[Math.floor(Math.random() * colors.length)],
          animationDuration: Math.random() * 20 + 15,
          delay: Math.random() * 5
        });
      }
      setBubbles(newBubbles);
    };

    generateBubbles();
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="absolute rounded-full opacity-20 animate-float"
          style={{
            left: `${bubble.x}%`,
            top: `${bubble.y}%`,
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            backgroundColor: bubble.color,
            animationDuration: `${bubble.animationDuration}s`,
            animationDelay: `${bubble.delay}s`,
            filter: 'blur(1px)'
          }}
        />
      ))}
    </div>
  );
};

export default BubbleBackground;
