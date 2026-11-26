# Cursos Dra. Rúbia De Carli — Astro

Esta versão Astro reutiliza os componentes React, o CSS Tailwind e os assets da implementação Next original. O código Next original e a branch de produção permanecem intactos.

## Desenvolvimento

```bash
npm ci
npm run dev
```

## Build

```bash
npm run build
```

Saída estática em `dist/`. Cloudflare Pages executa as funções da pasta `functions/` na raiz do projeto.

## Variáveis Cloudflare Pages

Configure em Preview e Production:
- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_ORGANIZATION_ID=CURSOS_RUBIA`
- `NODE_VERSION=24.11.1`

O GA4 público do site é `G-82N4KS233X`. O Consent Mode começa com analytics e advertising negados. O GA4 e o Clarity só carregam após aceite. GTM permanece desativado, conforme a configuração anterior.

O endpoint de formulários encaminha os leads para o CRM central; o espelho opcional no Supabase só usa a chave de serviço se ela for configurada como secret no Cloudflare. Nenhuma credencial privada deve ser colocada no Git.
