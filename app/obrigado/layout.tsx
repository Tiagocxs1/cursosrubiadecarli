import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Obrigado | Dra. Rúbia De Carli',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ObrigadoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
