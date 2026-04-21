import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { HeroSection } from '../sections/HeroSection';
import { ProductsSection } from '../sections/ProductsSection';
import { HowItWorksSection } from '../sections/HowItWorksSection';
import { StatsSection } from '../sections/StatsSection';
import { CTASection } from '../sections/CTASection';
import { FlowDiagram } from '../components/flow-visualization/FlowDiagram';

export function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <ProductsSection />
        <HowItWorksSection />
        
        {/* Nueva sección: Arquitectura Técnica */}
        <section id="arquitectura" className="py-20 lg:py-32 bg-white">
          <FlowDiagram />
        </section>
        
        <StatsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
