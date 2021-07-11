import qs from 'qs';
import * as auth from 'auth-provider';
import { useAuth } from 'context/auth-context';
import { useCallback } from 'react';

const apiUrl = process.env.REACT_APP_API_URL;

interface Config extends RequestInit {
  token?: string;
  data?: object;
}

export function http(endpoint: string, { data, token, headers, ...customConfig }: Config = {}) {
  const config = {
    method: 'GET',
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': data ? 'application/json' : '',
      ...headers,
    },
    ...customConfig,
  };
  if (config.method.toUpperCase() === 'GET') {
    endpoint += `?${qs.stringify(data)}`;
  } else {
    config.body = JSON.stringify(data || {});
  }
  return window.fetch(`${apiUrl}/${endpoint}`, config).then(async (response) => {
    if (response.status === 401) {
      await auth.logout();
      window.location.reload();
      return Promise.reject('请重新登录');
    }
    const data = await response.json();
    return response.ok ? data : Promise.reject(data);
  });
}

export function useHttp() {
  const { user } = useAuth();
  return useCallback(
    (...[enpoint, config]: Parameters<typeof http>) => http(enpoint, { ...config, token: user?.token }),
    [user?.token]
  );
}
