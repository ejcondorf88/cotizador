import { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Link, useNavigate } from 'react-router-dom';
import { useScrollPosition } from '../hooks/useScrollPosition';

const navLinks = [
  { label: 'Nosotros', href: '#nosotros' },
  { label: 'Productos', href: '#productos' },
  { label: 'Agentes', href: '#agentes' },
  { label: 'Arquitectura', href: '#arquitectura' },
  { label: 'Contacto', href: '#contacto' },
];

export function Navbar() {
  const { isScrolled } = useScrollPosition(50);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'glassmorphism shadow-lg py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <nav className="max-w-7xl mx-auto section-padding flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span
            className={`font-heading text-2xl font-bold transition-colors duration-300 ${
              isScrolled ? 'text-primary' : 'text-white'
            }`}
          >
            Segura
            <span className="text-accent">X</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link.href)}
              className={`font-body text-sm font-medium transition-colors duration-300 hover:text-accent ${
                isScrolled ? 'text-primary' : 'text-white'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* CTA Button - Desktop */}
        <div className="hidden md:block">
          <Button
            label="Cotizar ahora"
            onClick={() => navigate('/cotizador')}
            className="bg-accent border-accent hover:bg-accent-hover px-6 py-2 text-sm font-medium"
            style={{ backgroundColor: '#C9A84C', borderColor: '#C9A84C' }}
          />
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2"
          aria-label="Toggle menu"
        >
          <div className="w-6 flex flex-col gap-1.5">
            <span
              className={`block h-0.5 w-full transition-all duration-300 ${
                isScrolled || isMobileMenuOpen ? 'bg-primary' : 'bg-white'
              } ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}
            />
            <span
              className={`block h-0.5 w-full transition-all duration-300 ${
                isScrolled || isMobileMenuOpen ? 'bg-primary' : 'bg-white'
              } ${isMobileMenuOpen ? 'opacity-0' : ''}`}
            />
            <span
              className={`block h-0.5 w-full transition-all duration-300 ${
                isScrolled || isMobileMenuOpen ? 'bg-primary' : 'bg-white'
              } ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}
            />
          </div>
        </button>

        {/* Mobile Menu Overlay */}
        <div
          className={`fixed inset-0 bg-primary/95 backdrop-blur-lg md:hidden transition-all duration-300 ${
            isMobileMenuOpen
              ? 'opacity-100 pointer-events-auto'
              : 'opacity-0 pointer-events-none'
          }`}
          style={{ top: '72px' }}
        >
          <div className="flex flex-col items-center justify-center h-full gap-8 p-8">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="font-body text-xl font-medium text-white hover:text-accent transition-colors"
              >
                {link.label}
              </button>
            ))}
            <Button
              label="Cotizar ahora"
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigate('/cotizador');
              }}
              className="mt-4 px-8 py-3 text-lg font-medium"
              style={{ backgroundColor: '#C9A84C', borderColor: '#C9A84C', color: 'white' }}
            />
          </div>
        </div>
      </nav>
    </header>
  );
}
