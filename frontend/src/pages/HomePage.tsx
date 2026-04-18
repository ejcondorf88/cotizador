import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { HeroSection } from '../sections/HeroSection';
import { ProductsSection } from '../sections/ProductsSection';
import { HowItWorksSection } from '../sections/HowItWorksSection';
import { StatsSection } from '../sections/StatsSection';
import { CTASection } from '../sections/CTASection';

export function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <ProductsSection />
        <HowItWorksSection />
        <StatsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
