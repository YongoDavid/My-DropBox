import { createClient } from '@supabase/supabase-js'

// const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
// const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

const supabaseUrl = "https://dvfkypgoadzkjukinmbn.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2Zmt5cGdvYWR6a2p1a2lubWJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUxODQzMzcsImV4cCI6MjA1MDc2MDMzN30.ouEJUUnOIDU01CQi6huOFjedgGnoeShkh2yEh4kzs5I";

export const supabase = createClient(supabaseUrl, supabaseAnonKey)