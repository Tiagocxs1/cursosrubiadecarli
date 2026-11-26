import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  site: 'https://cursos.rubiadecarli.com.br',
  output: 'static',
  trailingSlash: 'always',
  integrations: [react()],
  vite: {
    resolve: {
      alias: [
        { find: /^@\//, replacement: resolve(root, 'legacy') + '/' },
        { find: 'next/link', replacement: resolve(root, 'src/compat/Link.tsx') },
        { find: 'next/image', replacement: resolve(root, 'src/compat/Image.tsx') },
        { find: 'next/navigation', replacement: resolve(root, 'src/compat/navigation.ts') },
      ],
    },
    define: {
      'process.env.NEXT_PUBLIC_APP_URL': JSON.stringify('https://cursos.rubiadecarli.com.br'),
      'process.env.NEXT_PUBLIC_SITE_URL': JSON.stringify('https://cursos.rubiadecarli.com.br'),
      'process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID': JSON.stringify('G-82N4KS233X'),
      'process.env.NEXT_PUBLIC_GTM_ID': JSON.stringify(''),
    },
  },
});
