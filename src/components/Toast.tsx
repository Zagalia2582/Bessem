import { useState, useCallback, useRef, useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X, Wifi, Download, Trash2 } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export type ToastPosition = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'top-center' | 'bottom-center';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;         // ms; 0 = sticky
  action?: ToastAction;
  icon?: React.ReactNode;    // override icon
  progress?: boolean;        // show countdown bar (default true when duration > 0)
}

interface ToastContainerProps {
  toasts: ToastItem[];
  onRemove: (id: string) => void;
  position?: ToastPosition;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<ToastType, {
  icon: React.ReactNode;
  iconColor: string;
  borderColor: string;
  bgColor: string;
  progressColor: string;
  label: string;
}> = {
  success: {
    icon: <CheckCircle size={18} />,
    iconColor: '#276749',
    borderColor: '#38A169',
    bgColor: 'linear-gradient(135deg, #F0FFF4 0%, #fff 60%)',
    progressColor: '#38A169',
    label: 'Succès',
  },
  error: {
    icon: <AlertCircle size={18} />,
    iconColor: '#C53030',
    borderColor: '#E53E3E',
    bgColor: 'linear-gradient(135deg, #FFF5F5 0%, #fff 60%)',
    progressColor: '#E53E3E',
    label: 'Erreur',
  },
  info: {
    icon: <Info size={18} />,
    iconColor: '#2B6CB0',
    borderColor: '#3182CE',
    bgColor: 'linear-gradient(135deg, #EBF8FF 0%, #fff 60%)',
    progressColor: '#3182CE',
    label: 'Information',
  },
  warning: {
    icon: <AlertTriangle size={18} />,
    iconColor: '#B45309',
    borderColor: '#ED8936',
    bgColor: 'linear-gradient(135deg, #FFFBEB 0%, #fff 60%)',
    progressColor: '#ED8936',
    label: 'Attention',
  },
};

// ─── Position styles ──────────────────────────────────────────────────────────

function positionStyle(pos: ToastPosition): React.CSSProperties {
  const base: React.CSSProperties = {
    position: 'fixed', zIndex: 99999,
    display: 'flex', flexDirection: 'column', gap: '10px',
    pointerEvents: 'none',
    maxWidth: '420px', width: 'calc(100vw - 32px)',
  };
  switch (pos) {
    case 'bottom-right':  return { ...base, bottom: 24, right: 24 };
    case 'bottom-left':   return { ...base, bottom: 24, left: 24 };
    case 'top-right':     return { ...base, top: 24, right: 24, flexDirection: 'column-reverse' };
    case 'top-left':      return { ...base, top: 24, left: 24, flexDirection: 'column-reverse' };
    case 'top-center':    return { ...base, top: 24, left: '50%', transform: 'translateX(-50%)', flexDirection: 'column-reverse', alignItems: 'center' };
    case 'bottom-center': return { ...base, bottom: 24, left: '50%', transform: 'translateX(-50%)', alignItems: 'center' };
    default:              return { ...base, bottom: 24, right: 24 };
  }
}

// ─── Single Toast Item ────────────────────────────────────────────────────────

interface SingleToastProps {
  toast: ToastItem;
  onRemove: (id: string) => void;
}

function SingleToast({ toast, onRemove }: SingleToastProps) {
  const [leaving, setLeaving] = useState(false);
  const [paused, setPaused] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(Date.now());
  const elapsedRef = useRef(0);

  const duration = toast.duration ?? 4000;
  const showProgress = toast.progress !== false && duration > 0;
  const cfg = TYPE_CONFIG[toast.type];

  // Animate the countdown progress bar
  useEffect(() => {
    if (!showProgress) return;

    const tick = () => {
      if (!paused) {
        const delta = Date.now() - startRef.current;
        elapsedRef.current = delta;
        setElapsed(Math.min(delta, duration));
        if (delta >= duration) return; // let auto-dismiss handle it
      } else {
        startRef.current = Date.now() - elapsedRef.current;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [paused, showProgress, duration]);

  const handleDismiss = useCallback(() => {
    setLeaving(true);
    setTimeout(() => onRemove(toast.id), 320);
  }, [toast.id, onRemove]);

  const progressPct = showProgress ? Math.min((elapsed / duration) * 100, 100) : 0;

  return (
    <div
      className={`toast-item no-print${leaving ? ' toast-leaving' : ' toast-entering'}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: cfg.bgColor,
        border: `1px solid ${cfg.borderColor}22`,
        borderLeft: `4px solid ${cfg.borderColor}`,
        borderRadius: '12px',
        boxShadow: `0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06), 0 0 0 1px ${cfg.borderColor}18`,
        pointerEvents: 'all',
        overflow: 'hidden',
        minWidth: '300px',
        maxWidth: '420px',
        cursor: 'default',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => { setPaused(false); startRef.current = Date.now() - elapsedRef.current; }}
    >
      {/* Main row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '14px 16px 12px' }}>
        {/* Icon */}
        <span style={{
          color: cfg.iconColor, flexShrink: 0, marginTop: '1px',
          width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {toast.icon ?? cfg.icon}
        </span>

        {/* Text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: 'Poppins, sans-serif', fontWeight: 700,
            fontSize: '13px', color: '#1E293B', lineHeight: 1.3,
          }}>
            {toast.title}
          </div>
          {toast.message && (
            <div style={{
              fontFamily: 'Poppins, sans-serif', fontSize: '12px',
              color: '#64748B', marginTop: '3px', lineHeight: 1.55,
            }}>
              {toast.message}
            </div>
          )}

          {/* Action button */}
          {toast.action && (
            <button
              onClick={() => { toast.action!.onClick(); handleDismiss(); }}
              style={{
                marginTop: '8px', padding: '4px 12px',
                background: cfg.borderColor, color: '#fff',
                border: 'none', borderRadius: '6px', cursor: 'pointer',
                fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '11px',
                transition: 'opacity .15s ease',
                display: 'inline-flex', alignItems: 'center', gap: '4px',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              {toast.action.label}
            </button>
          )}
        </div>

        {/* Close button */}
        <button
          onClick={handleDismiss}
          aria-label="Fermer la notification"
          style={{
            flexShrink: 0, background: 'none', border: 'none',
            cursor: 'pointer', color: '#94A3B8', padding: '2px',
            borderRadius: '6px', display: 'flex', alignItems: 'center',
            transition: 'color .15s ease, background .15s ease',
            marginTop: '-1px',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = '#475569';
            e.currentTarget.style.background = 'rgba(0,0,0,0.06)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = '#94A3B8';
            e.currentTarget.style.background = 'none';
          }}
        >
          <X size={15} />
        </button>
      </div>

      {/* Progress bar */}
      {showProgress && (
        <div style={{ height: '3px', background: `${cfg.borderColor}22`, position: 'relative', overflow: 'hidden' }}>
          <div
            style={{
              position: 'absolute', left: 0, top: 0, bottom: 0,
              width: `${100 - progressPct}%`,
              background: cfg.progressColor,
              transition: paused ? 'none' : 'none',
              borderRadius: '0 2px 2px 0',
            }}
          />
        </div>
      )}
    </div>
  );
}

// ─── Toast Container ──────────────────────────────────────────────────────────

export function ToastContainer({ toasts, onRemove, position = 'bottom-right' }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="no-print" style={positionStyle(position)}>
      {toasts.map(t => (
        <SingleToast key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  );
}

// ─── useToast hook ────────────────────────────────────────────────────────────

interface AddToastOptions {
  message?: string;
  duration?: number;
  action?: ToastAction;
  icon?: React.ReactNode;
  progress?: boolean;
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const remove = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
    const t = timers.current.get(id);
    if (t) { clearTimeout(t); timers.current.delete(id); }
  }, []);

  const add = useCallback((
    type: ToastType,
    title: string,
    opts: AddToastOptions = {}
  ) => {
    const { message, duration: rawDuration, action, icon, progress } = opts;
    const defaultDurations: Record<ToastType, number> = {
      success: 4000, info: 4000, warning: 5000, error: 6000,
    };
    const duration = rawDuration !== undefined ? rawDuration : defaultDurations[type];
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    setToasts(prev => {
      // Max 5 visible toasts; remove oldest if exceeded
      const trimmed = prev.length >= 5 ? prev.slice(1) : prev;
      return [...trimmed, { id, type, title, message, duration, action, icon, progress }];
    });

    if (duration > 0) {
      // Add a small buffer so the leave animation completes visually
      const timer = setTimeout(() => {
        setToasts(prev => {
          const item = prev.find(t => t.id === id);
          if (!item) return prev;
          // Mark leaving — the SingleToast component handles its own leaving state via onRemove
          return prev;
        });
        remove(id);
      }, duration + 50);
      timers.current.set(id, timer);
    }

    return id;
  }, [remove]);

  // Convenience methods
  const toast = {
    success: (title: string, opts?: AddToastOptions | string) =>
      add('success', title, typeof opts === 'string' ? { message: opts } : opts),

    error: (title: string, opts?: AddToastOptions | string) =>
      add('error', title, typeof opts === 'string' ? { message: opts } : opts),

    info: (title: string, opts?: AddToastOptions | string) =>
      add('info', title, typeof opts === 'string' ? { message: opts } : opts),

    warning: (title: string, opts?: AddToastOptions | string) =>
      add('warning', title, typeof opts === 'string' ? { message: opts } : opts),

    // Pre-built rich toasts for common app actions
    itemAdded: (name: string, onViewCart?: () => void) =>
      add('success', 'Article ajouté au devis', {
        message: name,
        duration: 3000,
        icon: <CheckCircle size={18} />,
        action: onViewCart ? { label: 'Voir devis', onClick: onViewCart } : undefined,
      }),

    itemAlreadyIn: (name: string) =>
      add('info', 'Quantité augmentée', {
        message: `${name} — déjà dans le devis`,
        duration: 2500,
      }),

    quoteSaved: (quoteNumber: string) =>
      add('success', 'Devis sauvegardé', {
        message: `Réf. ${quoteNumber} enregistré avec succès`,
        duration: 4000,
        icon: <CheckCircle size={18} />,
      }),

    pdfGenerated: (quoteNumber: string) =>
      add('success', 'PDF généré', {
        message: `Devis ${quoteNumber} — téléchargement lancé`,
        duration: 3500,
        icon: <Download size={18} />,
      }),

    settingsSaved: () =>
      add('success', 'Paramètres sauvegardés', {
        message: 'Vos informations société ont été mises à jour',
        duration: 3500,
      }),

    deleted: (label: string) =>
      add('warning', 'Supprimé', {
        message: label,
        duration: 3500,
        icon: <Trash2 size={18} />,
      }),

    statusUpdated: (newStatus: string) =>
      add('info', 'Statut mis à jour', {
        message: `Nouveau statut : ${newStatus}`,
        duration: 3000,
      }),

    offline: () =>
      add('warning', 'Mode hors-ligne', {
        message: 'Sauvegarde locale uniquement (Supabase non connecté)',
        duration: 5000,
        icon: <Wifi size={18} />,
      }),

    loginRequired: (onLogin?: () => void) =>
      add('info', 'Connexion requise', {
        message: 'Connectez-vous pour sauvegarder vos devis',
        duration: 6000,
        action: onLogin ? { label: 'Se connecter', onClick: onLogin } : undefined,
      }),

    networkError: (detail?: string) =>
      add('error', 'Erreur réseau', {
        message: detail ?? 'Impossible de joindre le serveur. Réessayez.',
        duration: 7000,
      }),

    copied: (what: string) =>
      add('success', 'Copié !', {
        message: what,
        duration: 2000,
      }),
  };

  return { toasts, toast, removeToast: remove };
}
