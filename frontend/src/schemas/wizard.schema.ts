import { z } from 'zod';

export const wizardStep1Schema = z.object({
  companyName: z
    .string()
    .min(1, 'El nombre de la empresa es obligatorio')
    .max(150, 'El nombre no puede exceder 150 caracteres'),
  rfc: z
    .string()
    .min(1, 'El RFC es obligatorio')
    .regex(/^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{2,3}$/i, 'El RFC no tiene un formato válido (XXXX######XXX)'),
  businessLine: z.string().min(1, 'El giro del negocio es obligatorio'),
  businessType: z.string().min(1, 'El tipo de negocio es obligatorio'),
});

export const wizardStep2Schema = z.object({
  agentKey: z.string().min(1, 'La clave del agente es obligatoria'),
  agentName: z.string().optional().default(''),
  agentId: z.string().optional().default(''),
  subscriber: z.string().optional().default(''),
  subscriberId: z.string().optional().default(''),
  office: z.string().optional().default(''),
  officeId: z.string().optional().default(''),
});

export const wizardStep3Schema = z
  .object({
    validityStart: z.date({ required_error: 'La fecha de inicio es obligatoria' }).nullable(),
    validityEnd: z.date({ required_error: 'La fecha de fin es obligatoria' }).nullable(),
    currency: z.enum(['MXN', 'USD']),
    paymentType: z.enum(['CONTADO', 'MENSUAL', 'TRIMESTRAL', 'SEMESTRAL', 'ANUAL']),
  })
  .refine(
    (d) => {
      if (!d.validityStart || !d.validityEnd) return true;
      return d.validityEnd > d.validityStart;
    },
    {
      message: 'La fecha de fin debe ser posterior al inicio',
      path: ['validityEnd'],
    }
  );

// Schema completo — merge de los 3 pasos
export const wizardSchema = wizardStep1Schema
  .merge(wizardStep2Schema)
  .merge(wizardStep3Schema);

// El tipo se INFIERE del schema. Zod es la fuente de verdad.
export type WizardFormData = z.infer<typeof wizardSchema>;

// Fields por step para usar con trigger() de RHF
export const WIZARD_STEP_FIELDS = {
  1: ['companyName', 'rfc', 'businessLine', 'businessType'],
  2: ['agentKey'],
  3: ['validityStart', 'validityEnd', 'currency', 'paymentType'],
} satisfies Record<number, (keyof WizardFormData)[]>;
