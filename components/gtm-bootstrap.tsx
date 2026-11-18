import Script from 'next/script';

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? '';

const CONSENT_DEFAULT = [
  'window.dataLayer = window.dataLayer || [];',
  'window.gtag = window.gtag || function(){ window.dataLayer.push(arguments); };',
  "window.gtag('consent', 'default', {",
  "  analytics_storage: 'denied',",
  "  ad_storage: 'denied',",
  "  ad_user_data: 'denied',",
  "  ad_personalization: 'denied',",
  '  wait_for_update: 500',
  '});',
].join('\n');

const GTM_BOOTSTRAP = [
  '(function(w,d,s,l,i){',
  '  w[l]=w[l]||[];',
  "  w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});",
  "  var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';",
  '  j.async=true;',
  "  j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;",
  '  f.parentNode.insertBefore(j,f);',
  "})(window,document,'script','dataLayer','" + GTM_ID + "');",
].join('\n');

/**
 * Carrega o Consent Mode e o Google Tag Manager no HTML inicial do servidor,
 * antes da hidratação do React/Next.js. Isso evita depender do primeiro ciclo
 * de hidratação para iniciar o dataLayer e solicitar o container.
 */
export default function GtmBootstrap() {
  if (!GTM_ID) return null;

  return (
    <>
      <Script id="rubia-consent-mode-default" strategy="beforeInteractive">
        {CONSENT_DEFAULT}
      </Script>
      <Script id="rubia-gtm-bootstrap" strategy="beforeInteractive">
        {GTM_BOOTSTRAP}
      </Script>
    </>
  );
}
