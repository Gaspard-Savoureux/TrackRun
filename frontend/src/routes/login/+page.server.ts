import { redirect, fail } from '@sveltejs/kit';
import type { RequestEvent } from '../$types';
import { BACKEND_PORT, BACKEND_URL } from '$env/static/private';

export const actions: object = {
  login: async ({ cookies, fetch, request }: RequestEvent) => {
    const data = await request.formData();
    const username = data.get('username');
    const password = data.get('password');

    if (!username) return fail(400, {
      success: false,
      message: 'Missing username',
      username,
    });

    if (!password) return fail(400, {
      success: false,
      message: 'Missing password',
      username,
    });

    // TODO test password length/validity

    const res = await fetch(`${BACKEND_URL}:${BACKEND_PORT}/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (res.status === 401) return fail(401, {
      success: false,
      message: 'Invalid credentials',
      username,
    });

    if (res.ok) {
      const resData = await res.json();

      cookies.set('token', resData.token, {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        // process.env.NODE_ENV === 'production',
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
