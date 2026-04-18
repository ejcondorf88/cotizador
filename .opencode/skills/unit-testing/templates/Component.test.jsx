import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FeatureComponent } from './FeatureComponent';

// Mock services
vi.mock('../../services/featureService', () => ({
  getFeatures: vi.fn(),
  createFeature: vi.fn(),
  updateFeature: vi.fn(),
  deleteFeature: vi.fn(),
}));

describe('FeatureComponent', () => {
  // GIVEN — render + mocks de servicios
  const defaultProps = {
    item: { id: '1', name: 'Test Feature' },
    onDelete: vi.fn(),
    onEdit: vi.fn(),
  };

  it('renders name correctly', () => {
    // WHEN — render component
    render(<FeatureComponent {...defaultProps} />);

    // THEN — verificar DOM
    expect(screen.getByText('Test Feature')).toBeInTheDocument();
  });

  it('calls onDelete when button clicked', () => {
    // GIVEN — componente renderizado
    render(<FeatureComponent {...defaultProps} />);

    // WHEN — click en botón eliminar
    fireEvent.click(screen.getByRole('button', { name: /eliminar/i }));

    // THEN — handler llamado
    expect(defaultProps.onDelete).toHaveBeenCalledWith('1');
    expect(defaultProps.onDelete).toHaveBeenCalledTimes(1);
  });

  it('calls onEdit when button clicked', () => {
    // GIVEN — componente renderizado
    render(<FeatureComponent {...defaultProps} />);

    // WHEN — click en botón editar
    fireEvent.click(screen.getByRole('button', { name: /editar/i }));

    // THEN — handler llamado con item completo
    expect(defaultProps.onEdit).toHaveBeenCalledWith(defaultProps.item);
  });

  it('handles edge case with missing name', () => {
    // GIVEN — props con nombre vacío
    const propsWithEmptyName = {
      ...defaultProps,
      item: { id: '2', name: '' },
    };

    // WHEN — render
    render(<FeatureComponent {...propsWithEmptyName} />);

    // THEN — muestra placeholder o estado vacío
    expect(screen.getByText(/sin nombre/i)).toBeInTheDocument();
  });
});
