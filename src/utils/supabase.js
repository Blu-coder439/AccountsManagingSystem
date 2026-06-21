import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

const getSupabaseUrlHost = () => {
  try {
    return supabaseUrl ? new URL(supabaseUrl).host : null;
  } catch {
    return 'invalid-url';
  }
};

const supabaseConfig = {
  isConfigured: Boolean(supabaseUrl && supabaseKey),
  urlHost: getSupabaseUrlHost(),
  keyType: supabaseKey?.startsWith('sb_publishable_')
    ? 'publishable'
    : supabaseKey?.startsWith('eyJ')
      ? 'jwt'
      : supabaseKey
        ? 'unknown'
        : null,
};

const getSupabaseConfigSummary = () => ({
  ...supabaseConfig,
  origin: typeof window !== 'undefined' ? window.location.origin : null,
});

const makeStub = (message) => {
  const rejected = (action) => () => Promise.reject(new Error(`${message} — attempted: ${action}`));

  return {
    from: () => ({
      select: rejected('from().select'),
      insert: rejected('from().insert'),
      update: rejected('from().update'),
      delete: rejected('from().delete')
    }),
    auth: {
      signInWithPassword: rejected('auth.signInWithPassword'),
      signUp: rejected('auth.signUp'),
      signOut: rejected('auth.signOut'),
      getUser: rejected('auth.getUser'),
      getSession: rejected('auth.getSession'),
      onAuthStateChange: () => ({
        data: {
          subscription: {
            unsubscribe() {},
          },
        },
      }),
    },
    rpc: rejected('rpc')
  };
};

let supabase;

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    'Supabase not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in your .env (see .env.example)'
  );
  supabase = makeStub('Supabase not configured');
} else {
  supabase = createClient(supabaseUrl, supabaseKey);
}

export { supabase, getSupabaseConfigSummary };
