import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useFeature } from '../../hooks/useFeature';
import { FeatureCard } from '../../components/FeatureCard';
import { FeatureFormModal } from '../../components/FeatureFormModal';
import styles from './FeaturePage.module.css';

/**
 * FeaturePage - Página principal del módulo de Features
 * 
 * Responsabilidades:
 * - Layout y composición de componentes
 * - Manejo de estado de UI (modal, filtros)
 * - Integración con hooks de datos y auth
 */
export function FeaturePage() {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const { items, loading, error, create, update, remove } = useFeature(token);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const handleCreate = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este elemento?')) {
      await remove(id);
    }
  };

  const handleModalSubmit = async (data) => {
    if (editingItem) {
      await update(editingItem.id, data);
    } else {
      await create(data);
    }
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleGoBack = () => {
    navigate('/dashboard');
  };

  if (loading && items.length === 0) {
    return <div className={styles.loading}>Cargando...</div>;
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>Error al cargar los datos: {error.message}</p>
        <button onClick={() => window.location.reload()}>Reintentar</button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button onClick={handleGoBack} className={styles.backButton}>
          ← Volver al Dashboard
        </button>
        <h1 className={styles.title}>Features</h1>
        <button onClick={handleCreate} className={styles.createButton}>
          + Nuevo Feature
        </button>
      </header>

      <main className={styles.main}>
        {items.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No hay features registrados.</p>
            <button onClick={handleCreate}>Crear el primero</button>
          </div>
        ) : (
          <div className={styles.grid}>
            {items.map((item) => (
              <FeatureCard
                key={item.id}
                item={item}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      <FeatureFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        onSubmit={handleModalSubmit}
        initialData={editingItem}
        title={editingItem ? 'Editar Feature' : 'Nuevo Feature'}
      />
    </div>
  );
}
