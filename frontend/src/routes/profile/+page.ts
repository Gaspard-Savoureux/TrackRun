import type { PageLoad } from './$types';
import { API_URL } from '../../constants';

export const load: PageLoad = async ({ fetch }) => {
  try {
    const res = await fetch(`${API_URL}/user`, {
      credentials: 'include',
    });

    return {
      user: await res.json(),
      error: null, // DEBUG
      url: API_URL, // DEBUG
    };
  } catch (error: unknown) {
    console.log(error);
    return { error, url: API_URL };
  }
};
