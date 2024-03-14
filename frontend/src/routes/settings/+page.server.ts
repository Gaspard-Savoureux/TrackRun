import type { PageServerLoad } from './$types';
import { API_URL } from '../../constants';
import type { User } from '$lib/types/user';


export const load: PageServerLoad = async ({ fetch, locals }) => {
  const res = await fetch(`${API_URL}/user`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${locals.token}` },
  });

  const user: User = await res.json();
  return { user };
};