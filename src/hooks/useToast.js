import { useState, useCallback } from 'react';

let toastId = 0;

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = ++toastId;
    const newToast = { ...toast, id };
    setToasts(prev => [...prev, newToast]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  return {
    toasts,
    addToast,
    removeToast
  };
};

export default useToast;
