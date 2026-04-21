import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  propertySchema,
  PROPERTY_STEP_FIELDS,
  type PropertyFormData,
} from '../schemas/property.schema';
import {
  buildPropertyDefaultValues,
  toUpdatePropertyRequest,
} from '../lib/adapters/property.adapter';
import type { Property, UpdatePropertyRequest } from '../types/property';

interface UsePropertyFormOptions {
  property: Property;
  onSave: (data: UpdatePropertyRequest) => void;
}

/**
 * Encapsula toda la lógica de formulario del stepper de inmueble.
 * - Integra RHF + zod
 * - Expone validateStep(stepIndex) para validación por paso
 * - Expone submit() para el paso de resumen
 *
 * Los componentes de UI solo reciben form.control y form.formState.errors.
 */
export function usePropertyForm({ property, onSave }: UsePropertyFormOptions) {
  const form = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: buildPropertyDefaultValues(property),
    mode: 'onTouched',
  });

  /**
   * Valida solo los fields del step actual.
   * Retorna true si son válidos, false si hay errores.
   */
  const validateStep = (step: number): Promise<boolean> => {
    const fields =
      PROPERTY_STEP_FIELDS[step as keyof typeof PROPERTY_STEP_FIELDS];
    return form.trigger(fields);
  };

  /**
   * Submit final: zod valida el schema completo y llama onSave con el adapter.
   */
  const submit = form.handleSubmit((data) => {
    onSave(toUpdatePropertyRequest(data));
  });

  return { form, validateStep, submit };
}
