const rawBaseUrl = import.meta.env.VITE_API_URL || '';

export const API_BASE_URL = rawBaseUrl.replace(/\/+$/, '');

export const apiUrl = (path) => `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
