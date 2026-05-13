import { apiUrl } from './api-base';
import { supabase } from './supabase';

const CURRENT_USER_STORAGE_KEY = 'currentUser';

export const clearCurrentUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
};

export const getCurrentUser = () => {
  const savedUser = localStorage.getItem(CURRENT_USER_STORAGE_KEY);

  if (!savedUser) {
    return null;
  }

  try {
    return JSON.parse(savedUser);
  } catch {
    clearCurrentUser();
    return null;
  }
};

export const setCurrentUser = (user) => {
  localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user));
  return user;
};

export const getAccessToken = async () => {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  return session?.access_token || null;
};

export const apiFetchWithAuth = async (path, init = {}) => {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    throw new Error('You must be signed in to continue.');
  }

  const headers = new Headers(init.headers || {});
  headers.set('Authorization', `Bearer ${accessToken}`);

  if (init.body && !headers.has('Content-Type') && !(init.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  return fetch(apiUrl(path), {
    ...init,
    headers,
  });
};

export const syncCurrentUserProfile = async (profileOverrides = {}, endpoint = '/api/auth/login') => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    clearCurrentUser();
    return null;
  }

  const response = await apiFetchWithAuth(endpoint, {
    method: 'POST',
    body: JSON.stringify(profileOverrides),
  });

  const data = await response.json();

  if (!response.ok) {
    const details = data.details?.message ? ` ${data.details.message}` : '';
    const code = data.details?.code ? ` [${data.details.code}]` : '';
    throw new Error(`${data.error || 'Could not sync account profile.'}${code}.${details}`.trim());
  }

  return setCurrentUser(data.user || data);
};

export const signOutCurrentUser = async () => {
  const { error } = await supabase.auth.signOut();
  clearCurrentUser();

  if (error) {
    throw error;
  }
};

export const initializeAuthSessionSync = () => {
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT' || !session) {
      clearCurrentUser();
      return;
    }

    if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
      setTimeout(() => {
        syncCurrentUserProfile().catch(() => {});
      }, 0);
    }
  });

  return data.subscription;
};
