import type { PageServerLoad } from './$types';
import { API_URL } from '../../../constants';
import type { User } from '$lib/types/user';
import type { Trainer } from '$lib/types/trainer';


export const load: PageServerLoad = async ({ fetch, locals }) => {
  const res = await fetch(`${API_URL}/admin/trainers`, {
    method: 'GET',
    headers: { Authorization: `${locals.basicAuth}` },
  });

  if (!res.ok) {
    throw new Error(`HTTP error! Status: ${res.status}`);
  }
  // const resData = await res.json();
  // console.log(await res.json());
  const trainers: Trainer[] = await res.json();
  return { trainers };
};

