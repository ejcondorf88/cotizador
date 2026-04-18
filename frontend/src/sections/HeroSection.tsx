import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { GeometricBackground } from '../components/GeometricBackground';

export function HeroSection() {
  const navigate = useNavigate();

  const handleScrollToProducts = () => {
    const element = document.querySelector('#productos');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <GeometricBackground />
      
      <div className="relative z-10 max-w-7xl mx-auto section-padding py-32 md:py-40">
        <div className="max-w-3xl">
          {/* Headline */}
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 text-shadow">
            Protegemos lo que más importa para{' '}
            <span className="text-accent">tu empresa</span>
          </h1>
          
          {/* Subheadline */}
          <p className="font-body text-lg md:text-xl text-white/80 mb-10 max-w-2xl leading-relaxed">
            Soluciones de seguros empresariales diseñadas para proteger tu patrimonio, 
            tu equipo y tu tranquilidad. Más de 15 años de experiencia en el mercado ecuatoriano.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              label="Nueva Cotización"
              onClick={() => navigate('/cotizador')}
              className="px-8 py-4 text-base font-medium rounded-lg"
              style={{ 
                backgroundColor: '#C9A84C', 
                borderColor: '#C9A84C',
                color: 'white'
              }}
            />
            <button
              onClick={handleScrollToProducts}
              className="px-8 py-4 text-base font-medium rounded-lg border-2 border-white text-white bg-transparent hover:bg-white hover:text-primary transition-all duration-300"
            >
              Ver productos
            </button>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 hidden md:block">
        <div className="flex flex-col items-center gap-2 text-white/50 animate-bounce">
          <span className="text-xs font-body tracking-widest uppercase">Scroll</span>
          <i className="pi pi-chevron-down text-lg" />
        </div>
      </div>
    </section>
  );
}
