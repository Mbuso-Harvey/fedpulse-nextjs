'use client';
import { useEffect } from 'react';
import { X } from 'lucide-react';

export function SlideOver({ isOpen, onClose, title, children, footer }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div className="p-4" onClick={e => e.stopPropagation()}>
        <div className="flex flex-col gap-3 mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">{title}</h2>
          <button className="p-4" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="p-4">
          {children}
        </div>
        {footer && (
          <div className="py-8 border-t border-slate-200 text-center text-slate-500">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
