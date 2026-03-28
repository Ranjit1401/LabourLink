import { useApp } from '../context/AppContext';

export default function Toast() {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-3">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl text-white font-bold animate-slideUp ${
            toast.type === 'success' ? 'bg-secondary' :
            toast.type === 'error' ? 'bg-error' :
            'bg-primary'
          }`}
          style={{ animation: 'slideUp 0.3s ease-out' }}
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
            {toast.type === 'success' ? 'check_circle' : toast.type === 'error' ? 'error' : 'info'}
          </span>
          <span>{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="ml-2 p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      ))}
    </div>
  );
}
