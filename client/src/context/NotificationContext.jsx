import { createContext, useCallback, useContext, useState } from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const notify = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setNotifications((current) => [...current, { id, message, type }]);
    window.setTimeout(() => setNotifications((current) => current.filter((item) => item.id !== id)), 4500);
  }, []);
  const dismiss = (id) => setNotifications((current) => current.filter((item) => item.id !== id));
  return <NotificationContext.Provider value={notify}>{children}<div className="toast-region" aria-live="polite">{notifications.map(({ id, message, type }) => <div className={`toast toast-${type}`} key={id}><span>{type === 'success' ? <CheckCircle2 size={18} /> : type === 'error' ? <AlertCircle size={18} /> : <Info size={18} />}</span><p>{message}</p><button className="toast-close" aria-label="Dismiss notification" onClick={() => dismiss(id)}><X size={15} /></button></div>)}</div></NotificationContext.Provider>;
}

export const useNotify = () => useContext(NotificationContext);