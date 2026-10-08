import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hideToast } from '../features/ui/uiSlice';

export default function Toast() {
  const toast = useSelector((s) => s.ui.toast);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => dispatch(hideToast()), 3000);
    return () => clearTimeout(t);
  }, [toast, dispatch]);

  if (!toast) return null;
  return <div className={`toast ${toast.type}`}>{toast.message}</div>;
}