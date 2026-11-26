import 'server-only';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;

/**
 * Cliente público (browser) — usa anon key, respeita RLS.
 * Seguro para usar em Client Components.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Cliente servidor — usa service role quando configurada; no Pages rescue
 * usa a chave pública como fallback e respeita as políticas RLS do Supabase.
 */
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
});
