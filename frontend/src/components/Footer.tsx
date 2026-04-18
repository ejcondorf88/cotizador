import { Link } from 'react-router-dom';

const legalLinks = [
  { label: 'Términos y Condiciones', href: '#' },
  { label: 'Política de Privacidad', href: '#' },
  { label: 'Aviso Legal', href: '#' },
];

const socialLinks = [
  { label: 'LinkedIn', href: '#', icon: 'pi pi-linkedin' },
  { label: 'Facebook', href: '#', icon: 'pi pi-facebook' },
  { label: 'Instagram', href: '#', icon: 'pi pi-instagram' },
];

export function Footer() {
  return (
    <footer className="bg-primary text-white py-12">
      <div className="max-w-7xl mx-auto section-padding">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <Link to="/" className="inline-block mb-4">
              <span className="font-heading text-2xl font-bold">
                Segura<span className="text-accent">X</span>
              </span>
            </Link>
            <p className="text-white/70 font-body text-sm leading-relaxed max-w-md">
              Más de 15 años protegiendo empresas ecuatorianas. 
              Ofrecemos soluciones de seguros empresariales adaptadas 
              a las necesidades de tu negocio.
            </p>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-4 text-accent">
              Legal
            </h4>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-white/70 hover:text-accent transition-colors text-sm font-body"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-4 text-accent">
              Síguenos
            </h4>
            <div className="flex gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  aria-label={link.label}
                  className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:bg-accent hover:border-accent hover:text-white transition-all duration-300"
                >
                  <i className={`${link.icon} text-lg`} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/50 text-sm font-body">
            &copy; 2024 SeguraX. Todos los derechos reservados.
          </p>
          <p className="text-white/50 text-sm font-body">
            Ecuador
          </p>
        </div>
      </div>
    </footer>
  );
}
