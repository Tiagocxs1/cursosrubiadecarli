/**
 * Componente genérico para injetar JSON-LD em qualquer página.
 * Usar em layouts e pages (Server Components).
 *
 * @example
 * import JsonLd from '@/components/json-ld'
 * import { buildOrganizationSchema } from '@/lib/schema'
 *
 * // Schema único
 * <JsonLd schema={buildOrganizationSchema()} />
 *
 * // Múltiplos schemas de uma vez
 * <JsonLd schema={[buildOrganizationSchema(), buildPersonSchema()]} />
 */
export default function JsonLd({
  schema,
}: {
  schema: Record<string, unknown> | Record<string, unknown>[];
}) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
