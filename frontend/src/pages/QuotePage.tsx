import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Message } from 'primereact/message';
import { useQuoteMutation } from '../hooks/queries/useQuoteMutation';
import { useNavigate } from 'react-router-dom';
import type { QuoteStatus } from '../types/quote';

const statusLabels: Record<QuoteStatus, string> = {
  DRAFT: 'Borrador',
  IN_PROGRESS: 'En Proceso',
  COMPLETED: 'Completada',
  CANCELLED: 'Cancelada',
};

const statusColors: Record<QuoteStatus, string> = {
  DRAFT: 'bg-yellow-100 text-yellow-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

export function QuotePage() {
  const { mutate: createQuote, data: quote, isPending: loading, error, isSuccess, reset } = useQuoteMutation();
  const navigate = useNavigate();

  const handleCreate = () => {
    createQuote();
  };

  const handleRetry = () => {
    reset();
    createQuote();
  };

  const handleGoToList = () => {
    navigate('/quotes');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 py-20">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="shadow-lg">
            <div className="text-center py-8">
              {/* Estado Inicial - Botón para crear */}
              {!loading && !error && !isSuccess && (
                <div className="flex flex-col items-center gap-6 py-12">
                  <div className="w-20 h-20 rounded-full bg-[#C9A84C]/20 flex items-center justify-center">
                    <i className="pi pi-file-edit text-[#C9A84C] text-4xl" />
                  </div>
                  <div>
                    <h2 className="font-heading text-2xl font-bold text-primary mb-2">
                      Nueva Cotización
                    </h2>
                    <p className="text-gray-600 mb-6">
                      Crea una nueva cotización para comenzar el proceso
                    </p>
                    <Button
                      label="Crear Cotización"
                      icon="pi pi-plus"
                      onClick={handleCreate}
                      className="px-6 py-3"
                      style={{ backgroundColor: '#C9A84C', borderColor: '#C9A84C' }}
                    />
                  </div>
                  <div className="mt-4">
                    <Button
                      label="Ver Cotizaciones Existentes"
                      icon="pi pi-list"
                      text
                      onClick={handleGoToList}
                      className="text-gray-500 hover:text-[#C9A84C]"
                    />
                  </div>
                </div>
              )}

              {/* Estado: Loading */}
              {loading && (
                <div className="flex flex-col items-center gap-6 py-12">
                  <ProgressSpinner
                    style={{ width: '60px', height: '60px' }}
                    strokeWidth="4"
                  />
                  <div>
                    <h2 className="font-heading text-2xl font-bold text-primary mb-2">
                      Creando cotización...
                    </h2>
                    <p className="text-gray-600">
                      Estamos generando su número de folio único
                    </p>
                  </div>
                </div>
              )}

              {/* Estado: Error */}
              {error && (
                <div className="py-8">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
                    <i className="pi pi-times text-4xl text-red-500" />
                  </div>
                  <h2 className="font-heading text-2xl font-bold text-primary mb-4">
                    Error al crear cotización
                  </h2>
                  <Message severity="error" text={error.message} className="mb-6" />
                  <Button
                    label="Intentar de nuevo"
                    icon="pi pi-refresh"
                    onClick={handleRetry}
                    className="px-6 py-3"
                    style={{ backgroundColor: '#C9A84C', borderColor: '#C9A84C' }}
                  />
                </div>
              )}

              {/* Estado: Success */}
              {isSuccess && quote && (
                <div className="py-8">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
                    <i className="pi pi-check text-4xl text-green-500" />
                  </div>
                  <h2 className="font-heading text-3xl font-bold text-primary mb-2">
                    ¡Cotización Creada!
                  </h2>
                  <p className="text-gray-600 mb-8">
                    Su cotización ha sido registrada exitosamente
                  </p>

                  <div className="bg-accent/10 rounded-xl p-8 my-8 max-w-lg mx-auto">
                    <p className="text-sm text-gray-600 mb-2 uppercase tracking-wider">
                      Número de Folio
                    </p>
                    <p className="font-heading text-4xl font-bold text-accent">
                      {quote.folioNumber}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-2xl mx-auto mt-8">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-500 mb-1">ID de Cotización</p>
                      <p className="font-mono text-sm text-primary truncate">
                        {quote.id}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-500 mb-1">Estado</p>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColors[quote.status]}`}>
                        {statusLabels[quote.status]}
                      </span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-500 mb-1">Fecha de Creación</p>
                      <p className="text-primary">
                        {new Date(quote.createdAt).toLocaleString('es-MX', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-500 mb-1">Última Actualización</p>
                      <p className="text-primary">
                        {new Date(quote.updatedAt).toLocaleString('es-MX', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      label="Completar Datos"
                      icon="pi pi-pencil"
                      onClick={handleGoToList}
                      className="px-6 py-3"
                      style={{ backgroundColor: '#C9A84C', borderColor: '#C9A84C' }}
                    />
                    <Button
                      label="Crear nueva cotización"
                      icon="pi pi-plus"
                      onClick={handleRetry}
                      outlined
                      className="px-6 py-3"
                      style={{ borderColor: '#C9A84C', color: '#C9A84C' }}
                    />
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
