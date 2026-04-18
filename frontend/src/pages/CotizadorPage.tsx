import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Button } from 'primereact/button';
import { Link } from 'react-router-dom';

export function CotizadorPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center py-20">
        <div className="text-center max-w-2xl mx-auto px-4">
          <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-accent/10 flex items-center justify-center">
            <i className="pi pi-file-edit text-5xl text-accent" />
          </div>
          
          <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4">
            Cotizador en construcción
          </h1>
          
          <p className="font-body text-gray-600 text-lg mb-8">
            Estamos trabajando para ofrecerte la mejor experiencia de cotización. 
            Pronto podrás generar cotizaciones personalizadas para tu empresa.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button
                label="Volver al inicio"
                icon="pi pi-arrow-left"
                outlined
                className="px-6 py-3"
                style={{
                  borderColor: '#C9A84C',
                  color: '#C9A84C',
                }}
              />
            </Link>
          </div>
          
          {/* Contact info */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="font-body text-gray-500 text-sm mb-2">
              ¿Necesitas una cotización urgente?
            </p>
            <a 
              href="mailto:contacto@segurax.ec" 
              className="font-body text-accent hover:text-accent-hover transition-colors"
            >
              contacto@segurax.ec
            </a>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
