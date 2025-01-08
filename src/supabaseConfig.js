import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://dvfkypgoadzkjukinmbn.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2Zmt5cGdvYWR6a2p1a2lubWJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUxODQzMzcsImV4cCI6MjA1MDc2MDMzN30.ouEJUUnOIDU01CQi6huOFjedgGnoeShkh2yEh4kzs5I";

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