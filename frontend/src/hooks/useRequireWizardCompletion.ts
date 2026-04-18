import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Toast } from 'primereact/toast';

export function useRequireWizardCompletion() {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const hasChecked = useRef(false);

  useEffect(() => {
    // Only check once to avoid redirect loops
    if (hasChecked.current) return;
    hasChecked.current = true;

    // Check if the user came from the wizard
    const fromWizard = location.state?.fromWizard === true;

    if (!fromWizard) {
      // Redirect to quotes list with error message
      navigate('/quotes', {
        replace: true,
        state: {
          error: 'Por favor complete el wizard primero',
        },
      });
    }
  }, [location, navigate]);

  return { toast, isValid: location.state?.fromWizard === true };
}
