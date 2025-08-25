import { useEffect, useRef, useState, ReactNode } from 'react';

interface LazySectionProps {
  children: ReactNode;
  rootMargin?: string;
  threshold?: number;
  className?: string;
  fallback?: ReactNode;
}

export const LazySection = ({ 
  children, 
  rootMargin = '100px', 
  threshold = 0.1,
  className = '',
  fallback = null
}: LazySectionProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [rootMargin, threshold]);

  return (
    <div ref={ref} className={className}>
      {isVisible ? children : fallback}
    </div>
  );
};