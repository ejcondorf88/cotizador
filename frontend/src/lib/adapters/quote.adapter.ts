import type { UpdateQuoteRequest } from '../../types/quote';
import type { WizardFormData } from '../../schemas/wizard.schema';

/**
 * Transforma los datos del formulario wizard al request del API.
 * Adapter puro: sin lógica de negocio, sin efectos secundarios.
 */
export function toUpdateQuoteRequest(data: WizardFormData): UpdateQuoteRequest {
  return {
    companyName: data.companyName,
    rfc: data.rfc.toUpperCase(),
    businessLine: data.businessLine,
    businessType: data.businessType,
    agentKey: data.agentKey,
    agentName: data.agentName,
    agentId: data.agentId,
    subscriber: data.subscriber,
    subscriberId: data.subscriberId,
    office: data.office,
    officeId: data.officeId,
    validityStart: data.validityStart?.toISOString(),
    validityEnd: data.validityEnd?.toISOString(),
    currency: data.currency,
    paymentType: data.paymentType,
  };
}

/**
 * Construye los valores por defecto del wizard.
 * Si se pasan datos guardados (localStorage), los mezcla con los defaults.
 */
export function buildWizardDefaultValues(saved?: Partial<WizardFormData>): WizardFormData {
  const defaults: WizardFormData = {
    companyName: '',
    rfc: '',
    businessLine: '',
    businessType: '',
    agentKey: '',
    agentName: '',
    agentId: '',
    subscriber: '',
    subscriberId: '',
    office: '',
    officeId: '',
    validityStart: null as unknown as Date,
    validityEnd: null as unknown as Date,
    currency: 'MXN',
    paymentType: 'MENSUAL',
  };

  if (!saved) return defaults;

  return {
    ...defaults,
    ...saved,
    // Las fechas vienen como strings desde localStorage — hay que rehidratarlas
    validityStart: saved.validityStart
      ? new Date(saved.validityStart as unknown as string)
      : (null as unknown as Date),
    validityEnd: saved.validityEnd
      ? new Date(saved.validityEnd as unknown as string)
      : (null as unknown as Date),
  };
}
