---
description: Reglas de frontend para este proyecto (React 19 + Vite + Tailwind CSS + PrimeReact). Se aplica automáticamente a archivos frontend.
paths:
  - "frontend/**"
  - "client/**"
  - "web/**"
---

# Reglas de Frontend — React 19 + Vite + Tailwind CSS + PrimeReact

## Stack aprobado

- **React 19** con **Vite**
- **Tailwind CSS** — utility-first CSS framework
- **PrimeReact** — biblioteca de componentes UI
- **React Router v6** (rutas de la SPA)
- **Firebase SDK** — autenticación cliente (`onAuthStateChanged`, `signInWithEmailAndPassword`)
- **Axios** — llamadas HTTP al backend

**Prohibido:** CSS Modules, Bootstrap, styled-components, CSS-in-JS, Redux, MobX, fetch directo en componentes.

## Arquitectura por Capas

```
services → hooks → components → pages → App.jsx (registrar ruta)
```

| Capa | Responsabilidad | Prohibido |
|------|----------------|-----------|
| `pages/` | Layout, composición de componentes, uso de hooks | Llamadas directas a API, lógica de negocio |
| `components/` | Render UI, recibir props, emitir eventos | Estado global, llamadas a API |
| `hooks/` | Estado local + llamadas a services | Render JSX, acceso directo a Firebase |
| `services/` | Llamadas HTTP (Axios) al backend | Estado, render, lógica de negocio |

## Convenciones Obligatorias

- **Estilos:** SIEMPRE Tailwind CSS + PrimeReact — NUNCA CSS Modules
- **Componentes UI:** Usar PrimeReact (`Button`, `Dialog`, `DataTable`, etc.)
- **Auth state:** SIEMPRE consumir de `useAuth()` — nunca estado de auth paralelo
- **Variables de entorno:** SIEMPRE prefijo `VITE_` (ej. `VITE_API_URL`)
- **API calls:** van en `services/` via Axios, token siempre desde `useAuth()`
- **Rutas:** registrar en `src/App.jsx` con `<Route>` de React Router v6

## Tailwind CSS

### Instalación

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Configuración tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#64748B',
      },
    },
  },
  plugins: [],
}
```

### CSS Base (index.css)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Uso de Clases Tailwind

```jsx
// ✅ CORRECTO: Tailwind utility classes
<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
  Guardar
</button>

// ✅ CORRECTO: Con responsive y estados
<div className="flex flex-col md:flex-row gap-4 p-4 bg-gray-50 rounded-lg shadow-md">
  <input className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
</div>
```

## PrimeReact

### Instalación

```bash
npm install primereact primeicons primeflex
```

### Configuración en main.jsx

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { PrimeReactProvider } from 'primereact/api';
import App from './App';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PrimeReactProvider>
      <App />
    </PrimeReactProvider>
  </React.StrictMode>
);
```

### Componentes PrimeReact Comunes

```jsx
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast';

// Button
<Button label="Guardar" icon="pi pi-check" severity="success" onClick={handleSave} />

// Dialog
<Dialog header="Confirmar" visible={visible} onHide={() => setVisible(false)}>
  <p>¿Estás seguro?</p>
</Dialog>

// Input
<InputText value={value} onChange={(e) => setValue(e.target.value)} placeholder="Nombre" />

// DataTable
<DataTable value={products} paginator rows={10}>
  <Column field="name" header="Nombre" />
  <Column field="price" header="Precio" />
</DataTable>

// Card
<Card title="Título" className="shadow-2">
  <p className="m-0">Contenido de la tarjeta</p>
</Card>
```

### Personalización con Tailwind

```jsx
// ✅ CORRECTO: PrimeReact + Tailwind
<Button 
  label="Guardar" 
  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg shadow-lg transition-all"
/>

<Card className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
  <h2 className="text-2xl font-bold text-gray-800 mb-4">Título</h2>
  <p className="text-gray-600">Contenido</p>
</Card>
```

## Combinación Tailwind + PrimeReact

```jsx
// ✅ Ejemplo completo con ambos
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

export function UserForm({ onSubmit }) {
  return (
    <Card className="max-w-lg mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Crear Usuario</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre
          </label>
          <InputText 
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            placeholder="Ingresa el nombre"
          />
        </div>
        
        <div className="flex gap-3 pt-4">
          <Button 
            label="Cancelar" 
            severity="secondary" 
            className="flex-1"
            outlined
          />
          <Button 
            label="Guardar" 
            severity="success" 
            className="flex-1 bg-green-500 hover:bg-green-600"
          />
        </div>
      </div>
    </Card>
  );
}
```

## Llamadas a la API (patrón obligatorio)

```js
// services/featureService.js
import axios from 'axios';
const API_BASE = import.meta.env.VITE_API_URL;

export async function getFeatures(token) {
  const res = await axios.get(`${API_BASE}/api/v1/features`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}
```

```js
// hooks — obtener token siempre de useAuth()
const { token } = useAuth();
```

## Nomenclatura de Archivos

| Artefacto | Convención | Ejemplo |
|-----------|-----------|---------|
| Page | `<Feature>Page.jsx` | `FaqPage.jsx` |
| Component | `<Component>.jsx` | `FaqFormModal.jsx` |
| Hook | `use<Feature>.js` | `useFaq.js` |
| Service | `<feature>Service.js` | `faqService.js` |

- PascalCase para páginas y componentes (`.jsx`)
- camelCase con prefijo `use` para hooks
- camelCase para services
- Máximo 4 archivos nuevos por feature (page + component + hook + service)

## Estructura de Archivos de Referencia

```
frontend/src/
├── App.jsx
├── main.jsx              ← Configuración PrimeReact + Tailwind
├── config/
│   └── firebase.js       ← init Firebase (solo aquí)
├── hooks/
│   └── useAuth.js        ← fuente única de verdad para auth
├── services/
│   ├── authService.js    ← Firebase signIn + POST backend
│   └── featureService.js ← Llamadas HTTP
├── components/           ← componentes reutilizables
│   ├── Layout.jsx
│   ├── Navbar.jsx
│   └── UserForm.jsx
└── pages/                ← FeaturePage.jsx
    ├── HomePage.jsx
    └── DashboardPage.jsx
```

## Anti-patrones Prohibidos

- ❌ CSS Modules (usar Tailwind)
- ❌ Estilos inline con `style={{}}` (usar Tailwind classes)
- ❌ Crear componentes UI desde cero si PrimeReact tiene uno equivalente
- ❌ Llamadas Axios directas en componentes o páginas (van en services via hooks)
- ❌ Estado de auth duplicado fuera de `useAuth()`
- ❌ Lógica de negocio en componentes (va en hooks)
- ❌ Hardcodear URLs de API (usar `VITE_API_URL`)

## Ejemplo de Página Completa

```jsx
// pages/UserManagementPage.jsx
import { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { useUsers } from '../hooks/useUsers';
import { useAuth } from '../hooks/useAuth';

export function UserManagementPage() {
  const { users, loading, createUser, deleteUser } = useUsers();
  const { user: currentUser } = useAuth();
  const [dialogVisible, setDialogVisible] = useState(false);
  const [newUserName, setNewUserName] = useState('');

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Gestión de Usuarios</h1>
        <Button 
          label="Nuevo Usuario" 
          icon="pi pi-plus" 
          severity="success"
          onClick={() => setDialogVisible(true)}
        />
      </div>

      <Card className="shadow-lg">
        <DataTable 
          value={users} 
          paginator 
          rows={10}
          loading={loading}
          className="p-datatable-sm"
        >
          <Column field="name" header="Nombre" sortable />
          <Column field="email" header="Email" sortable />
          <Column 
            body={(rowData) => (
              <Button 
                icon="pi pi-trash" 
                severity="danger" 
                text
                onClick={() => deleteUser(rowData.id)}
              />
            )} 
          />
        </DataTable>
      </Card>

      <Dialog 
        header="Crear Usuario" 
        visible={dialogVisible} 
        onHide={() => setDialogVisible(false)}
        className="w-full max-w-md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <InputText 
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              className="w-full"
              placeholder="Ingresa el nombre"
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button 
              label="Cancelar" 
              severity="secondary" 
              outlined
              onClick={() => setDialogVisible(false)}
            />
            <Button 
              label="Guardar" 
              severity="success"
              onClick={() => {
                createUser({ name: newUserName });
                setDialogVisible(false);
              }}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
}
```

## Lineamientos completos

`.claude/docs/lineamientos/dev-guidelines.md` — Clean Code, SOLID, React Best Practices, Tailwind CSS, PrimeReact.
