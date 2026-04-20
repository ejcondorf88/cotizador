# ADR-005: Tailwind CSS sobre Material-UI

## Status
Accepted

## Date
2025-01-20

## Context
Necesitábamos elegir la estrategia de estilos para el frontend. Las opciones consideradas fueron:

- **Tailwind CSS**: Framework utilitario CSS
- **Material-UI (MUI)**: Componentes React con estilos Material Design
- **Styled Components**: CSS-in-JS con componentes
- **CSS Modules**: CSS scoped por componente
- **PrimeReact + Tailwind**: Combinación de librería de componentes + utilidades

## Decision
**Usar Tailwind CSS 3.4 + PrimeReact 10** para estilos.

## Consequences

### Positive
- **Bundle pequeño**: Solo se incluyen las clases usadas (tree-shaking)
- **Diseño custom**: Paleta institucional dorado/negro sin restricciones
- **Desarrollo rápido**: Clases utilitarias inline, no context switching
- **Consistencia**: Sistema de diseño predefinido (spacing, colors, typography)
- **Responsive**: Breakpoints integrados (`md:`, `lg:`)
- **PrimeReact**: Componentes complejos (Calendar, Dropdown, Table)

### Negative
- **HTML verboso**: Muchas clases en los elementos
- **Curva inicial**: Memorizar clases de Tailwind
- **Reusabilidad**: Duplicación de clases (mitigado con `@apply` o componentes)

## Paleta de Colores Institucional

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'segurax': {
          gold: '#D4AF37',      // Botones primarios
          'gold-light': '#E4C040',
          'gold-dark': '#B8941F',
          black: '#1F2937',     // Texto principal
          gray: '#6B7280',      // Texto secundario
        }
      }
    }
  }
}
```

## Patrón de Uso

```tsx
// Componente con Tailwind + PrimeReact
import { InputText } from 'primereact/inputtext';

export const CompanyForm = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-segurax-black">
        Datos de la Empresa
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Nombre de la Empresa
          </label>
          <InputText 
            className="w-full p-inputtext-sm"
            placeholder="Ej. Constructora ABC"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">RFC</label>
          <InputText 
            className="w-full p-inputtext-sm"
            maxLength={13}
          />
        </div>
      </div>
      
      <button className="bg-segurax-gold hover:bg-segurax-gold-dark 
                         text-white font-medium py-2 px-4 rounded
                         transition-colors duration-200">
        Continuar
      </button>
    </div>
  );
};
```

## Alternatives Considered

| Alternativa | Razón de rechazo |
|-------------|------------------|
| Material-UI | Estilo Material Design, difícil customizar a dorado/negro |
| Styled Components | CSS-in-JS tiene runtime overhead |
| CSS Modules | Requiere más configuración manual |
| Bootstrap | Estilo genérico, bundle más grande |

## Related Decisions
- ADR-004: React + Vite (Tailwind se integra con Vite)
