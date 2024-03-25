import type { PageLoad } from './$types';
import { API_URL } from '../../constants';

export const load: PageLoad = async ({ fetch }) => {
  // try {
  const res = await fetch(`${API_URL}/user`, {
    credentials: 'include',
  });

  // if (res.ok) {
  return {
    user: await res.json(),
  };
  //   }
  // } catch (error: unknown) {

  // }
};
