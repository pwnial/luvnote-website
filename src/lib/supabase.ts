import { createClient, type Session } from "@supabase/supabase-js";

const productionSupabaseUrl = "https://fkfyhsbhsobxmiiidtrn.supabase.co";
const productionSupabaseProjectRef = "fkfyhsbhsobxmiiidtrn";
const productionSupabasePublishableKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrZnloc2Joc29ieG1paWlkdHJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2NDUyNDQsImV4cCI6MjA3NDIyMTI0NH0.kwn4lcEd4Xa5tA3p2rfnHhKn__6_GwkySNy5HDGfams";
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() || productionSupabaseUrl;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_KEY?.trim() || productionSupabasePublishableKey;
const legacyAuthStorageKey = `sb-${productionSupabaseProjectRef}-auth-token`;

function removePersistedRecoveryArtifacts() {
  if (typeof window === "undefined") return;

  const keys = [
    legacyAuthStorageKey,
    `${legacyAuthStorageKey}-code-verifier`,
    `${legacyAuthStorageKey}-user`,
  ];

  for (const storageName of ["localStorage", "sessionStorage"] as const) {
    try {
      const storage = window[storageName];
      for (const key of keys) {
        storage.removeItem(key);
      }
    } catch {
      // Accessing Storage itself can throw in privacy-restricted contexts.
      // The recovery client below is still memory-only in that case.
    }
  }
}

export function scrubPasswordRecoveryURL() {
  if (typeof window === "undefined" || window.location.pathname !== "/reset") return;
  window.history.replaceState({}, document.title, "/reset");
}

function hasRecoveryMarker(urlString: string) {
  if (!urlString) return false;
  try {
    const url = new URL(urlString);
    if (url.pathname !== "/reset") return false;
    const hash = new URLSearchParams(url.hash.replace(/^#/, ""));
    // This client intentionally uses Supabase's implicit recovery flow. A bare
    // query `code` belongs to PKCE and is not usable here without the verifier
    // stored by the browser that requested it. Do not show a false verifying
    // state for a credential shape this recovery-only client cannot consume.
    return hash.get("type") === "recovery"
      && hash.has("access_token")
      && hash.has("refresh_token");
  } catch {
    return false;
  }
}

// Capture only the recovery intent before the client initializes and consumes
// the URL fragment. Do not retain a second in-memory copy of its tokens. This
// marker only tells ResetPassword to wait; it never authorizes an update.
export const initialAuthRedirectHadRecoveryMarker = typeof window !== "undefined"
  && hasRecoveryMarker(window.location.href);

// Older website builds used Supabase's default localStorage persistence. Purge
// only that website auth key before creating the recovery-only client so a
// failed or abandoned reset from an older build cannot remain signed in.
removePersistedRecoveryArtifacts();

// This public website never has a signed-in product surface. Its Auth client is
// deliberately memory-only: recovery credentials must not survive a reload,
// tab close, invalid link, or sign-out network failure.
export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    autoRefreshToken: false,
    detectSessionInUrl: true,
    persistSession: false,
    flowType: "implicit",
  },
});

type PasswordRecoveryListener = (session: Session | null) => void;

let passwordRecoverySession: Session | null = null;
let passwordRecoveryEventPending = false;
const passwordRecoveryListeners = new Set<PasswordRecoveryListener>();

// This listener is installed beside the singleton client, before the lazy
// reset route is downloaded. That avoids losing Supabase's one-time
// PASSWORD_RECOVERY event while React is still loading the page component.
supabase.auth.onAuthStateChange((event, session) => {
  if (event !== "PASSWORD_RECOVERY") return;

  // Supabase has consumed the fragment by this point. Remove credentials from
  // browser history before any server verification or UI transition runs.
  scrubPasswordRecoveryURL();
  removePersistedRecoveryArtifacts();

  if (passwordRecoveryListeners.size > 0) {
    passwordRecoveryEventPending = false;
    passwordRecoverySession = null;
    passwordRecoveryListeners.forEach((listener) => listener(session));
  } else {
    // The reset route is lazy-loaded. Cache exactly one event until its first
    // subscriber arrives, then consume it rather than replaying it on revisit.
    passwordRecoveryEventPending = true;
    passwordRecoverySession = session;
  }
});

export function subscribeToPasswordRecovery(listener: PasswordRecoveryListener) {
  passwordRecoveryListeners.add(listener);
  if (passwordRecoveryEventPending) {
    const session = passwordRecoverySession;
    passwordRecoveryEventPending = false;
    passwordRecoverySession = null;
    queueMicrotask(() => {
      if (passwordRecoveryListeners.has(listener)) {
        listener(session);
      }
    });
  }
  return () => passwordRecoveryListeners.delete(listener);
}

export function clearPasswordRecoverySession() {
  passwordRecoveryEventPending = false;
  passwordRecoverySession = null;
  removePersistedRecoveryArtifacts();
}
