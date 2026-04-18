import { StatItem } from '../components/StatItem';

const stats = [
  { id: '1', value: '+15', label: 'años de experiencia' },
  { id: '2', value: '+5,000', label: 'empresas aseguradas' },
  { id: '3', value: '98%', label: 'satisfacción' },
];

export function StatsSection() {
  return (
    <section className="py-20 lg:py-24 bg-primary relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-accent/20 to-transparent" />
        <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-accent/20 to-transparent" />
      </div>
      
      <div className="max-w-7xl mx-auto section-padding relative z-10">
        {/* Gold accent line */}
        <div className="flex justify-center mb-12">
          <div className="w-24 h-1 bg-accent rounded-full" />
        </div>
        
        {/* Stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <StatItem
              key={stat.id}
              value={stat.value}
              label={stat.label}
              delay={index * 200}
            />
          ))}
        </div>
        
        {/* Gold accent line */}
        <div className="flex justify-center mt-12">
          <div className="w-24 h-1 bg-accent rounded-full" />
        </div>
      </div>
    </section>
  );
}
