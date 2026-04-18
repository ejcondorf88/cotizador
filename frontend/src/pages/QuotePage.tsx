import { useEffect, useRef } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Message } from 'primereact/message';
import { useQuoteMutation } from '../hooks/queries/useQuoteMutation';
import type { QuoteStatus } from '../types/quote';

const statusLabels: Record<QuoteStatus, string> = {
  DRAFT: 'Draft',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

const statusColors: Record<QuoteStatus, string> = {
  DRAFT: 'bg-yellow-100 text-yellow-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

export function QuotePage() {
  const { mutate: createQuote, data: quote, isPending: loading, error, isSuccess, reset } = useQuoteMutation();
  const hasRequested = useRef(false);

  useEffect(() => {
    if (!hasRequested.current && !quote && !loading && !error) {
      hasRequested.current = true;
      createQuote();
    }
  }, []);

  const handleRetry = () => {
    reset();
    createQuote();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 py-20">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="shadow-lg">
            <div className="text-center py-8">
              {loading && (
                <div className="flex flex-col items-center gap-6 py-12">
                  <ProgressSpinner
                    style={{ width: '60px', height: '60px' }}
                    strokeWidth="4"
                  />
                  <div>
                    <h2 className="font-heading text-2xl font-bold text-primary mb-2">
                      Creating quote...
                    </h2>
                    <p className="text-gray-600">
                      We are generating your unique folio number
                    </p>
                  </div>
                </div>
              )}

              {error && (
                <div className="py-8">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
                    <i className="pi pi-times text-4xl text-red-500" />
                  </div>
                  <h2 className="font-heading text-2xl font-bold text-primary mb-4">
                    Error creating quote
                  </h2>
                  <Message severity="error" text={error.message} className="mb-6" />
                  <Button
                    label="Try again"
                    icon="pi pi-refresh"
                    onClick={handleRetry}
                    className="px-6 py-3"
                    style={{ backgroundColor: '#C9A84C', borderColor: '#C9A84C' }}
                  />
                </div>
              )}

              {isSuccess && quote && (
                <div className="py-8">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
                    <i className="pi pi-check text-4xl text-green-500" />
                  </div>
                  <h2 className="font-heading text-3xl font-bold text-primary mb-2">
                    Quote Created!
                  </h2>
                  <p className="text-gray-600 mb-8">
                    Your quote has been successfully registered
                  </p>

                  <div className="bg-accent/10 rounded-xl p-8 my-8 max-w-lg mx-auto">
                    <p className="text-sm text-gray-600 mb-2 uppercase tracking-wider">
                      Folio Number
                    </p>
                    <p className="font-heading text-4xl font-bold text-accent">
                      {quote.folioNumber}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-2xl mx-auto mt-8">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-500 mb-1">Quote ID</p>
                      <p className="font-mono text-sm text-primary truncate">
                        {quote.id}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-500 mb-1">Status</p>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColors[quote.status]}`}>
                        {statusLabels[quote.status]}
                      </span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-500 mb-1">Created At</p>
                      <p className="text-primary">
                        {new Date(quote.createdAt).toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-500 mb-1">Updated At</p>
                      <p className="text-primary">
                        {new Date(quote.updatedAt).toLocaleString('en-US', {
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
                      label="Create new quote"
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
