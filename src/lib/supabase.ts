import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://fkfyhsbhsobxmiiidtrn.supabase.co";
const supabasePublishableKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrZnloc2Joc29ieG1paWlkdHJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2NDUyNDQsImV4cCI6MjA3NDIyMTI0NH0.kwn4lcEd4Xa5tA3p2rfnHhKn__6_GwkySNy5HDGfams";

// Keep one auth client for the whole website. Creating a client in each route
// registers competing listeners against the same browser storage key.
export const supabase = createClient(supabaseUrl, supabasePublishableKey);
