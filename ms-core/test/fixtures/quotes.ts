/**
 * Quote Test Fixtures
 *
 * Datos de prueba reutilizables para tests de Quotes.
 * Sigue el patrón Factory para crear instancias de prueba.
 */

import { Quote, QuoteDetails } from '../../src/domain/quote/entities/quote.entity';
import { QuoteStatus } from '../../src/domain/quote/enums/quote-status.enum';

/**
 * Factory function para crear una Quote básica
 */
export const createQuoteFixture = (
  overrides: Partial<{
    id: string;
    folioNumber: string;
    status: QuoteStatus;
    details: QuoteDetails;
    propertyCount: number;
  }> = {},
): Quote => {
  const id = overrides.id ?? 'quote-uuid-123';
  const folioNumber = overrides.folioNumber ?? 'COT-2026-00001';
  const now = new Date();

  return new Quote(
    id,
    folioNumber,
    overrides.status ?? QuoteStatus.DRAFT,
    now,
    now,
    overrides.details,
    overrides.propertyCount ?? 0,
  );
};

/**
 * Datos de ejemplo para DTOs de creación
 */
export const createQuoteDtoFixture = {
  valid: {
    companyName: 'Empresa Test S.A. de C.V.',
    rfc: 'TEST010101ABC',
    businessLine: 'Tecnología',
    businessType: 'Sociedad Anónima',
  },
  minimal: {
    companyName: 'Test Corp',
  },
  withDates: {
    companyName: 'Empresa con Vigencia',
    validityStart: new Date('2026-01-01'),
    validityEnd: new Date('2026-12-31'),
    currency: 'MXN' as const,
    paymentType: 'CONTADO' as const,
  },
  withAgent: {
    companyName: 'Empresa con Agente',
    agentKey: 'AGENT-001',
    agentName: 'Juan Pérez',
    subscriber: 'CÁMARA DE SEGUROS',
    office: 'Oficina Centro',
  },
};

/**
 * Fixtures para actualización
 */
export const updateQuoteDtoFixture = {
  valid: {
    companyName: 'Nueva Razón Social',
    rfc: 'NEW010101XYZ',
  },
  partial: {
    businessLine: 'Nueva Línea de Negocio',
  },
  empty: {},
};

/**
 * Array de Quotes para tests de listado
 */
export const quotesListFixture: Quote[] = [
  createQuoteFixture({ folioNumber: 'COT-2026-00001', status: QuoteStatus.DRAFT }),
  createQuoteFixture({ folioNumber: 'COT-2026-00002', status: QuoteStatus.IN_PROGRESS }),
  createQuoteFixture({ folioNumber: 'COT-2026-00003', status: QuoteStatus.COMPLETED }),
  createQuoteFixture({ folioNumber: 'COT-2026-00004', status: QuoteStatus.DRAFT }),
];

/**
 * Quotes con detalles completos
 */
export const quotesWithDetailsFixture: Quote[] = [
  createQuoteFixture({
    folioNumber: 'COT-2026-00005',
    status: QuoteStatus.IN_PROGRESS,
    details: {
      companyName: 'Tech Solutions MX',
      rfc: 'TSM010101ABC',
      businessLine: 'Tecnología',
      validityStart: new Date('2026-01-01'),
      validityEnd: new Date('2026-12-31'),
      currency: 'MXN',
      paymentType: 'MENSUAL',
    },
  }),
  createQuoteFixture({
    folioNumber: 'COT-2026-00006',
    status: QuoteStatus.COMPLETED,
    details: {
      companyName: 'Comercial del Norte',
      rfc: 'CDN020202XYZ',
      agentName: 'María García',
      subscriber: 'AGENTES MX',
    },
    propertyCount: 3,
  }),
];

/**
 * Estados válidos para filtrado
 */
export const quoteStatusFiltersFixture = {
  draft: { status: QuoteStatus.DRAFT },
  inProgress: { status: QuoteStatus.IN_PROGRESS },
  completed: { status: QuoteStatus.COMPLETED },
};

/**
 * IDs de ejemplo para tests de búsqueda
 */
export const quoteIdsFixture = {
  existing: 'quote-existing-uuid',
  nonExisting: 'quote-non-existing-uuid',
  invalid: 'invalid-id',
};
