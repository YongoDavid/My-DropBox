import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Error handling for Supabase client initialization
if (!supabase) {
  throw new Error('Failed to initialize Supabase client');
}

// Test connection
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT') {
    console.error('Supabase connection lost');
  }
});

export const testConnection = async () => {
  try {
    const { error } = await supabase.from('test').select('*').limit(1);
    if (error) throw error;
    console.log('Supabase connection successful');
  } catch (error) {
    console.error('Supabase connection error:', error.message);
    throw new Error('Failed to connect to Supabase');
  }
};