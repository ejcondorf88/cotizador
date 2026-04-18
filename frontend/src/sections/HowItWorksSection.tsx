import { Stepper } from '../components/Stepper/Stepper';

export function HowItWorksSection() {
  return (
    <section id="agentes" className="py-20 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto section-padding">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-accent/10 text-accent text-sm font-body font-medium rounded-full mb-4">
            ¿Cómo funciona?
          </span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4">
            Crear el folio
          </h2>
          <p className="font-body text-gray-600 max-w-2xl mx-auto">
            Proceso simple y eficiente para que nuestros agentes puedan 
            generar cotizaciones de manera rápida y precisa.
          </p>
        </div>
        
        {/* Stepper */}
        <div className="max-w-5xl mx-auto">
          <Stepper />
        </div>
      </div>
    </section>
  );
}
