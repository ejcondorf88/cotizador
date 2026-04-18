import PropTypes from 'prop-types';
import styles from './FeatureCard.module.css';

/**
 * FeatureCard - Componente de presentación para items de Feature
 * 
 * Responsabilidades:
 * - Renderizar información del item
 * - Emitir eventos onEdit y onDelete
 * - NO contiene lógica de negocio ni acceso a datos
 */
export function FeatureCard({ item, onEdit, onDelete }) {
  const handleEdit = () => {
    onEdit(item);
  };

  const handleDelete = () => {
    onDelete(item.id);
  };

  // Formatear fecha de creación
  const formattedDate = item.created_at
    ? new Date(item.created_at).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Fecha no disponible';

  return (
    <article className={styles.card} data-testid="feature-card">
      <header className={styles.header}>
        <h3 className={styles.title}>{item.name || 'Sin nombre'}</h3>
        <span className={styles.date}>{formattedDate}</span>
      </header>

      {item.description && (
        <p className={styles.description}>{item.description}</p>
      )}

      <footer className={styles.footer}>
        <button
          onClick={handleEdit}
          className={styles.editButton}
          aria-label="Editar feature"
        >
          Editar
        </button>
        <button
          onClick={handleDelete}
          className={styles.deleteButton}
          aria-label="Eliminar feature"
        >
          Eliminar
        </button>
      </footer>
    </article>
  );
}

// Validación de props con PropTypes
FeatureCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string,
    description: PropTypes.string,
    created_at: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
