import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';

export function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="py-20 lg:py-32 bg-primary-light relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #C9A84C 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>
      
      {/* Decorative circles */}
      <div className="absolute top-10 left-10 w-32 h-32 border border-accent/20 rounded-full" />
      <div className="absolute bottom-10 right-10 w-48 h-48 border border-accent/20 rounded-full" />
      
      <div className="max-w-4xl mx-auto section-padding relative z-10 text-center">
        <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
          ¿Listo para proteger tu empresa?
        </h2>
        <p className="font-body text-white/70 text-lg mb-10 max-w-2xl mx-auto">
          Obtén una cotización personalizada en minutos. Nuestros agentes 
          están listos para asesorarte y encontrar la mejor cobertura.
        </p>
        <Button
          label="Iniciar cotización"
          onClick={() => navigate('/cotizador')}
          className="px-10 py-4 text-lg font-medium rounded-lg"
          style={{
            backgroundColor: '#C9A84C',
            borderColor: '#C9A84C',
            color: 'white',
          }}
        />
      </div>
    </section>
  );
}
