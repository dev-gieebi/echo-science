import { useCallback, useRef, useState } from 'react';

// Hook d'envoi de formulaire : status = idle | loading | success | error
export function useFormSubmit(sender) {
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const busy = useRef(false);

  const submit = useCallback(async (payload, successMessage) => {
    if (busy.current) return false;
    busy.current = true;
    setStatus('loading');
    setMessage('');
    try {
      const res = await sender(payload);
      setStatus('success');
      setMessage(res?.demo ? res.message : (successMessage || res?.message || 'Envoyé avec succès.'));
      return true;
    } catch (err) {
      setStatus('error');
      setMessage(err?.message || 'Une erreur est survenue. Réessayez.');
      return false;
    } finally {
      busy.current = false;
    }
  }, [sender]);

  const reset = useCallback(() => { setStatus('idle'); setMessage(''); }, []);
  return { status, message, submit, reset };
}

export function FormStatus({ status, message }) {
  return (
    <p className={`form-status form-status--${status}`} role={status === 'error' ? 'alert' : 'status'} aria-live="polite">
      {message}
    </p>
  );
}
