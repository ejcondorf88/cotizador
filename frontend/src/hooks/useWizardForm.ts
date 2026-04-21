import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  wizardSchema,
  WIZARD_STEP_FIELDS,
  type WizardFormData,
} from '../schemas/wizard.schema';
import { buildWizardDefaultValues } from '../lib/adapters/quote.adapter';

/**
 * Encapsula toda la lógica de formulario del wizard de cotización.
 * - Integra RHF + zod
 * - Persiste el progreso en localStorage
 * - Expone validateStep(stepNumber) para validación por paso
 *
 * Los componentes de UI solo reciben `form.control` y `form.formState.errors`.
 */
export function useWizardForm(quoteId: string) {
  // Cargar progreso guardado desde localStorage
  const saved = (() => {
    try {
      const raw = localStorage.getItem(`quote-wizard-${quoteId}`);
      return raw ? (JSON.parse(raw) as Partial<WizardFormData>) : undefined;
    } catch {
      return undefined;
    }
  })();

  const form = useForm<WizardFormData>({
    resolver: zodResolver(wizardSchema),
    defaultValues: buildWizardDefaultValues(saved),
    mode: 'onTouched',
  });

  // Auto-guardar en localStorage cuando el usuario modifica el form
  useEffect(() => {
    const subscription = form.watch((values) => {
      localStorage.setItem(`quote-wizard-${quoteId}`, JSON.stringify(values));
    });
    return () => subscription.unsubscribe();
  }, [form.watch, quoteId]);

  /**
   * Valida solo los fields del step actual.
   * Retorna true si son válidos, false si hay errores.
   */
  const validateStep = (step: number): Promise<boolean> => {
    const fields = WIZARD_STEP_FIELDS[step as keyof typeof WIZARD_STEP_FIELDS];
    return form.trigger(fields);
  };

  /** Elimina el progreso guardado (llamar después de submit exitoso) */
  const clearSaved = () => {
    localStorage.removeItem(`quote-wizard-${quoteId}`);
  };

  return { form, validateStep, clearSaved };
}
