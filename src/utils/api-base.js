const rawBaseUrl = import.meta.env.VITE_API_URL || '';

let API_BASE_URL = rawBaseUrl.replace(/\/+$/, '');

// If running in a browser over HTTPS, avoid calling an insecure localhost HTTP backend
if (typeof window !== 'undefined' && window.location.protocol === 'https:' && API_BASE_URL.startsWith('http:')) {
	API_BASE_URL = '';
}

export { API_BASE_URL };

export const apiUrl = (path) => `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
