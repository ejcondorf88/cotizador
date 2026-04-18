import { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Message } from 'primereact/message';
import { QuoteListItem } from '../components/quotes/QuoteListItem';
import { QuoteEmptyState } from '../components/quotes/QuoteEmptyState';
import { QuoteOnboardingWizard } from '../components/wizard/QuoteOnboardingWizard';
import { useQuotesQuery } from '../hooks/queries/useQuotesQuery';
import { useNavigate } from 'react-router-dom';
import type { Quote } from '../types/quote';

export function QuotesListPage() {
  const { data: quotes, isLoading, error, refetch } = useQuotesQuery('DRAFT');
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [wizardVisible, setWizardVisible] = useState(false);
  const navigate = useNavigate();

  const handleComplete = (quote: Quote) => {
    setSelectedQuote(quote);
    setWizardVisible(true);
  };

  const handleWizardSuccess = () => {
    setWizardVisible(false);
    setSelectedQuote(null);
    // Refresh the list to remove the completed quote
    refetch();
  };

  const handleWizardHide = () => {
    setWizardVisible(false);
    setSelectedQuote(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-[#1A1A2E] flex flex-col">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="relative mb-12">
            <div className="absolute inset-0 bg-gradient-to-r from-[#C9A84C]/20 to-transparent rounded-2xl" />
            <div className="relative bg-[#252540] border border-[#C9A84C]/30 rounded-2xl p-8 md:p-12">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <h1 className="font-heading text-3xl md:text-4xl font-bold text-white mb-2">
                    Mis Cotizaciones Pendientes
                  </h1>
                  <p className="text-gray-400 max-w-xl">
                    Gestiona tus cotizaciones en borrador. Completa la información requerida 
                    para convertirlas en pólizas activas.
                  </p>
                </div>
                <Button
                  label="Crear Nueva Cotización"
                  icon="pi pi-plus"
                  onClick={() => navigate('/quote')}
                  className="bg-[#C9A84C] hover:bg-[#B8983E] text-white border-none px-6 py-3 whitespace-nowrap"
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="min-h-[400px]">
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-20">
                <ProgressSpinner
                  style={{ width: '60px', height: '60px' }}
                  strokeWidth="4"
                />
                <p className="text-gray-400 mt-4">Cargando cotizaciones...</p>
              </div>
            )}

            {error && (
              <div className="max-w-md mx-auto">
                <Message
                  severity="error"
                  text={error.message || 'Error al cargar las cotizaciones'}
                  className="w-full"
                />
                <div className="text-center mt-4">
                  <Button
                    label="Reintentar"
                    icon="pi pi-refresh"
                    onClick={() => refetch()}
                    className="bg-[#C9A84C] hover:bg-[#B8983E] text-white border-none"
                  />
                </div>
              </div>
            )}

            {!isLoading && !error && quotes && (
              <>
                {quotes.length === 0 ? (
                  <QuoteEmptyState />
                ) : (
                  <>
                    {/* Stats */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <i className="pi pi-clock text-[#C9A84C]" />
                        <span className="text-gray-400">
                          <span className="text-white font-medium">{quotes.length}</span>{' '}
                          {quotes.length === 1 ? 'cotización pendiente' : 'cotizaciones pendientes'}
                        </span>
                      </div>
                      <Button
                        icon="pi pi-refresh"
                        label="Actualizar"
                        text
                        onClick={() => refetch()}
                        className="text-gray-400 hover:text-[#C9A84C]"
                      />
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {quotes.map((quote) => (
                        <QuoteListItem
                          key={quote.id}
                          quote={quote}
                          onComplete={handleComplete}
                        />
                      ))}
                    </div>

                    {/* Last update info */}
                    {quotes.length > 0 && (
                      <div className="text-center mt-8 text-gray-500 text-sm">
                        Última actualización: {formatDate(new Date().toISOString())}
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Wizard Modal */}
      {selectedQuote && (
        <QuoteOnboardingWizard
          quote={selectedQuote}
          visible={wizardVisible}
          onHide={handleWizardHide}
          onSuccess={handleWizardSuccess}
        />
      )}
    </div>
  );
}
