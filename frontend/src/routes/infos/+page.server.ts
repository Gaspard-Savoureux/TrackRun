// import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { API_URL } from '../../constants';

export type User = {
  username: string;
  email: string;
  age: number,
  height: number,
  weight: number,
  sex: string,
  description: string
}

export const load: PageServerLoad = async ({ fetch, locals }) => {
  const res = await fetch(`${API_URL}/user`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${locals.token}`,
    },
  });

  const user: User = await res.json();
  return { user };
};
