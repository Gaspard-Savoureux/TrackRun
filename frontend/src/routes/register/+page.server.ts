import { redirect, fail } from '@sveltejs/kit';
import type { RequestEvent } from '../$types';
import { API_URL } from '../../constants';

export const actions: object = {
  register: async ({ cookies, fetch, request }: RequestEvent) => {
    const data = await request.formData();
    const username = data.get('username');
    const email = data.get('email');
    const password = data.get('password');
    const lastname = data.get('lastname');
    const firstname = data.get('firstname');
    const birthdate = data.get('birthdate');

    
    if (!username || !email || !password || !lastname || !firstname || !birthdate) {
      return fail(400, {
        success: false,
        message: 'All fields are required',
      });
    }

    const name = `${firstname} ${lastname}`;
   
    const res = await fetch(`${API_URL}/user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        password,
        email,
        name,
        // birthdate,
      }),
    });

    if (res.status === 400) {
      const resData = await res.json();
      return fail(res.status, {
        success: false,
        message: resData.message || 'Error during registration',
      });
    }

    if (res.ok) {
      const resData = await res.json();

      cookies.set('token', resData.token, {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, 
      });

      return redirect(302, '/login'); 
    }

    return fail(500, {
      success: false,
      message: 'Internal server error',
    });
  },
};

