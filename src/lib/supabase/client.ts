import { createClient } from "@supabase/supabase-js";

/**
 * Single Supabase client instance — Postgres + Storage only, no Auth
 * (see docs/DATABASE.md). This module is imported ONLY by feature
 * `api/*.ts` files, never directly by components or hooks.
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
