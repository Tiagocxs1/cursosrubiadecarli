# Cloudflare Pages rescue branch

- Blog detail routes are statically generated at build time; they do not use the Edge Runtime.
- Blog API and lead API are Edge Runtime routes.
- Published blog reads use the Supabase publishable key and the existing public read policy on `contents`.
- Customer writes do not use a fake service-role key. Lead submissions are forwarded to the TS Digitais central CRM form endpoint.
- Production domain: `cursos.rubiadecarli.com.br`.
- This temporary branch does not modify `main`.