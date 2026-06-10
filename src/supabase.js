import { createClient } from '@supabase/supabase-js'
const SUPABASE_URL = 'https://dzsiuxswngwuarwvgjiy.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_LqXyLehzunzQY5fCPIydRw_ThMykHNZ'
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
