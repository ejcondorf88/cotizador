# ADR-004: React + Vite sobre Next.js

## Status
Accepted

## Date
2025-01-20

## Context
Necesitábamos elegir el framework frontend para el wizard de cotizaciones. Las opciones consideradas fueron:

- **React + Vite**: SPA clásica con build tool moderno
- **Next.js**: Framework full-stack con SSR/SSG
- **Remix**: Framework con SSR y data loading
- **Astro**: Framework de contenido estático

## Decision
**Usar React 19 + Vite 8** para el frontend.

## Consequences

### Positive
- **Hot Module Replacement (HMR)**: Actualizaciones instantáneas en desarrollo
- **Build rápido**: Esbuild-based, mucho más rápido que Webpack
- **Bundle optimizado**: Tree-shaking y code splitting integrados
- **Simplicidad**: Menos configuración que Next.js para SPA
- **React 19**: Nuevas features como Server Components (cuando aplique)
- **TypeScript**: Soporte first-class

### Negative
- **Sin SSR**: No hay Server-Side Rendering (no lo necesitamos)
- **SEO**: Limitado (no es problema, es una app interna de agentes)
- **Sin API routes**: Requiere backend separado (que ya tenemos)

## Razones para NO usar Next.js

| Feature Next.js | Necesidad | Decisión |
|-----------------|-----------|----------|
| SSR | No necesitamos SEO | Innecesario |
| API Routes | Ya tenemos ms-core | Duplicado |
| Image Optimization | Logo estático | Overkill |
| File-system routing | SPA con wizard | No aplica |

## Estructura del Proyecto

```
frontend/
├── src/
│   ├── components/     # Componentes reutilizables
│   ├── pages/         # Páginas del wizard (6 pasos)
│   ├── hooks/         # Custom hooks (React Query)
│   ├── services/      # API calls
│   ├── store/         # Zustand stores
│   └── types/         # TypeScript interfaces
├── public/            # Assets estáticos
├── index.html         # Entry point SPA
├── vite.config.ts     # Configuración Vite
└── tailwind.config.js # Configuración Tailwind
```

## Scripts

```bash
npm run dev      # Puerto 5173 con HMR
npm run build    # Build para producción
npm run preview  # Preview del build
npm run lint     # ESLint
```

## Alternatives Considered

| Alternativa | Razón de rechazo |
|-------------|------------------|
| Next.js | Overkill para SPA interna, no necesitamos SSR |
| Remix | Más enfocado a SSR, complejidad innecesaria |
| Angular | Framework pesado, curva de aprendizaje alta |
| Vue + Vite | Decision de equipo por experiencia en React |

## Related Decisions
- ADR-001: TypeScript (React usa TypeScript)
- ADR-005: Tailwind CSS (integrado con Vite)
