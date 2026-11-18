'use client';

import { useState, useEffect } from 'react';
import { Shield, X, Settings2 } from 'lucide-react';

const CONSENT_KEY = 'rubia_cookie_consent';
type ConsentState = 'accepted' | 'rejected' | null;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    __rubiaLoadClarity?: () => void;
  }
}

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
    let stored: ConsentState = null;
    try {
      const value = localStorage.getItem(CONSENT_KEY);
      stored = value === 'accepted' || value === 'rejected' ? value : null;
    } catch {
      stored = null;
    }

    if (stored) {
      setConsent(stored);
      updateGoogleConsent(stored);
      if (stored === 'accepted') window.__rubiaLoadClarity?.();
      return;
    }

    const timer = window.setTimeout(() => setVisible(true), 1000);
    return () => window.clearTimeout(timer);
  }, []);

  function accept() {
    try { localStorage.setItem(CONSENT_KEY, 'accepted'); } catch { /* keep consent in memory */ }
    setConsent('accepted');
    updateGoogleConsent('accepted');
    setVisible(false);
    window.__rubiaLoadClarity?.();
  }

  function reject() {
    const wasAccepted = consent === 'accepted';
    try { localStorage.setItem(CONSENT_KEY, 'rejected'); } catch { /* keep consent in memory */ }
    setConsent('rejected');
    updateGoogleConsent('rejected');
    setVisible(false);
    // Recarrega para encerrar scripts de análise que já tenham sido carregados.
    if (wasAccepted) window.location.reload();
  }

  return (
    <>
      {consent !== null && !visible && (
        <button
          type="button"
          onClick={() => setVisible(true)}
          className="fixed bottom-3 right-3 z-40 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-white/95 px-3 py-2 text-xs text-[#4A3F35] shadow-lg backdrop-blur hover:border-[#D4AF37]"
          aria-label="Abrir preferências de cookies"
        >
          <Settings2 className="h-3.5 w-3.5" />
          Preferências de cookies
        </button>
      )}

      {visible && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Preferências de cookies"
          className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#D4AF37]/20 bg-white p-4 shadow-2xl md:p-6"
        >
          <div className="mx-auto flex max-w-5xl flex-col items-start gap-4 md:flex-row md:items-center">
            <Shield className="mt-0.5 hidden h-5 w-5 shrink-0 text-[#D4AF37] md:block" />

            <div className="flex-1 pr-6 md:pr-0">
              <p className="mb-1 text-sm font-medium text-[#1A1A1A]">
                Usamos cookies para melhorar sua experiência
              </p>
              <p className="text-xs leading-relaxed text-[#4A3F35]">
                Cookies necessários mantêm o site funcionando. Com sua autorização, usamos ferramentas
                de análise para medir visitas e melhorar os formulários. Você pode alterar sua escolha
                em Preferências de cookies. Consulte a{' '}
                <a href="/politica-de-privacidade" className="underline hover:text-[#D4AF37]">
                  Política de Privacidade
                </a>.
              </p>
            </div>

            <div className="flex shrink-0 gap-3">
              <button
                type="button"
                onClick={reject}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-[#4A3F35] transition-colors hover:border-[#D4AF37]"
              >
                Rejeitar
              </button>
              <button
                type="button"
                onClick={accept}
                className="rounded-lg bg-[#D4AF37] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#B8952E]"
              >
                Aceitar cookies
              </button>
            </div>

            <button
              type="button"
              onClick={reject}
              aria-label="Fechar aviso de cookies e rejeitar análise"
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 md:hidden"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
