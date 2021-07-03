import { User } from 'screens/project-list/search-panel';
import { http } from 'utils/http';

const localStorageKey = '__auth_provider_token__';

export function getToken() {
  return window.localStorage.getItem(localStorageKey);
}

function handleUserResponse({ user }: { user: User }) {
  window.localStorage.setItem(localStorageKey, user.token || '');
  return user;
}

export function login(data: { username: string; password: string }) {
  return http('login', { data, method: 'POST' }).then(handleUserResponse);
}

export function register(data: { username: string; password: string }) {
  return http('register', { data, method: 'POST' }).then(handleUserResponse);
}

export async function logout() {
  window.localStorage.removeItem(localStorageKey);
}
