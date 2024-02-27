import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  return {
    message: (locals.token) ? 'you are logged in!' : 'you are not logged in!',
  };
};
