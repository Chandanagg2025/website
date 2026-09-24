import { useProducts } from '../context/ProductContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const Toast = () => {
  const { toast, hideToast } = useProducts();

  if (!toast.visible) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'error':
        return <AlertCircle size={20} color="#ef4444" />;
      case 'info':
        return <Info size={20} color="#60a5fa" />;
      default:
        return <CheckCircle2 size={20} color="#10b981" />;
    }
  };

  return (
    <div className="toast-container">
      <div className="toast-item">
        {getIcon()}
        <span style={{ flex: 1, fontWeight: 500 }}>{toast.message}</span>
        <button
          onClick={hideToast}
          style={{ background: 'transparent', color: '#94a3b8', padding: '2px', display: 'flex' }}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default Toast;
