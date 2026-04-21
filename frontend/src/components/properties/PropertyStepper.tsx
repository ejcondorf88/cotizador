import { useState, useCallback, useRef } from 'react';
import { useWatch } from 'react-hook-form';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { PropertyLocationSection } from './PropertyLocationSection';
import { PropertyConstructionSection } from './PropertyConstructionSection';
import { PropertyCoverageSection } from './PropertyCoverageSection';
import { PropertySummarySection } from './PropertySummarySection';
import { usePropertyForm } from '../../hooks/usePropertyForm';
import type { Property, UpdatePropertyRequest } from '../../types/property';

interface PropertyStepperProps {
  property: Property;
  onSave: (data: UpdatePropertyRequest) => void;
  isSaving: boolean;
}

const steps = [
  { label: 'Ubicación',    icon: '📍', description: 'Dirección del inmueble' },
  { label: 'Construcción', icon: '🏗️', description: 'Características' },
  { label: 'Garantías',   icon: '🛡️', description: 'Coberturas' },
  { label: 'Resumen',     icon: '✅', description: 'Verificación' },
];

/**
 * Contenedor del stepper de inmueble.
 * Responsabilidades:
 *   - UI state: activeStep, toast
 *   - Instanciar usePropertyForm y pasar control + errors a las secciones
 *
 * Lo que NO hace:
 *   - No maneja formData ni errors manualmente
 *   - No tiene lógica de validación inline
 *   - No tiene adapters (toUpdatePropertyRequest) — están en el hook
 */
export function PropertyStepper({ property, onSave, isSaving }: PropertyStepperProps) {
  const [activeStep, setActiveStep] = useState(0);
  const toast = useRef<Toast>(null);

  // Hook que encapsula TODO el estado del formulario
  const { form, validateStep, submit } = usePropertyForm({ property, onSave });
  const { control, formState: { errors }, setValue } = form;

  // Leer valores del form para construir el resumen (paso 4)
  // useWatch se suscribe solo a los campos necesarios
  const formValues = useWatch({ control });

  const handleNext = useCallback(async () => {
    const isValid = await validateStep(activeStep);
    if (!isValid) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Campos incompletos',
        detail: 'Por favor complete todos los campos requeridos',
        life: 3000,
      });
      return;
    }
    if (activeStep < steps.length - 1) {
      setActiveStep((prev) => prev + 1);
    }
  }, [activeStep, validateStep]);

  const handlePrevious = useCallback(() => {
    if (activeStep > 0) setActiveStep((prev) => prev - 1);
  }, [activeStep]);

  const handleStepClick = useCallback(
    (index: number) => {
      if (index < activeStep) {
        setActiveStep(index);
      } else if (index === activeStep + 1) {
        handleNext();
      } else if (index > activeStep + 1) {
        toast.current?.show({
          severity: 'warn',
          summary: 'Paso no disponible',
          detail: 'Complete los pasos anteriores primero',
          life: 3000,
        });
      }
    },
    [activeStep, handleNext]
  );

  /**
   * Construye un objeto Property "enriquecido" con los valores actuales del form
   * para pasarlo a PropertySummarySection (que espera la forma nested de Property).
   * Solo se crea en el step 3 (resumen).
   */
  const buildSummaryProperty = (): Property => ({
    ...property,
    name: formValues.name || '',
    address: {
      street:       formValues.street       || '',
      neighborhood: formValues.neighborhood || '',
      city:         formValues.city         || '',
      state:        formValues.state        || '',
      zipCode:      formValues.zipCode      || '',
    },
    construction: {
      type:             formValues.constructionType ?? property.construction?.type,
      year:             formValues.constructionYear,
      levels:           formValues.levels ?? 1,
      usage:            formValues.propertyUsage ?? property.construction?.usage,
      specificActivity: formValues.specificActivity || '',
      activityCode:     formValues.activityCode,
    },
    coverages: {
      building:          formValues.coverageBuilding   ?? 0,
      contents:          formValues.coverageContents   ?? 0,
      electronicEquipment: formValues.coverageElectronic ?? 0,
      machinery:         formValues.coverageMachinery  ?? 0,
      stock:             formValues.coverageStock       ?? 0,
    },
  });

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return <PropertyLocationSection control={control} errors={errors} />;
      case 1:
        return (
          <PropertyConstructionSection
            control={control}
            errors={errors}
            setValue={setValue}
          />
        );
      case 2:
        return <PropertyCoverageSection control={control} errors={errors} />;
      case 3:
        return (
          <PropertySummarySection
            property={buildSummaryProperty()}
            onSave={submit}
            isSaving={isSaving}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Toast ref={toast} position="top-center" />

      {/* Stepper Header */}
      <div className="bg-[#252540] rounded-lg p-4 border border-gray-700">
        <div className="w-full py-4">
          <div className="flex items-center justify-between relative">
            {/* Línea de fondo */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-700 -translate-y-1/2" />
            {/* Línea de progreso */}
            <div
              className="absolute top-1/2 left-0 h-0.5 bg-[#C9A84C] -translate-y-1/2 transition-all duration-500"
              style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
            />

            {steps.map((step, index) => {
              const isActive    = index === activeStep;
              const isCompleted = index < activeStep;

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleStepClick(index)}
                  className="relative z-10 flex flex-col items-center cursor-pointer"
                >
                  <div
                    className={`
                      w-12 h-12 rounded-full flex items-center justify-center text-lg
                      transition-all duration-300 border-2
                      ${isActive
                        ? 'bg-[#C9A84C] border-[#C9A84C] text-[#1A1A2E] scale-110'
                        : isCompleted
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'bg-[#1A1A2E] border-gray-600 text-gray-400'
                      }
                    `}
                  >
                    {isCompleted ? <i className="pi pi-check" /> : <span>{step.icon}</span>}
                  </div>
                  <div className="mt-3 text-center">
                    <p className={`
                      text-xs font-medium transition-colors duration-300
                      ${isActive ? 'text-[#C9A84C]' : isCompleted ? 'text-green-500' : 'text-gray-500'}
                    `}>
                      {step.label}
                    </p>
                    <p className="text-[10px] text-gray-600 mt-1">{step.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Contenido del step */}
      <div className="bg-[#252540] rounded-lg p-6 border border-gray-700">
        {renderStep()}
      </div>

      {/* Botones de navegación (ocultos en el paso de resumen — tiene su propio botón de guardar) */}
      {activeStep < steps.length - 1 && (
        <div className="flex justify-between pt-4 border-t border-gray-700">
          <Button
            label="Anterior"
            icon="pi pi-arrow-left"
            onClick={handlePrevious}
            disabled={activeStep === 0}
            className="bg-transparent border border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
          />
          <Button
            label="Siguiente"
            icon="pi pi-arrow-right"
            iconPos="right"
            onClick={handleNext}
            className="bg-[#C9A84C] hover:bg-[#B8983E] text-white border-none"
          />
        </div>
      )}
    </div>
  );
}
