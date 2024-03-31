import type { PageLoad } from './$types';
import { API_URL } from '../../constants';


export const load: PageLoad = async ({ fetch }) => {
  try {
    const res = await fetch(`${API_URL}/user`, {
      credentials: 'include',
    });
    const user = await res.json();
    user.img = user.img ? `${API_URL}/uploads/${user.img}` : null;
    return {
      user,
    
    };
  } catch (error: unknown) { console.log(error); }
};
