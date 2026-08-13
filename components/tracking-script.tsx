'use client';

/**
 * TrackingScript
 * ---------------
 * Carrega GTM (preferencial) ou GA4 direto (fallback) com Google Consent Mode v2.
 * O consentimento padrão é NEGADO até o usuário aceitar via CookieBanner,
 * garantindo conformidade com LGPD e GDPR.
 *
 * Configuração via .env.local:
 *   NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX        ← preferencial (inclui GA4 via GTM)
 *   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXX ← fallback quando GTM não configurado
 */

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { GA_MEASUREMENT_ID } from '@/lib/tracking';

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? '';

function RouteTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({ event: 'pageview', page: url });
    }
  }, [pathname, searchParams]);

  return null;
}

export default function TrackingScript() {
  const hasGtm = Boolean(GTM_ID);
  const hasGa4 = Boolean(GA_MEASUREMENT_ID);

  if (!hasGtm && !hasGa4) return null;

  return (
    <>
      {/* Google Consent Mode v2 — carrega antes dos scripts de tracking */}
      {/* eslint-disable-next-line @next/next/no-before-interactive-script-outside-document */}
      <Script id="consent-mode-default" strategy="beforeInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            'analytics_storage': 'denied',
            'ad_storage': 'denied',
            'ad_user_data': 'denied',
            'ad_personalization': 'denied',
            'wait_for_update': 500,
          });
        `}
      </Script>

      {/* Google Tag Manager — recomendado, inclui GA4 e outros scripts via interface */}
      {hasGtm && (
        <>
          <Script id="gtm-init" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GTM_ID}');
            `}
          </Script>
          {/* noscript fallback — necessário para conformidade GTM */}
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        </>
      )}

      {/* GA4 direto — só carrega quando GTM não estiver configurado */}
      {!hasGtm && hasGa4 && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              gtag('config', '${GA_MEASUREMENT_ID}', {
                page_path: window.location.pathname,
                send_page_view: true,
                anonymize_ip: true,
              });
            `}
          </Script>
        </>
      )}

      {/* Microsoft Clarity - Session recording and heatmaps */}
      <Script id="microsoft-clarity" strategy="afterInteractive">
        {`
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "w66ija79qj");
        `}
      </Script>

      <Suspense>
        <RouteTracker />
      </Suspense>
    </>
  );
}
