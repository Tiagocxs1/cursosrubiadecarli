'use client';

import { useState, useEffect } from 'react';
import { Shield, X } from 'lucide-react';

const CONSENT_KEY = 'rubia_cookie_consent';

type ConsentState = 'accepted' | 'rejected' | null;

function updateGoogleConsent(state: 'accepted' | 'rejected') {
  if (typeof window === 'undefined' || !window.gtag) return;
  const granted = state === 'accepted' ? 'granted' : 'denied';
  window.gtag('consent', 'update', {
    analytics_storage: granted,
    ad_storage: granted,
    ad_user_data: granted,
    ad_personalization: granted,
  });
}

export default function CookieBanner() {
  const [consent, setConsent] = useState<ConsentState>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY) as ConsentState;
    if (stored) {
      setConsent(stored);
      updateGoogleConsent(stored);
    } else {
      // Exibe após 1s para não prejudicar o LCP
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  function accept() {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    setConsent('accepted');
    updateGoogleConsent('accepted');
    setVisible(false);
  }

  function reject() {
    localStorage.setItem(CONSENT_KEY, 'rejected');
    setConsent('rejected');
    updateGoogleConsent('rejected');
    setVisible(false);
  }

  if (!visible || consent !== null) return null;

  return (
    <div
      role="dialog"
      aria-label="Aviso de cookies"
      className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-white border-t border-[#D4AF37]/20 shadow-2xl"
    >
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center gap-4">
        <Shield className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5 hidden md:block" />

        <div className="flex-1 pr-6 md:pr-0">
          <p className="text-sm text-[#1A1A1A] font-medium mb-1">
            Usamos cookies para melhorar sua experiência
          </p>
          <p className="text-xs text-[#4A3F35] leading-relaxed">
            Utilizamos cookies para análise de tráfego e rastreamento de conversões. Seus dados
            são tratados conforme a{' '}
            <a
              href="/politica-de-privacidade"
              className="underline hover:text-[#D4AF37] transition-colors"
            >
              Política de Privacidade
            </a>{' '}
            em conformidade com a LGPD.
          </p>
        </div>

        <div className="flex gap-3 shrink-0">
          <button
            onClick={reject}
            className="px-4 py-2 text-sm border border-gray-200 text-[#4A3F35] rounded-lg hover:border-[#D4AF37] transition-colors"
          >
            Rejeitar
          </button>
          <button
            onClick={accept}
            className="px-4 py-2 text-sm bg-[#D4AF37] hover:bg-[#B8952E] text-white rounded-lg font-medium transition-colors"
          >
            Aceitar cookies
          </button>
        </div>

        {/* Botão fechar (mobile) */}
        <button
          onClick={reject}
          aria-label="Fechar aviso de cookies"
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 md:hidden"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
