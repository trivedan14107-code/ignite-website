// Initialize Supabase Client
// Ensure you include the Supabase CDN script in your HTML files before this script runs:
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

const SUPABASE_URL = 'https://sxacowcjjnihbdmzlzkf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4YWNvd2Nqam5paGJkbXpsemtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1ODA1MjYsImV4cCI6MjA5MDE1NjUyNn0.r8vzS86ImsMaim1KElVij3Wx7f2fhaY7u82rv5_yLpE';

// Initialize the client
let supabaseClient;
try {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log("Supabase Client initialized successfully.");
} catch (error) {
    console.error("Failed to initialize Supabase:", error);
}

// Export the client for use in other files if using modules, otherwise it sits in global scope
window.supabaseClient = supabaseClient;
