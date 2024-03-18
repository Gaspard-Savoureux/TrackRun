import type { PageServerLoad, RequestEvent } from './$types';
import { API_URL } from '../../constants';
import type { User } from '$lib/types/user';
import { fail, redirect } from '@sveltejs/kit';


export const load: PageServerLoad = async ({ fetch, locals }) => {
  const res = await fetch(`${API_URL}/user`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${locals.token}` },
  });

  const user: User = await res.json();
  return { user };
};

export const actions: object = {
  user: async ({ locals, request }: RequestEvent) => {
    const data = await request.formData();

    const newUser: User = {
      username: data.get('username') as string || undefined,
      email: data.get('email') as string || undefined,
      name: data.get('name') as string || undefined,
      age: Number(data.get('age') as string) || undefined,
      height: Number(data.get('height') as string) || undefined,
      weight: Number(data.get('weight') as string) || undefined,
      sex: data.get('sex') as string || undefined,
      description: data.get('description') as string || undefined,
    };

    const res = await fetch(`${API_URL}/user`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${locals.token}`,
      },
      body: JSON.stringify(newUser),
    });

    if (res.ok) {
      return {
        success: true,
        message: 'User updated successfully',
      };
    }

    return fail(400, { success: false, message: 'An error occured'});
  },
  password: async ({ locals, request }: RequestEvent) => {
    const data = await request.formData();
    const password = data.get('password');
    const confirmPassword = data.get('confirm-password');

    if (!password || !confirmPassword) {
      return fail(400, { passwordSuccess: false, passwordMessage: 'Both fields are required' });
    }

    if (password !== confirmPassword) {
      return fail(400, { passwordSuccess: false, passwordMessage: 'Passwords do not match' });
    }

    const res = await fetch(`${API_URL}/user`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${locals.token}`,
      },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      return {
        passwordSuccess: true,
        passwordMessage: 'Password updated successfully',
      };
    }

    return fail(400, { passwordSuccess: false, passwordMessage: 'An error occured'});
  },
  delete: async ({ cookies, locals, request }: RequestEvent) => {
    const data = await request.formData();
    const confirmation = data.get('confirmation') as string;

    if (confirmation.toLowerCase() === 'yes, i agree') {
      const res = await fetch(`${API_URL}/user`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${locals.token}`,
        },
      });

      if (res.ok) {
        cookies.delete('token', {
          path: '/',
          secure: false,
        });

        return redirect(303, '/login');
      }
    }
  },
};
