/* Technology Polymath — invitation-only Supabase auth and progress */
(() => {
  "use strict";
  const cfg = window.TP_SUPABASE_CONFIG || {};
  const invitedViaLink = /(?:[?#&])type=(?:invite|recovery)(?:&|$)/.test(location.href);
  const authBox = document.getElementById("tp-auth");
  const msg = document.getElementById("tp-auth-error");
  const hint = document.getElementById("tp-auth-hint");
  const loginForm = document.getElementById("tp-login");
  const setup = document.getElementById("tp-set-password");
  const label = document.getElementById("savedLabel");
  const oldKey = "technology-polymath-v1";
  const empty = () => ({ done: {}, quiz: {}, checks: {}, cards: {} });
  let client, currentUser = null, timer = null, loading = false, changesWhileLoading = false;
  const say = (s) => { msg.textContent = s || ""; };
  const setLabel = (s) => { label.textContent = s; };
  const sanitize = (obj) => {
    if (!obj || typeof obj !== "object" || Array.isArray(obj)) return empty();
    return { ...empty(), ...obj };
  };
  const configured = /^https:\/\/[^/]+\.supabase\.co\/?$/.test(cfg.url || "") && !!cfg.anonKey;
  if (!configured || !window.supabase) {
    // While unconfigured, keep the original book usable in local-only mode.
    // This is not authenticated access: GitHub Pages serves public lesson content.
    document.documentElement.classList.add("tp-authorized");
    setLabel("Local progress only — cloud sync not configured");
    console.info("Technology Polymath: Supabase not configured; local-only mode.");
    return;
  }
  client = window.supabase.createClient(cfg.url, cfg.anonKey, {
    auth: { autoRefreshToken: true, persistSession: true, detectSessionInUrl: true }
  });
  const currentId = () => currentUser?.id;
  async function writeProgress(userId, snapshot) {
    const { error } = await client.from("learning_progress")
      .upsert({ user_id: userId, progress: snapshot, updated_at: new Date().toISOString() },
        { onConflict: "user_id" });
    if (error) throw error;
  }
  function queueSync() {
    if (!currentUser) return;
    if (loading) { changesWhileLoading = true; return; }
    clearTimeout(timer);
    const id = currentId();
    timer = setTimeout(async () => {
      if (!currentUser || currentId() !== id) return;
      try {
        const snapshot = structuredClone(window.state || state);
        await writeProgress(id, snapshot);
        if (currentId() === id) setLabel("Synced to your account");
      } catch (e) {
        if (currentId() === id) { setLabel("Not synced — export a backup"); say("Progress could not sync: " + e.message); }
      }
    }, 900);
  }
  window.tpQueueSync = queueSync;
  function signedOut() {
    clearTimeout(timer);
    timer = null;
    currentUser = null;
    document.documentElement.classList.remove("tp-authorized");
    // Never show a previous user's state to the next user on this device.
    state = empty();
    localStorage.removeItem(oldKey);
    setup.hidden = true; loginForm.hidden = false;
    document.getElementById("tp-account")?.remove();
    setLabel("Sign in to sync");
  }
  async function enter(user) {
    if (!user) { signedOut(); return; }
    if (currentId() === user.id && document.documentElement.classList.contains("tp-authorized")) return;
    clearTimeout(timer);
    currentUser = user;
    loading = true;
    say("");
    let localCopy = sanitize(state);
    try {
      const { data, error } = await client.from("learning_progress")
        .select("progress").eq("user_id", user.id).maybeSingle();
      if (error) throw error;
      if (data) {
        state = sanitize(data.progress);
        localStorage.setItem(oldKey, JSON.stringify(state));
        setLabel("Loaded cloud progress");
      } else {
        // One-time migration from the pre-auth book, by explicit user consent.
        const hasLocal = Object.values(localCopy).some(v => v && typeof v === "object" && Object.keys(v).length);
        if (hasLocal && !localStorage.getItem("tp-cloud-ever-used") && confirm("Import the original, pre-account progress stored in this browser into this account? Choose Cancel to start fresh.")) {
          state = localCopy;
        } else {
          state = empty();
        }
        await writeProgress(user.id, state);
        localStorage.setItem(oldKey, JSON.stringify(state));
        setLabel("Synced to your account");
      }
      // Never offer an account's cached progress as a migration to another account.
      localStorage.setItem("tp-cloud-ever-used", "1");
      // Invitation and recovery links must finish password setup before entering.
      document.documentElement.classList.toggle("tp-authorized", !invitedViaLink);
      showDashboard();
      let account = document.createElement("div");
      account.id = "tp-account";
      account.style.cssText = "margin-top:8px;font-size:12px;color:#c9d9df;overflow-wrap:anywhere";
      account.textContent = user.email + " · ";
      let out = document.createElement("button");
      out.textContent = "Sign out";
      out.style.cssText = "padding:5px 8px;font-size:12px";
      out.onclick = async () => {
        clearTimeout(timer);
        try { await writeProgress(user.id, sanitize(state)); await client.auth.signOut(); signedOut(); }
        catch (e) { say(e.message); alert("Unable to safely sign out: " + e.message); }
      };
      account.appendChild(out);
      document.querySelector(".side .subtitle").after(account);
      if (invitedViaLink) {
        setup.hidden = false;
        loginForm.hidden = true;
        hint.textContent = "Set a password to finish activating your account.";
      }
    } catch (e) {
      document.documentElement.classList.remove("tp-authorized");
      say("Could not load your learning data: " + e.message + ". Refresh to retry.");
      setLabel("Sync unavailable");
    } finally {
      loading = false;
      if (changesWhileLoading) { changesWhileLoading = false; queueSync(); }
    }
  }
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    say("");
    const button = loginForm.querySelector("button");
    button.disabled = true;
    try {
      const { data, error } = await client.auth.signInWithPassword({
        email: document.getElementById("tp-email").value.trim(),
        password: document.getElementById("tp-password").value
      });
      if (error) throw error;
      await enter(data.user);
    } catch (e) { say(e.message); }
    finally { button.disabled = false; }
  });
  document.getElementById("tp-save-password").addEventListener("click", async () => {
    const password = document.getElementById("tp-new-password").value;
    if (password.length < 8) { say("Use a password of at least 8 characters."); return; }
    try {
      const { error } = await client.auth.updateUser({ password });
      if (error) throw error;
      setup.hidden = true; loginForm.hidden = false;
      document.documentElement.classList.add("tp-authorized");
      showDashboard();
      say("");
      hint.textContent = "Password set. Your account is ready.";
      history.replaceState({}, "", location.pathname);
    } catch (e) { say(e.message); }
  });
  client.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_OUT") { signedOut(); return; }
    if (event === "PASSWORD_RECOVERY") {
      setup.hidden = false; loginForm.hidden = true;
      hint.textContent = "Choose a new password.";
    }
    if (session?.user) {
      // Defer database operations outside the auth callback to avoid auth lock deadlocks.
      setTimeout(() => enter(session.user), 0);
    }
  });
  client.auth.getSession().then(({ data, error }) => {
    if (error) say(error.message);
    else if (data.session?.user) enter(data.session.user);
  });
})();
