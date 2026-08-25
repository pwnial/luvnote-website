import { createClient, type Session } from "@supabase/supabase-js";

const supabaseUrl = "https://fkfyhsbhsobxmiiidtrn.supabase.co";
const supabasePublishableKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrZnloc2Joc29ieG1paWlkdHJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2NDUyNDQsImV4cCI6MjA3NDIyMTI0NH0.kwn4lcEd4Xa5tA3p2rfnHhKn__6_GwkySNy5HDGfams";

function hasRecoveryMarker(urlString: string) {
  if (!urlString) return false;
  try {
    const url = new URL(urlString);
    const hash = new URLSearchParams(url.hash.replace(/^#/, ""));
    return hash.get("type") === "recovery"
      || url.searchParams.get("type") === "recovery"
      || url.searchParams.has("code");
  } catch {
    return false;
  }
}

// Capture only the recovery intent before the client initializes and consumes
// the URL fragment. Do not retain a second in-memory copy of its tokens. This
// marker only tells ResetPassword to wait; it never authorizes an update.
export const initialAuthRedirectHadRecoveryMarker = typeof window !== "undefined"
  && hasRecoveryMarker(window.location.href);

// Keep one auth client for the whole website. Creating a client in each route
// registers competing listeners against the same browser storage key.
export const supabase = createClient(supabaseUrl, supabasePublishableKey);

type PasswordRecoveryListener = (session: Session | null) => void;

let passwordRecoverySession: Session | null = null;
const passwordRecoveryListeners = new Set<PasswordRecoveryListener>();

// This listener is installed beside the singleton client, before the lazy
// reset route is downloaded. That avoids losing Supabase's one-time
// PASSWORD_RECOVERY event while React is still loading the page component.
supabase.auth.onAuthStateChange((event, session) => {
  if (event !== "PASSWORD_RECOVERY") return;
  passwordRecoverySession = session;
  passwordRecoveryListeners.forEach((listener) => listener(session));
});

export function subscribeToPasswordRecovery(listener: PasswordRecoveryListener) {
  passwordRecoveryListeners.add(listener);
  if (passwordRecoverySession) {
    queueMicrotask(() => {
      if (passwordRecoveryListeners.has(listener) && passwordRecoverySession) {
        listener(passwordRecoverySession);
      }
    });
  }
  return () => passwordRecoveryListeners.delete(listener);
}

export function clearPasswordRecoverySession() {
  passwordRecoverySession = null;
}
