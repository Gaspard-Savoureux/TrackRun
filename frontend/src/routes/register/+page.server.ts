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

    // Other validation to include...

    const res = await fetch(`${API_URL}/user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        email,
        password,
        lastname,
        firstname,
        birthdate,
      }),
    });

    if (res.status === 400) {
      const resData = await res.json(); // Assuming the server sends back a JSON with a message
      return fail(res.status, {
        success: false,
        message: resData.message || 'Error during registration',
      });
    }

    if (res.ok) {
      // Assuming the registration process might automatically log the user in and return a token
      const resData = await res.json();

      cookies.set('token', resData.token, {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        // secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });

      return redirect(302, '/login'); // Redirect to homepage or dashboard after successful registration
    }

    return fail(500, {
      success: false,
      message: 'Internal server error',
    });
  },
};
