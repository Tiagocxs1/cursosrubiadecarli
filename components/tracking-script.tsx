'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef, Suspense } from 'react';
import { GA_MEASUREMENT_ID, GTM_ID } from '@/lib/tracking';

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

const analyticsLoader = GTM_ID
  ? [
      '  (function(w,d,s,l,i){',
      '    w[l]=w[l]||[];',
      "    w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});",
      "    var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';",
      '    j.async=true;',
      "    j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;",
      '    if (f && f.parentNode) f.parentNode.insertBefore(j,f); else d.head.appendChild(j);',
      "  })(window,document,'script','dataLayer','" + GTM_ID + "');",
    ]
  : GA_MEASUREMENT_ID
    ? [
        "  var gaScript=d.createElement('script');",
        '  gaScript.async=true;',
        "  gaScript.src='https://www.googletagmanager.com/gtag/js?id=" + GA_MEASUREMENT_ID + "';",
        '  d.head.appendChild(gaScript);',
        "  w.gtag('js',new Date());",
        "  w.gtag('config','" + GA_MEASUREMENT_ID + "',{send_page_view:true,anonymize_ip:true});",
      ]
    : [];

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
  '  if (window.__rubiaAnalyticsLoaded) return;',
  '  window.__rubiaAnalyticsLoaded = true;',
  ...analyticsLoader,
  '};',
].join('\n');

const consentRestore = [
  'try {',
  "  if (localStorage.getItem('rubia_cookie_consent') === 'accepted') {",
  '    window.__rubiaAnalyticsConsent = true;',
  "    window.gtag('consent', 'update', { analytics_storage: 'granted', ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted' });",
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

    const query = searchParams.toString();
    const pagePath = pathname + (query ? '?' + query : '');
    const pageData = {
      page_path: pagePath,
      page_location: window.location.href,
      page_title: document.title,
    };

    if (window.__rubiaAnalyticsLoaded && window.gtag && (GTM_ID || GA_MEASUREMENT_ID)) {
      window.gtag('event', 'page_view', pageData);
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
      <Script id="consent-mode-default" strategy="beforeInteractive">
        {consentModeDefault}
      </Script>
      {(hasGtm || hasGa4) && (
        <Script id="analytics-consent-restore" strategy="afterInteractive">
          {consentRestore}
        </Script>
      )}
      <Script id="clarity-consent-loader" strategy="afterInteractive">
        {clarityConsentLoader}
      </Script>
      <Suspense>
        <RouteTracker />
      </Suspense>
    </>
  );
}
