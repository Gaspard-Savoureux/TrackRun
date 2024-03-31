import type { PageLoad } from './$types';
import { API_URL } from '../../../constants';

export const load: PageLoad = async ({ fetch }) => {
  try {
    const res = await fetch(`${API_URL}/trainer/users`, {
      credentials: 'include',
    });

    const { users } = await res.json();
    return {
      users,
    };
    // eslint-disable-next-line no-empty
  } catch (error: unknown) { console.log(error); }
};
