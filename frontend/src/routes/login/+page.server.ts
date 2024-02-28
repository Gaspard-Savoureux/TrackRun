import { redirect, fail } from '@sveltejs/kit';
import type { RequestEvent } from '../$types';
import { API_URL } from '../../constants';

export const actions: object = {
  login: async ({ cookies, fetch, request }: RequestEvent) => {
    const data = await request.formData();
    const username = data.get('username');
    const password = data.get('password');

    if (!username) return fail(400, {
      success: false,
      message: 'Please enter a username',
      username,
    });

    if (!password) return fail(400, {
      success: false,
      message: 'Please enter a password',
      username,
    });

    const res = await fetch(`${API_URL}/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (res.status === 400 || res.status === 401) return fail(res.status, {
      success: false,
      message: 'Your credentials are invalid',
      username,
    });

    if (res.ok) {
      const resData = await res.json();

      cookies.set('token', resData.token, {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        // secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60, // 1h
      });

      redirect(302, '/');
    }

    return fail(500, {
      success: false,
      message: 'Internal server error',
      username,
    });
  },
};
