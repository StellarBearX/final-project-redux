import { useState, useEffect, useRef } from 'react';

export const useScrollReveal = (options = { threshold: 0.15, triggerOnce: true }) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsRevealed(true);
        if (options.triggerOnce) {
          observer.unobserve(element);
        }
      } else if (!options.triggerOnce) {
        setIsRevealed(false);
      }
    }, {
      threshold: options.threshold,
      rootMargin: options.rootMargin || '0px',
    });

    observer.observe(element);

    return () => {
      if (element && !options.triggerOnce) {
        observer.unobserve(element);
      }
    };
  }, [options.threshold, options.rootMargin, options.triggerOnce]);

  return [elementRef, isRevealed];
};
