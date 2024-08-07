// supabaseClient.ts
import { createClient } from '@supabase/supabase-js';
const SUPABASE_URL = 'https://ikqijayghnkpfrwsjaji.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlrcWlqYXlnaG5rcGZyd3NqYWppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjA0NDQ2MDIsImV4cCI6MjAzNjAyMDYwMn0.RseAuJbInYGnayW4No3D5QAz54RwTeIYltWcfC44jXk';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
export default supabase;
