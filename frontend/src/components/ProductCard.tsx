import { useState } from 'react';

interface ProductCardProps {
  title: string;
  description: string;
  icon: string;
  delay?: number;
}

export function ProductCard({ title, description, icon, delay = 0 }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative group bg-white rounded-2xl p-8 transition-all duration-300 ease-out cursor-pointer"
      style={{
        boxShadow: isHovered
          ? '0 25px 50px -12px rgba(10, 22, 40, 0.25)'
          : '0 4px 6px -1px rgba(10, 22, 40, 0.05)',
        transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
        transitionDelay: `${delay}ms`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Accent line */}
      <div
        className="absolute top-0 left-1/2 transform -translate-x-1/2 h-1 bg-accent rounded-full transition-all duration-300"
        style={{
          width: isHovered ? '100%' : '0%',
        }}
      />
      
      {/* Icon */}
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300"
        style={{
          backgroundColor: isHovered ? '#C9A84C' : '#F4F4F0',
        }}
      >
        <i
          className={`pi ${icon} text-3xl transition-colors duration-300`}
          style={{
            color: isHovered ? '#FFFFFF' : '#C9A84C',
          }}
        />
      </div>
      
      {/* Content */}
      <h3 className="font-heading text-xl font-bold text-primary mb-3">
        {title}
      </h3>
      <p className="font-body text-sm text-gray-600 leading-relaxed">
        {description}
      </p>
      
      {/* Learn more link */}
      <div className="mt-6 flex items-center gap-2">
        <span
          className="font-body text-sm font-medium transition-colors duration-300"
          style={{
            color: isHovered ? '#C9A84C' : '#0A1628',
          }}
        >
          Ver más
        </span>
        <i
          className="pi pi-arrow-right text-sm transition-all duration-300"
          style={{
            color: isHovered ? '#C9A84C' : '#0A1628',
            transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
          }}
        />
      </div>
    </div>
  );
}
