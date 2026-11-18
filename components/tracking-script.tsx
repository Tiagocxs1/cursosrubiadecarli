'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef, Suspense } from 'react';
import { GA_MEASUREMENT_ID } from '@/lib/tracking';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    __rubiaLoadAnalytics?: () => void;
    __rubiaAnalyticsLoaded?: boolean;
    __rubiaAnalyticsConsent?: boolean;
    __rubiaLoadClarity?: () => void;
    __rubiaClarityLoaded?: boolean;
  }
}

const consentModeDefault = [
  'window.dataLayer = window.dataLayer || [];',
  'window.gtag = window.gtag || function(){ window.dataLayer.push(arguments); };',
  "window.gtag('consent', 'default', {",
  "  analytics_storage: 'denied',",
  "  ad_storage: 'denied',",
  "  ad_user_data: 'denied',",
  "  ad_personalization: 'denied',",
  '  wait_for_update: 500',
  '});',
  'window.__rubiaLoadAnalytics = function(){',
  '  if (window.__rubiaAnalyticsLoaded || !' + JSON.stringify(GA_MEASUREMENT_ID) + ') return;',
  '  window.__rubiaAnalyticsLoaded = true;',
  "  var gaScript = document.createElement('script');",
  '  gaScript.async = true;',
  "  gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=" + GA_MEASUREMENT_ID + "';",
  '  gaScript.onload = function(){',
  "    window.gtag('js', new Date());",
  "    window.gtag('config', '" + GA_MEASUREMENT_ID + "', { send_page_view: true, anonymize_ip: true });",
  '  };',
  '  gaScript.onerror = function(){ window.__rubiaAnalyticsLoaded = false; };',
  '  document.head.appendChild(gaScript);',
  '};',
].join('\n');

const consentRestore = [
  'try {',
  "  if (localStorage.getItem('rubia_cookie_consent') === 'accepted') {",
  '    window.__rubiaAnalyticsConsent = true;',
  "    window.gtag('consent', 'update', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });",
  '    window.__rubiaLoadAnalytics?.();',
  '  }',
  '} catch (e) {}',
].join('\n');

const clarityConsentLoader = [
  '(function(w,d){',
  '  w.__rubiaLoadClarity = function(){',
  '    try {',
  "      if (localStorage.getItem('rubia_cookie_consent') !== 'accepted' || w.__rubiaClarityLoaded) return;",
  '      w.__rubiaClarityLoaded = true;',
  '      (function(c,l,a,r,i,t,y){',
  '        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};',
  "        t=l.createElement(r);t.async=1;t.src='https://www.clarity.ms/tag/'+i;",
  '        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);',
  "      })(w,d,'clarity','script','w66ija79qj');",
  '    } catch(e) {}',
  '  };',
  '  w.__rubiaLoadClarity();',
  '})(window,document);',
].join('\n');

function RouteTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isInitialPage = useRef(true);

  useEffect(() => {
    if (isInitialPage.current) {
      isInitialPage.current = false;
      return;
    }

    if (!window.__rubiaAnalyticsConsent || !window.__rubiaAnalyticsLoaded || !window.gtag) {
      return;
    }

    const query = searchParams.toString();
    const pagePath = pathname + (query ? '?' + query : '');
    window.gtag('event', 'page_view', {
      page_path: pagePath,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname, searchParams]);

  return null;
}

export default function TrackingScript() {
  if (!GA_MEASUREMENT_ID) return null;

  return (
    <>
      <Script id="consent-mode-default" strategy="beforeInteractive">
        {consentModeDefault}
      </Script>
      <Script id="analytics-consent-restore" strategy="afterInteractive">
        {consentRestore}
      </Script>
      <Script id="clarity-consent-loader" strategy="afterInteractive">
        {clarityConsentLoader}
      </Script>
      <Suspense fallback={null}>
        <RouteTracker />
      </Suspense>
    </>
  );
}
