# Cloudflare Edge compatibility

This rescue branch removes Next.js ISR from the Edge Runtime blog endpoints. Published posts are generated at build time from the public `contents` read policy; a new build refreshes the blog snapshot. The main branch is unchanged.