# Cloudflare Pages rescue

Temporary deployment branch for the courses site while the Vercel team is blocked from creating deployments.

- The public blog API and post page use the Edge Runtime for Cloudflare Pages.
- Lead submissions are forwarded to the TS Digitais central CRM form endpoint.
- The direct SMTP notification was disabled in this rescue branch because Nodemailer requires a Node runtime; the central CRM remains the lead destination.
- Supabase uses the public publishable key. Public reads of published content are allowed by the existing RLS policy; customer-table writes remain subject to RLS and are not granted service-role privileges.

This branch is a temporary hosting fallback. The main branch remains unchanged.