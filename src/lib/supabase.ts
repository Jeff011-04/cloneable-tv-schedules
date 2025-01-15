import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lavdsrlybprnxnheffgl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhdmRzcmx5YnBybnhuaGVmZmdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY5MjQ2OTUsImV4cCI6MjA1MjUwMDY5NX0.LWCOI7w8-PwnH8rJy93fKa0C4OEumE_J9X5V2jZvWlI';

export const supabase = createClient(supabaseUrl, supabaseKey);