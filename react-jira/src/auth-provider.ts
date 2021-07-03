import { User } from 'screens/project-list/search-panel';

const apiUrl = process.env.REACT_APP_API_URL;

const localStorageKey = '__auth_provider_token__';

export function getToken() {
  window.localStorage.getItem(localStorageKey);
}

function handleUserResponse({ user }: { user: User }) {
  window.localStorage.setItem(localStorageKey, user.token || '');
  return user;
}

export function login(data: { username: string; password: string }) {
  return fetch(`${apiUrl}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(async (response) => {
    if (response.ok) {
      return handleUserResponse(await response.json());
    }
    return Promise.reject();
  });
}

export function register(data: { username: string; password: string }) {
  return fetch(`${apiUrl}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(async (response) => {
    if (response.ok) {
      return handleUserResponse(await response.json());
    }
    return Promise.reject();
  });
}

export async function logout() {
  window.localStorage.removeItem(localStorageKey);
}
