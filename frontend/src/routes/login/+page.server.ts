import { redirect, type Action } from '@sveltejs/kit';
import type { RequestEvent } from '../$types';

export const actions = {
  default: async ({ cookies, request }: RequestEvent) => {
    const data = await request.formData();
    const email = data.get('email');
    const password = data.get('password');

    const res = await fetch('', {
      method: '',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        email,
        password,
      },
    }); // TODO fetch backend

    const resData = await res.json();

    // TODO handle errors with fetch

    cookies.set('token', resData.token, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      // secure: true, // process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30, // 1 month
    });
  
    redirect(302, '/'); // TODO change URL
  },
} satisfies Action;
