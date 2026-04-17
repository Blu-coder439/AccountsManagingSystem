import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

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
      signIn: rejected('auth.signIn'),
      signOut: rejected('auth.signOut'),
      getUser: () => null
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

export { supabase };
