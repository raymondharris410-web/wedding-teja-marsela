// =====================================================
// SUPABASE CLIENT MODULE
// =====================================================
// Lightweight Supabase client using REST API directly
// No npm/CDN dependency — pure vanilla JS
// =====================================================

window.SupabaseClient = (function() {
  let url = '';
  let key = '';
  let accessToken = null; // For authenticated admin sessions

  const init = () => {
    const cfg = window.WEDDING_CONFIG;
    if (!cfg || !cfg.SUPABASE_URL || !cfg.SUPABASE_ANON_KEY) {
      console.warn('[Supabase] Config not found. RSVP will use offline mode.');
      return false;
    }
    if (cfg.SUPABASE_URL.includes('YOUR_PROJECT_ID')) {
      console.warn('[Supabase] Using placeholder URL. RSVP will use offline mode.');
      return false;
    }
    url = cfg.SUPABASE_URL;
    key = cfg.SUPABASE_ANON_KEY;
    return true;
  };

  const isConfigured = () => {
    return url && key && !url.includes('YOUR_PROJECT_ID');
  };

  const headers = (useAuth = false) => {
    const h = {
      'apikey': key,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    };
    if (useAuth && accessToken) {
      h['Authorization'] = `Bearer ${accessToken}`;
    } else {
      h['Authorization'] = `Bearer ${key}`;
    }
    return h;
  };

  // ---- CRUD Operations ----

  const insert = async (table, data) => {
    const res = await fetch(`${url}/rest/v1/${table}`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Insert failed (${res.status})`);
    }
    return res.json();
  };

  const select = async (table, params = {}, useAuth = false) => {
    const query = new URLSearchParams();
    if (params.select) query.set('select', params.select);
    if (params.order) query.set('order', params.order);
    if (params.limit) query.set('limit', params.limit);
    if (params.offset) query.set('offset', params.offset);

    // Filters (eq, ilike, etc.)
    if (params.filters) {
      params.filters.forEach(f => {
        query.set(f.column, `${f.operator}.${f.value}`);
      });
    }

    const res = await fetch(`${url}/rest/v1/${table}?${query.toString()}`, {
      method: 'GET',
      headers: { ...headers(useAuth), 'Prefer': 'count=exact' }
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Select failed (${res.status})`);
    }

    const totalCount = res.headers.get('content-range');
    const data = await res.json();
    return { data, totalCount };
  };

  const remove = async (table, column, value) => {
    const res = await fetch(`${url}/rest/v1/${table}?${column}=eq.${value}`, {
      method: 'DELETE',
      headers: headers(true)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Delete failed (${res.status})`);
    }
    return true;
  };

  // ---- Auth Operations (for Admin Dashboard) ----

  const signIn = async (email, password) => {
    const res = await fetch(`${url}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'apikey': key,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error_description || err.msg || 'Login failed');
    }
    const data = await res.json();
    accessToken = data.access_token;
    sessionStorage.setItem('sb_access_token', accessToken);
    sessionStorage.setItem('sb_user_email', data.user?.email || email);
    return data;
  };

  const signOut = () => {
    accessToken = null;
    sessionStorage.removeItem('sb_access_token');
    sessionStorage.removeItem('sb_user_email');
  };

  const restoreSession = () => {
    const token = sessionStorage.getItem('sb_access_token');
    if (token) {
      accessToken = token;
      return true;
    }
    return false;
  };

  const isAuthenticated = () => !!accessToken;

  return {
    init,
    isConfigured,
    insert,
    select,
    remove,
    signIn,
    signOut,
    restoreSession,
    isAuthenticated
  };
})();
