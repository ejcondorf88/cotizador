import { useEffect, useState, useRef } from 'react';

interface StatItemProps {
  value: string;
  label: string;
  delay?: number;
}

export function StatItem({ value, label, delay = 0 }: StatItemProps) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  
  // Extract numeric value
  const numericValue = parseInt(value.replace(/[^0-9]/g, ''), 10);
  const prefix = value.startsWith('+') ? '+' : '';
  const suffix = value.includes('%') ? '%' : '';
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
        }
      },
      { threshold: 0.3 }
    );
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => observer.disconnect();
  }, [delay]);
  
  useEffect(() => {
    if (!isVisible) return;
    
    const duration = 2000;
    const steps = 60;
    const increment = numericValue / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= numericValue) {
        setCount(numericValue);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [isVisible, numericValue]);
  
  return (
    <div ref={ref} className="text-center">
      <div className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold text-accent mb-2">
        {prefix}{count.toLocaleString()}{suffix}
      </div>
      <p className="font-body text-white/80 text-sm md:text-base">
        {label}
      </p>
    </div>
  );
}
