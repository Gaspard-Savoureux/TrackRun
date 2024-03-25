import type { PageServerLoad } from './$types';
import { API_URL } from '../../../constants';

export const load: PageServerLoad = async ({ fetch }) => {
  const res = await fetch(`${API_URL}/trainer/users`, {
    credentials: 'include',
  });
  return {
    users: await res.json(),
  };
};
