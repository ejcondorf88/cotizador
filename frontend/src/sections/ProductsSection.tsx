import { ProductCard } from '../components/ProductCard';

const products = [
  {
    id: '1',
    title: 'Incendio y daños',
    description: 'Protección integral contra incendios, explosiones, daños por agua y otros riesgos que puedan afectar tus instalaciones.',
    icon: 'pi-fire',
  },
  {
    id: '2',
    title: 'Catástrofes naturales',
    description: 'Cobertura especializada para sismos, terremotos, erupciones volcánicas, inundaciones y otros eventos de la naturaleza.',
    icon: 'pi-cloud',
  },
  {
    id: '3',
    title: 'Robo y contenidos',
    description: 'Asegura tu inventario, equipos y bienes materiales contra robos, asaltos y daños materiales con nuestra cobertura completa.',
    icon: 'pi-shield',
  },
];

export function ProductsSection() {
  return (
    <section id="productos" className="py-20 lg:py-32 bg-background-alt">
      <div className="max-w-7xl mx-auto section-padding">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-accent/10 text-accent text-sm font-body font-medium rounded-full mb-4">
            Nuestras Coberturas
          </span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4">
            Soluciones diseñadas para tu empresa
          </h2>
          <p className="font-body text-gray-600 max-w-2xl mx-auto">
            Ofrecemos coberturas especializadas que se adaptan a las necesidades 
            específicas de tu industria y tamaño de empresa.
          </p>
        </div>
        
        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              title={product.title}
              description={product.description}
              icon={product.icon}
              delay={index * 100}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
