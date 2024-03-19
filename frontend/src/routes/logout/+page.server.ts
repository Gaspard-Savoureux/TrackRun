import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async ({ cookies }) => {

  cookies.delete('token', {
    path: '/',
    secure: false,
  });

  cookies.delete('in_sess', {
    path: '/',
    secure: false,
  });

  return redirect(303, '/login');
};
