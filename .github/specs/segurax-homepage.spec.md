---
id: SPEC-002
status: APPROVED
feature: segurax-homepage
created: 2025-01-17
updated: 2025-01-17
author: spec-generator
version: "1.0"
related-specs: []
---

# Spec: Homepage SeguraX - Aseguradora Ecuador

> **Estado:** `DRAFT` → aprobar con `status: APPROVED` antes de iniciar implementación.
> **Ciclo de vida:** DRAFT → APPROVED → IN_PROGRESS → IMPLEMENTED → DEPRECATED

---

## 1. REQUERIMIENTOS

### Descripción
Homepage institucional y moderna para "SeguraX", aseguradora con sede en Ecuador. El diseño debe transmitir confianza, solidez financiera y profesionalismo con un toque latinoamericano elegante. Incluye navegación a cotizador y un stepper interactivo que explica el flujo de creación de cotizaciones.

### Requerimiento de Negocio
> "Crea una homepage completa en HTML/CSS/JS de una sola página para una aseguradora llamada 'SeguraX' con sede en Ecuador. El diseño debe inspirarse en el estilo de Fideval Ecuador: institucional, moderno, confiable y latinoamericano. Usa tipografía elegante (no Inter ni Roboto), paleta azul marino profundo con dorado como acento, y composición asimétrica con espacios generosos."
>
> Secciones requeridas:
> 1. Navbar fijo con logo "SeguraX", navegación y CTA "Cotizar ahora"
> 2. Hero section con headline "Protegemos lo que más importa para tu empresa", fondo geométrico
> 3. Productos/coberturas: 3 tarjetas (Incendio, Catástrofes, Robo)
> 4. Stepper interactivo: "Crear el folio" con 5 pasos navegables
> 5. Estadísticas: +15 años, +5,000 empresas, 98% satisfacción
> 6. CTA final oscuro con "¿Listo para proteger tu empresa?"
> 7. Footer completo
>
> Stack: React + PrimeReact + Tailwind CSS

### Historias de Usuario

#### HU-01: Ver Homepage Institucional

```
Como: Visitante potencial de SeguraX
Quiero: Ver una homepage profesional y elegante
Para: Generar confianza en la marca y explorar servicios

Prioridad: Alta
Estimación: L
Dependencias: Ninguna
Capa: Frontend
```

#### Criterios de Aceptación — HU-01

**Happy Path**
```gherkin
CRITERIO-1.1: Carga exitosa de homepage
Dado que: El usuario accede a la URL raíz del sitio
Cuando: La página termina de cargar
Entonces: Se visualiza el navbar fijo con logo "SeguraX" y navegación
Y: El hero section muestra el headline principal y botones de acción
Y: Las secciones de productos, stepper, estadísticas y footer se renderizan correctamente
Y: Se aplica la tipografía Playfair Display para headings y DM Sans para body
```

**Error Path**
```gherkin
CRITERIO-1.2: Error de carga de recursos
Dado que: El usuario accede al sitio
Cuando: Hay problemas de conexión o recursos no disponibles
Entonces: Se muestra un mensaje de error amigable
Y: Se ofrece un botón para reintentar la carga
```

#### HU-02: Navegar el Stepper Interactivo

```
Como: Agente interesado en el proceso
Quiero: Navegar los 5 pasos del flujo "Crear el folio"
Para: Entender cómo funciona el sistema de cotizaciones

Prioridad: Alta
Estimación: M
Dependencias: HU-01
Capa: Frontend
```

#### Criterios de Aceptación — HU-02

**Happy Path**
```gherkin
CRITERIO-2.1: Navegación por pasos del stepper
Dado que: El usuario está en la sección "¿Cómo funciona?"
Cuando: Hace clic en el botón "Siguiente"
Entonces: El stepper avanza al siguiente paso
Y: El paso activo se resalta visualmente
Y: Se actualiza la descripción del paso actual

CRITERIO-2.2: Navegación hacia atrás
Dado que: El usuario está en el paso 3 del stepper
Cuando: Hace clic en el botón "Anterior"
Entonces: El stepper retrocede al paso 2
Y: El paso 2 se resalta como activo
```

**Edge Case**
```gherkin
CRITERIO-2.3: Límites del stepper
Dado que: El usuario está en el paso 5 (último)
Cuando: Intenta avanzar con "Siguiente"
Entonces: El botón "Siguiente" está deshabilitado
Y: Se muestra un mensaje indicando que es el último paso

CRITERIO-2.4: Primer paso
Dado que: El usuario está en el paso 1
Cuando: Intenta retroceder con "Anterior"
Entonces: El botón "Anterior" está deshabilitado
```

#### HU-03: Explorar Productos de Cobertura

```
Como: Dueño de empresa
Quiero: Ver los tipos de seguros disponibles
Para: Identificar cuál se adapta a mis necesidades

Prioridad: Media
Estimación: S
Dependencias: HU-01
Capa: Frontend
```

#### Criterios de Aceptación — HU-03

**Happy Path**
```gherkin
CRITERIO-3.1: Visualización de productos
Dado que: El usuario está en la homepage
Cuando: Desplaza la página hasta la sección de productos
Entonces: Se muestran 3 cards con iconos SVG
Y: Cada card muestra título (Incendio, Catástrofes, Robo) y descripción breve
Y: Al hacer hover, la card tiene animación de elevación sutil
```

#### HU-04: Acceder al Cotizador

```
Como: Usuario interesado
Quiero: Acceder al cotizador desde la homepage
Para: Iniciar una nueva cotización

Prioridad: Alta
Estimación: S
Dependencias: HU-01
Capa: Frontend
```

#### Criterios de Aceptación — HU-04

**Happy Path**
```gherkin
CRITERIO-4.1: Click en CTA "Cotizar ahora"
Dado que: El usuario está en cualquier sección de la homepage
Cuando: Hace clic en el botón "Cotizar ahora" del navbar o "Nueva Cotización" del hero
Entonces: Es redirigido a la página /cotizador
Y: El cotizador carga correctamente
```

### Reglas de Negocio

1. **Identidad Visual**: La marca "SeguraX" debe usarse consistentemente en todo el sitio
2. **Paleta de Colores**:
   - Azul marino profundo: `#0A1628` (primary)
   - Dorado: `#C9A84C` (accent)
   - Blanco: `#FAFAFA` (background)
   - Gris claro: `#F4F4F0` (secondary background)
3. **Tipografía**:
   - Headings: Playfair Display (elegante, serif)
   - Body: DM Sans (moderna, sans-serif)
4. **Diseño**: Composición asimétrica con espacios generosos (padding/margin de 4rem+ en desktop)
5. **Responsive**: Mobile-first, breakpoints en 640px, 768px, 1024px, 1280px
6. **Animaciones**: CSS suaves en scroll y hover (transiciones de 300ms ease)
7. **Accesibilidad**: WCAG 2.1 nivel AA, navegación por teclado, roles ARIA
8. **Stepper**: Debe funcionar con JS puro/React hooks, sin dependencias externas de stepper

---

## 2. DISEÑO

### Estructura de la Página

```
HomePage Layout:
├── Navbar (sticky, z-50)
│   ├── Logo "SeguraX" (izquierda) - Playfair Display, dorado
│   ├── Links de navegación (centro): Nosotros, Productos, Agentes, Contacto
│   └── CTA "Cotizar ahora" (derecha) - Botón dorado #C9A84C
├── HeroSection
│   ├── Fondo: Formas geométricas decorativas (CSS/SVG), azul marino #0A1628
│   ├── Overlay: Gradiente sutil
│   ├── Headline: "Protegemos lo que más importa para tu empresa" - Playfair Display
│   ├── Subheadline: Texto breve descriptivo
│   ├── Botón primario: "Nueva Cotización" - dorado
│   └── Botón secundario: "Ver productos" - outline blanco
├── ProductsSection (fondo #F4F4F0)
│   ├── Título: "Nuestras Coberturas"
│   └── Grid de 3 cards:
│       ├── Card 1: Icono 🔥 + "Incendio y daños" + descripción
│       ├── Card 2: Icono 🌪️ + "Catástrofes naturales" + descripción
│       └── Card 3: Icono 🛡️ + "Robo y contenidos" + descripción
├── HowItWorksSection
│   ├── Título: "¿Cómo funciona?"
│   ├── Subtítulo: "Crear el folio"
│   └── Stepper horizontal interactivo:
│       ├── Paso 1: Icono + "El agente abre la app"
│       ├── Paso 2: Icono + "Hace click en 'Nueva cotización'"
│       ├── Paso 3: Icono + "El sistema genera el folio (ej: COT-2024-00042)"
│       ├── Paso 4: Icono + "Nace la cotización en estado BORRADOR"
│       ├── Paso 5: Icono + "El agente ve la pantalla lista para capturar"
│       ├── Indicador visual del paso activo (dorado)
│       └── Controles: [Anterior] [Siguiente]
├── StatsSection
│   ├── Fondo: Azul marino #0A1628
│   ├── Grid de 3 estadísticas:
│   │   ├── "+15" - "años de experiencia"
│   │   ├── "+5,000" - "empresas aseguradas"
│   │   └── "98%" - "satisfacción"
│   └── Separadores decorativos dorados
├── CTASection
│   ├── Fondo: Azul marino oscuro
│   ├── Headline: "¿Listo para proteger tu empresa?"
│   └── Botón: "Iniciar cotización" - dorado grande
└── Footer
    ├── Logo SeguraX
    ├── Links legales (Privacidad, Términos, etc.)
    ├── Redes sociales (iconos)
    └── Copyright: "© 2024 SeguraX. Todos los derechos reservados."
```

### Paleta de Colores

```css
/* Colores Principales */
--color-primary: #0A1628;        /* Azul marino profundo */
--color-primary-light: #1a2942;   /* Azul marino claro */
--color-primary-dark: #050a12;    /* Azul marino oscuro */

/* Color de Acento */
--color-accent: #C9A84C;           /* Dorado elegante */
--color-accent-hover: #b8993d;    /* Dorado hover */
--color-accent-light: #d4b86a;    /* Dorado claro */

/* Colores de Fondo */
--color-background: #FAFAFA;       /* Blanco hueso */
--color-background-alt: #F4F4F0;   /* Gris muy claro */

/* Texto */
--color-text-primary: #0A1628;     /* Texto principal */
--color-text-secondary: #4a5568;   /* Texto secundario */
--color-text-muted: #718096;      /* Texto muted */
--color-text-light: #FAFAFA;      /* Texto sobre fondo oscuro */

/* Estados */
--color-success: #22c55e;
--color-warning: #f59e0b;
--color-error: #ef4444;
```

### Tipografía

```css
/* Fuentes de Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Playfair+Display:wght@400;600;700&display=swap');

/* Variables CSS */
--font-heading: 'Playfair Display', Georgia, serif;
--font-body: 'DM Sans', system-ui, sans-serif;

/* Escalas tipográficas */
--text-xs: 0.75rem;      /* 12px */
--text-sm: 0.875rem;    /* 14px */
--text-base: 1rem;      /* 16px */
--text-lg: 1.125rem;    /* 18px */
--text-xl: 1.25rem;     /* 20px */
--text-2xl: 1.5rem;     /* 24px */
--text-3xl: 1.875rem;   /* 30px */
--text-4xl: 2.25rem;    /* 36px */
--text-5xl: 3rem;       /* 48px - Hero headline */
--text-6xl: 3.75rem;    /* 60px */
```

### Modelos de Datos

No se requieren modelos de datos para esta homepage estática v1.

### API Endpoints

Para la v1 de la homepage (estática), no se requieren endpoints específicos.

### Diseño Frontend

#### Componentes nuevos (PrimeReact + Tailwind)

| Componente | Archivo | Props principales | Descripción |
|------------|---------|------------------|-------------|
| `Navbar` | `components/Navbar.tsx` | `className?: string` | Navbar sticky con logo, links y CTA |
| `HeroSection` | `sections/HeroSection.tsx` | - | Hero con formas geométricas y CTA |
| `GeometricBackground` | `components/GeometricBackground.tsx` | - | SVG/CSS de formas decorativas |
| `ProductsSection` | `sections/ProductsSection.tsx` | - | Grid de 3 cards de cobertura |
| `ProductCard` | `components/ProductCard.tsx` | `icon, title, description` | Card individual de producto |
| `HowItWorksSection` | `sections/HowItWorksSection.tsx` | - | Sección con stepper interactivo |
| `Stepper` | `components/Stepper.tsx` | `steps: Step[], activeStep, onChange` | Stepper horizontal interactivo |
| `Step` | `components/Step.tsx` | `number, title, description, isActive, isCompleted` | Paso individual del stepper |
| `StatsSection` | `sections/StatsSection.tsx` | - | Fila de estadísticas |
| `StatItem` | `components/StatItem.tsx` | `value, label` | Item de estadística |
| `CTASection` | `sections/CTASection.tsx` | - | Sección de llamada a la acción final |
| `Footer` | `components/Footer.tsx` | - | Footer completo |

#### Páginas nuevas
| Página | Archivo | Ruta | Protegida |
|--------|---------|------|-----------|
| `HomePage` | `pages/HomePage.tsx` | `/` | No |
| `CotizadorPage` | `pages/CotizadorPage.tsx` | `/cotizador` | No |

#### Hooks y State
| Hook | Archivo | Retorna | Descripción |
|------|---------|---------|-------------|
| `useStepper` | `hooks/useStepper.ts` | `{ activeStep, next, previous, goTo, isFirst, isLast }` | Control del stepper interactivo |
| `useScrollPosition` | `hooks/useScrollPosition.ts` | `scrollY: number, isScrolled: boolean` | Detecta scroll para navbar |
| `useMobileMenu` | `hooks/useMobileMenu.ts` | `isOpen, toggle, close` | Control del menú móvil |

### Arquitectura y Dependencias

**Stack Tecnológico:**
- **Framework**: React 18+ con TypeScript
- **UI Components**: PrimeReact 10+
- **Estilos**: Tailwind CSS 3.4+
- **Iconos**: PrimeIcons (incluido con PrimeReact)
- **Fuentes**: Google Fonts (Playfair Display, DM Sans)
- **Build**: Vite

**Paquetes a instalar:**
```bash
npm install primereact primeicons
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**Configuración Tailwind:**
```javascript
// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0A1628',
          light: '#1a2942',
          dark: '#050a12',
        },
        accent: {
          DEFAULT: '#C9A84C',
          hover: '#b8993d',
          light: '#d4b86a',
        },
        background: {
          DEFAULT: '#FAFAFA',
          alt: '#F4F4F0',
        },
      },
      fontFamily: {
        heading: ['Playfair Display', 'Georgia', 'serif'],
        body: ['DM Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

**Estructura de Carpetas:**
```
src/
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── ProductCard.tsx
│   ├── Stepper/
│   │   ├── Stepper.tsx
│   │   ├── Step.tsx
│   │   └── StepperControls.tsx
│   ├── StatItem.tsx
│   └── GeometricBackground.tsx
├── sections/
│   ├── HeroSection.tsx
│   ├── ProductsSection.tsx
│   ├── HowItWorksSection.tsx
│   ├── StatsSection.tsx
│   └── CTASection.tsx
├── pages/
│   ├── HomePage.tsx
│   └── CotizadorPage.tsx
├── hooks/
│   ├── useStepper.ts
│   ├── useScrollPosition.ts
│   └── useMobileMenu.ts
├── styles/
│   └── index.css
├── types/
│   └── index.ts
└── App.tsx
```

### Datos del Stepper

```typescript
interface Step {
  id: number;
  title: string;
  description: string;
  icon: string; // PrimeIcons class
}

const steps: Step[] = [
  {
    id: 1,
    title: "Paso 1",
    description: "El agente abre la app",
    icon: "pi pi-mobile"
  },
  {
    id: 2,
    title: "Paso 2",
    description: "Hace click en 'Nueva cotización'",
    icon: "pi pi-plus-circle"
  },
  {
    id: 3,
    title: "Paso 3",
    description: "El sistema genera el folio (ej: COT-2024-00042)",
    icon: "pi pi-file-o"
  },
  {
    id: 4,
    title: "Paso 4",
    description: "Nace la cotización en estado BORRADOR",
    icon: "pi pi-pencil"
  },
  {
    id: 5,
    title: "Paso 5",
    description: "El agente ve la pantalla lista para capturar",
    icon: "pi pi-check-circle"
  }
];
```

### Notas de Implementación

> **Tipografía**: Importar Playfair Display y DM Sans desde Google Fonts en el HTML principal.

> **Formas Geométricas**: Usar SVG inline o CSS con `clip-path` para crear formas decorativas abstractas en el hero. Ejemplo: triángulos superpuestos, círculos con opacidad, líneas diagonales.

> **Stepper**: Implementar como componente controlado con estado `activeStep`. Usar PrimeIcons para los iconos de cada paso. El paso activo debe tener:
> - Borde dorado #C9A84C
> - Icono dorado
> - Número de paso destacado
> - Línea conectora animada entre pasos

> **Animaciones CSS**:
> - Navbar: Transición de fondo glassmorphism al hacer scroll (backdrop-blur)
> - Cards: Transform scale(1.02) y shadow-lg en hover (300ms ease)
> - Stepper: Transición suave entre pasos (fade + slide)
> - Estadísticas: Animación de contador al entrar en viewport (Intersection Observer)

> **Responsive**:
> - Mobile: Stepper vertical en lugar de horizontal
> - Tablet: Grid de 2 columnas para productos
> - Desktop: Layout asimétrico con espacios generosos (py-20, px-16)

> **Accesibilidad**:
> - Botones con aria-label descriptivo
> - Stepper navegable por teclado (flechas + Tab)
> - Contraste 4.5:1 mínimo entre texto y fondo
> - Skip to content link

> **SEO**:
> - Title: "SeguraX | Seguros Empresariales en Ecuador"
> - Meta description con keywords relevantes
> - Open Graph tags para redes sociales

---

## 3. LISTA DE TAREAS

> Checklist accionable para todos los agentes. Marcar cada ítem (`[x]`) al completarlo.

### Frontend

#### Setup Inicial
- [ ] Inicializar proyecto con Vite: `npm create vite@latest segurax-homepage -- --template react-ts`
- [ ] Instalar dependencias: `npm install primereact primeicons`
- [ ] Configurar Tailwind CSS con colores y tipografía personalizados
- [ ] Importar Google Fonts (Playfair Display, DM Sans) en index.html
- [ ] Configurar PrimeReact provider en App.tsx
- [ ] Configurar React Router con rutas: `/` y `/cotizador`

#### Componentes Base
- [ ] Crear `Navbar` con logo "SeguraX", links de navegación, CTA dorado
- [ ] Implementar efecto glassmorphism en navbar al hacer scroll (useScrollPosition)
- [ ] Crear `Footer` con logo, links legales, redes sociales, copyright
- [ ] Crear `GeometricBackground` con formas SVG/CSS decorativas

#### Secciones Homepage
- [ ] Implementar `HeroSection` con fondo geométrico azul marino
- [ ] Añadir headline "Protegemos lo que más importa para tu empresa" (Playfair Display)
- [ ] Crear botones: "Nueva Cotización" (dorado) y "Ver productos" (outline)
- [ ] Crear `ProductCard` con icono PrimeIcons, título y descripción
- [ ] Implementar `ProductsSection` con grid de 3 cards (Incendio, Catástrofes, Robo)
- [ ] Crear hook `useStepper` para lógica del stepper
- [ ] Implementar componente `Stepper` con 5 pasos interactivos
- [ ] Implementar `Step` componente individual con estados (pending, active, completed)
- [ ] Crear controles de navegación: "Anterior" y "Siguiente"
- [ ] Implementar `StatsSection` con fondo azul marino y 3 estadísticas
- [ ] Crear `StatItem` con animación de contador al entrar en viewport
- [ ] Implementar `CTASection` oscuro con headline y botón dorado grande

#### Hooks Personalizados
- [ ] `useStepper`: Manejo de estado del stepper (activeStep, next, previous, goTo)
- [ ] `useScrollPosition`: Detecta scroll para efectos de navbar
- [ ] `useMobileMenu`: Control del menú hamburguesa en móvil
- [ ] `useInView`: Intersection Observer para animaciones al scroll

#### Estilos y Responsive
- [ ] Implementar breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- [ ] Configurar espaciados asimétricos y generosos (py-16 lg:py-24)
- [ ] Asegurar que stepper sea vertical en móvil y horizontal en desktop
- [ ] Verificar contraste de colores (dorado #C9A84C sobre azul #0A1628)
- [ ] Ajustar tamaños de tipografía responsive (Playfair Display headings)

#### Animaciones y UX
- [ ] Agregar transiciones CSS suaves en hover de cards (transform, shadow)
- [ ] Implementar animación de contador en estadísticas
- [ ] Agregar smooth scroll para navegación
- [ ] Implementar transición de pasos en stepper (fade/slide)

#### Página Cotizador (Estructura básica)
- [ ] Crear `CotizadorPage` con layout básico
- [ ] Implementar navegación desde homepage al cotizador

#### Tests Frontend
- [ ] `Navbar renders logo and navigation items`
- [ ] `Navbar toggles mobile menu on hamburger click`
- [ ] `Hero renders headline and CTA buttons`
- [ ] `ProductCard renders icon, title and description`
- [ ] `Stepper advances to next step on click`
- [ ] `Stepper disables previous button on first step`
- [ ] `Stepper disables next button on last step`
- [ ] `StatItem animates counter on viewport entry`
- [ ] `CTA button navigates to /cotizador`
- [ ] `HomePage is responsive on mobile viewport`

### QA
- [ ] Ejecutar skill `/gherkin-case-generator` → criterios CRITERIO-1.1, 1.2, 2.1, 2.2, 2.3, 2.4, 3.1, 4.1
- [ ] Ejecutar skill `/risk-identifier` → clasificación ASD de riesgos
- [ ] Validar accesibilidad con axe-core o Lighthouse (WCAG 2.1 AA)
- [ ] Verificar contraste de colores (dorado #C9A84C sobre fondos)
- [ ] Probar navegación por teclado del stepper
- [ ] Validar responsive en: iPhone SE, iPhone 14, iPad, Desktop 1440px
- [ ] Medir performance con Lighthouse (objetivo: >90)
- [ ] Actualizar estado spec: `status: IMPLEMENTED`

### Documentación
- [ ] Actualizar README.md con instrucciones de instalación y ejecución
- [ ] Documentar componentes principales (props, ejemplos de uso)
- [ ] Crear ADR para decisiones de diseño (tipografía, colores)
