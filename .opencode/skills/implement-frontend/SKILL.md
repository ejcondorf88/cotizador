---
name: implement-frontend
description: Implementa un feature completo en el frontend con React, Tailwind CSS y PrimeReact. Requiere spec con status APPROVED en .github/specs/.
argumentHint: "<nombre-feature>"
---

# Implement Frontend (React + Tailwind CSS + PrimeReact)

## Prerequisitos

1. Leer spec: `.github/specs/<feature>.spec.md` — sección 2.3 (componentes, páginas, hooks)
2. Leer stack: `.github/rules/frontend.md`
3. Verificar componentes PrimeReact disponibles: https://primereact.org/

## Stack de Frontend

- **React 19** + **Vite**
- **Tailwind CSS** — utility-first CSS framework
- **PrimeReact** — biblioteca de componentes UI
- **PrimeIcons** — iconos integrados
- **React Router v6** — routing SPA
- **Axios** — llamadas HTTP al backend

## Orden de implementación

```
services → hooks/state → components → pages/views → registrar ruta
```

| Capa | Responsabilidad | Prohibido |
|------|-----------------|-----------|
| **Services** | Llamadas HTTP al backend — sin estado, sin lógica de negocio | Estado, llamadas API en componentes |
| **Hooks / State** | Estado local, efectos, acciones — consume services | Render, acceso directo a red |
| **Components** | UI reutilizable — recibe props, emite eventos, usa PrimeReact | Estado global, llamadas API |
| **Pages / Views** | Composición final — layout + rutas, usa Tailwind | Lógica de negocio, llamadas API directas |

## Paso 1: Services (Llamadas HTTP)

```javascript
// services/featureService.js
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL;

export async function getFeatures(token) {
  const res = await axios.get(`${API_BASE}/api/v1/features`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

export async function createFeature(data, token) {
  const res = await axios.post(`${API_BASE}/api/v1/features`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

export async function updateFeature(id, data, token) {
  const res = await axios.patch(`${API_BASE}/api/v1/features/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

export async function deleteFeature(id, token) {
  await axios.delete(`${API_BASE}/api/v1/features/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
}
```

## Paso 2: Hooks (Estado y lógica)

```javascript
// hooks/useFeatures.js
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import * as featureService from '../services/featureService';

export function useFeatures() {
  const { token } = useAuth();
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFeatures = useCallback(async () => {
    setLoading(true);
    try {
      const data = await featureService.getFeatures(token);
      setFeatures(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const createFeature = async (data) => {
    const newFeature = await featureService.createFeature(data, token);
    setFeatures(prev => [...prev, newFeature]);
  };

  const updateFeature = async (id, data) => {
    const updated = await featureService.updateFeature(id, data, token);
    setFeatures(prev => prev.map(f => f.id === id ? updated : f));
  };

  const deleteFeature = async (id) => {
    await featureService.deleteFeature(id, token);
    setFeatures(prev => prev.filter(f => f.id !== id));
  };

  useEffect(() => {
    fetchFeatures();
  }, [fetchFeatures]);

  return { 
    features, 
    loading, 
    error, 
    createFeature, 
    updateFeature, 
    deleteFeature,
    refresh: fetchFeatures
  };
}
```

## Paso 3: Components (UI con PrimeReact + Tailwind)

```jsx
// components/FeatureCard.jsx
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';

export function FeatureCard({ feature, onEdit, onDelete }) {
  const header = (
    <div className="flex justify-between items-center p-4 bg-gray-50 border-b border-gray-200 rounded-t-lg">
      <h3 className="text-lg font-bold text-gray-800">{feature.name}</h3>
      <Tag 
        value={feature.status} 
        severity={feature.status === 'active' ? 'success' : 'warning'}
      />
    </div>
  );

  const footer = (
    <div className="flex justify-end gap-2 p-4 border-t border-gray-200">
      <Button 
        label="Editar" 
        icon="pi pi-pencil" 
        severity="secondary" 
        text
        onClick={() => onEdit(feature)}
      />
      <Button 
        label="Eliminar" 
        icon="pi pi-trash" 
        severity="danger" 
        text
        onClick={() => onDelete(feature.id)}
      />
    </div>
  );

  return (
    <Card header={header} footer={footer} className="shadow-md hover:shadow-lg transition-shadow">
      <div className="p-2">
        <p className="text-gray-600 mb-2">{feature.description}</p>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <i className="pi pi-calendar"></i>
          <span>Creado: {new Date(feature.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </Card>
  );
}
```

```jsx
// components/FeatureForm.jsx
import { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';

const statusOptions = [
  { label: 'Activo', value: 'active' },
  { label: 'Inactivo', value: 'inactive' },
];

export function FeatureForm({ visible, onHide, onSubmit, initialData }) {
  const [formData, setFormData] = useState(initialData || {
    name: '',
    description: '',
    status: 'active'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onHide();
  };

  const footer = (
    <div className="flex justify-end gap-2">
      <Button 
        label="Cancelar" 
        severity="secondary" 
        outlined
        onClick={onHide}
      />
      <Button 
        label="Guardar" 
        severity="success"
        type="submit"
        form="feature-form"
      />
    </div>
  );

  return (
    <Dialog 
      header={initialData ? 'Editar Feature' : 'Nuevo Feature'}
      visible={visible} 
      onHide={onHide}
      footer={footer}
      className="w-full max-w-lg"
    >
      <form id="feature-form" onSubmit={handleSubmit} className="space-y-4 pt-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre *
          </label>
          <InputText 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full"
            placeholder="Nombre del feature"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <InputTextarea 
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full"
            rows={3}
            placeholder="Descripción opcional"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estado
          </label>
          <Dropdown 
            value={formData.status}
            options={statusOptions}
            onChange={(e) => setFormData({...formData, status: e.value})}
            className="w-full"
          />
        </div>
      </form>
    </Dialog>
  );
}
```

## Paso 4: Page (Composición con Tailwind)

```jsx
// pages/FeaturePage.jsx
import { useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';
import { useFeatures } from '../hooks/useFeatures';
import { FeatureForm } from '../components/FeatureForm';

export function FeaturePage() {
  const { features, loading, createFeature, updateFeature, deleteFeature } = useFeatures();
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editingFeature, setEditingFeature] = useState(null);
  const toast = useRef(null);

  const handleEdit = (feature) => {
    setEditingFeature(feature);
    setDialogVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteFeature(id);
      toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Feature eliminado' });
    } catch (err) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: err.message });
    }
  };

  const handleSubmit = async (data) => {
    try {
      if (editingFeature) {
        await updateFeature(editingFeature.id, data);
        toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Feature actualizado' });
      } else {
        await createFeature(data);
        toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Feature creado' });
      }
      setEditingFeature(null);
    } catch (err) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: err.message });
    }
  };

  const statusBodyTemplate = (rowData) => (
    <Tag 
      value={rowData.status} 
      severity={rowData.status === 'active' ? 'success' : 'warning'}
    />
  );

  const actionsBodyTemplate = (rowData) => (
    <div className="flex gap-2">
      <Button 
        icon="pi pi-pencil" 
        severity="secondary" 
        text
        onClick={() => handleEdit(rowData)}
      />
      <Button 
        icon="pi pi-trash" 
        severity="danger" 
        text
        onClick={() => handleDelete(rowData.id)}
      />
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Toast ref={toast} />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Features</h1>
          <p className="text-gray-600 mt-1">Gestiona los features del sistema</p>
        </div>
        <Button 
          label="Nuevo Feature" 
          icon="pi pi-plus" 
          severity="success"
          onClick={() => {
            setEditingFeature(null);
            setDialogVisible(true);
          }}
        />
      </div>

      {/* Content */}
      <Card className="shadow-lg">
        <DataTable 
          value={features} 
          paginator 
          rows={10}
          loading={loading}
          className="p-datatable-sm"
          emptyMessage="No se encontraron features"
          stripedRows
        >
          <Column field="name" header="Nombre" sortable className="font-medium" />
          <Column field="description" header="Descripción" />
          <Column field="status" header="Estado" body={statusBodyTemplate} sortable />
          <Column 
            field="createdAt" 
            header="Creado" 
            sortable
            body={(rowData) => new Date(rowData.createdAt).toLocaleDateString()}
          />
          <Column body={actionsBodyTemplate} header="Acciones" style={{ width: '8rem' }} />
        </DataTable>
      </Card>

      {/* Form Dialog */}
      <FeatureForm 
        visible={dialogVisible}
        onHide={() => {
          setDialogVisible(false);
          setEditingFeature(null);
        }}
        onSubmit={handleSubmit}
        initialData={editingFeature}
      />
    </div>
  );
}
```

## Paso 5: Registrar Ruta

```jsx
// App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PrimeReactProvider } from 'primereact/api';
import { FeaturePage } from './pages/FeaturePage';
import { Layout } from './components/Layout';

import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './index.css';  // Tailwind base

function App() {
  return (
    <PrimeReactProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="features" element={<FeaturePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </PrimeReactProvider>
  );
}

export default App;
```

## Patrones de Tailwind CSS

### Layout
```jsx
<div className="flex flex-col gap-4">           {/* Flex column con gap */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">  {/* Grid responsive */}
<div className="container mx-auto px-4">       {/* Container centrado */}
```

### Espaciado
```jsx
<div className="p-6">                           {/* padding: 1.5rem */}
<div className="m-4">                           {/* margin: 1rem */}
<div className="space-y-4">                     {/* space between children */}
<div className="gap-4">                         {/* gap entre items */}
```

### Tipografía
```jsx
<h1 className="text-3xl font-bold text-gray-800">
<p className="text-sm text-gray-600 leading-relaxed">
<span className="text-red-500 font-medium">
```

### Colores y fondos
```jsx
<div className="bg-white rounded-lg shadow-md">
<div className="bg-blue-500 hover:bg-blue-600 text-white">
<div className="border border-gray-300 rounded">
```

### Responsive (mobile-first)
```jsx
<div className="w-full md:w-1/2 lg:w-1/3">      {/* responsive widths */}
<div className="text-sm md:text-base lg:text-lg"> {/* responsive text */}
<div className="hidden md:block">               {/* hide on mobile */}
```

## Componentes PrimeReact Esenciales

| Componente | Cuándo usar | Ejemplo |
|------------|-------------|---------|
| `Button` | Acciones del usuario | `<Button label="Guardar" icon="pi pi-check" />` |
| `Card` | Contenedores de contenido | `<Card title="Título">...</Card>` |
| `Dialog` | Modales, formularios | `<Dialog header="Editar" visible={v} onHide={fn} />` |
| `InputText` | Campos de texto | `<InputText value={v} onChange={fn} />` |
| `InputTextarea` | Texto multilinea | `<InputTextarea rows={3} />` |
| `Dropdown` | Selectores | `<Dropdown options={opts} />` |
| `DataTable` | Listados con paginación | `<DataTable value={data} paginator>` |
| `Column` | Columnas de tabla | `<Column field="name" header="Nombre" />` |
| `Tag` | Badges de estado | `<Tag value="Activo" severity="success" />` |
| `Toast` | Notificaciones | `<Toast ref={toast} />` |
| `ConfirmDialog` | Confirmaciones | `<ConfirmDialog />` |

## Reglas

Ver `.github/rules/frontend.md`:
- Tailwind CSS para todos los estilos
- PrimeReact para componentes UI complejos
- CSS Modules prohibido
- Services solo para HTTP
- Hooks para estado y lógica
- Components solo para UI

## Restricciones

- **SOLO** directorio `frontend/src/`. No tocar backend.
- **NO** generar tests (responsabilidad de `test-engineer-frontend`).
- **NUNCA** usar CSS Modules o `style={{}}`.
- **SIEMPRE** usar PrimeReact para tablas, modales, dropdowns.
- **SIEMPRE** aplicar Tailwind para layout, espaciado, colores.
