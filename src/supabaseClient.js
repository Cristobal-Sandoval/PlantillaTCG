import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://TU_PROYECTO_SUPABASE.supabase.co'
const supabaseAnonKey = 'TU_CLAVE_ANONIMA_DE_SUPABASE'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
