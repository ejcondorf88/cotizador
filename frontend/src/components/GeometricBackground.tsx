export function GeometricBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary-light" />
      
      {/* Geometric shapes */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#C9A84C" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="blue-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1a2942" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#0A1628" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        
        {/* Large triangle - top left */}
        <polygon
          points="0,0 600,0 0,700"
          fill="url(#blue-gradient)"
        />
        
        {/* Triangle - right side */}
        <polygon
          points="100%,0 60%,0 100%,60%"
          fill="url(#gold-gradient)"
        />
        
        {/* Circle - bottom right */}
        <circle
          cx="85%"
          cy="85%"
          r="200"
          fill="none"
          stroke="#C9A84C"
          strokeWidth="1"
          opacity="0.2"
        />
        
        {/* Smaller circle */}
        <circle
          cx="80%"
          cy="80%"
          r="120"
          fill="none"
          stroke="#C9A84C"
          strokeWidth="0.5"
          opacity="0.15"
        />
        
        {/* Diagonal lines */}
        <line
          x1="0"
          y1="100%"
          x2="100%"
          y2="0"
          stroke="#C9A84C"
          strokeWidth="0.5"
          opacity="0.1"
        />
        
        {/* Decorative dots pattern */}
        <g opacity="0.1">
          {Array.from({ length: 20 }).map((_, i) => (
            <circle
              key={i}
              cx={`${20 + (i % 5) * 15}%`}
              cy={`${20 + Math.floor(i / 5) * 15}%`}
              r="2"
              fill="#C9A84C"
            />
          ))}
        </g>
        
        {/* Accent lines */}
        <line
          x1="10%"
          y1="70%"
          x2="40%"
          y2="70%"
          stroke="#C9A84C"
          strokeWidth="2"
          opacity="0.3"
        />
      </svg>
      
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/50 via-transparent to-primary/30" />
    </div>
  );
}
