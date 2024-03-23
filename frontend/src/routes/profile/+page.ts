import type { PageLoad } from './$types';
import { API_URL } from '../../constants';

export const load: PageLoad = async ({ fetch }) => {
  const res = await fetch(`${API_URL}/user`, {
    credentials: 'include',
  });

  return {
    user: await res.json(),
  };
};
