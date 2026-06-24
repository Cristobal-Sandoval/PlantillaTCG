import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://satlrnugppdesfauxzrw.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhdGxybnVncHBkZXNmYXV4enJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwMzE0NDQsImV4cCI6MjA5NjYwNzQ0NH0.L2g1dhmNJfwg7_UjcX7642JSu6umvrFTbCyRltlleZs'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
