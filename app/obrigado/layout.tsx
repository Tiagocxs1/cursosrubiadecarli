import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { absolute: 'Obrigado | Dra. Rúbia De Carli' },
  alternates: { canonical: 'https://cursos.rubiadecarli.com.br/obrigado' },
  robots: {
    index: false,
    follow: false,
  },
};

export default function ObrigadoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
