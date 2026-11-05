
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

// Refresh the expired access token
async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refreshToken');

  if (!refreshToken) {
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh: refreshToken,
      }),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    localStorage.setItem('accessToken', data.access);

    return data.access;
  } catch {
    return null;
  }
}

// Reusable API request function
export async function apiRequest(url, options = {}) {
  const accessToken = localStorage.getItem('accessToken');

  const headers = new Headers(options.headers || {});

  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  let response = await fetch(url, {
    ...options,
    headers,
  });

  // If access token expired, refresh it
  if (response.status === 401) {
    const newAccessToken = await refreshAccessToken();

    if (!newAccessToken) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');

      window.dispatchEvent(new Event('auth:logout'));

      return response;
    }

    // Retry original request with new access token
    const retryHeaders = new Headers(options.headers || {});

    retryHeaders.set(
      'Authorization',
      `Bearer ${newAccessToken}`
    );

    response = await fetch(url, {
      ...options,
      headers: retryHeaders,
    });
  }

  return response;
}
