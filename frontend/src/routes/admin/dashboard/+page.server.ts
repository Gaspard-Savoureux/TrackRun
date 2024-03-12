import type { PageServerLoad, RequestEvent } from './$types';
import { API_URL } from '../../../constants';
import type { Trainer } from '$lib/types/trainer';
import { fail, redirect } from '@sveltejs/kit';


export const load: PageServerLoad = async ({ fetch, locals }) => {
  if (!locals.basicAuth) redirect(302, '/admin');
  const res = await fetch(`${API_URL}/admin/trainers`, {
    method: 'GET',
    headers: { Authorization: `${locals.basicAuth}` },
  });

  if (!res.ok) {
    throw new Error(`HTTP error! Status: ${await res.status}}`);
  }

  // const resData = await res.json();
  // console.log(await res.json());
  const trainers: Trainer[] = await res.json();
  return { trainers };
};


// export const actions: object = {
//   default: async ({ cookies, fetch, request }: RequestEvent) => {
//     const data = await request.formData();
//     const username = data.get('username');
//     const password = data.get('password');

//     if (!username) return fail(400, {
//       success: false,
//       message: 'Please enter a username',
//       username,
//     });

//     if (!password) return fail(400, {
//       success: false,
//       message: 'Please enter a password',
//       username,
//     });

//     const encodedCredentials = btoa(`${username}:${password}`);
//     const res = await fetch(`${API_URL}/admin`, {
//       method: 'GET',
//       headers: { Authorization: `Basic ${encodedCredentials}` },
//     });

//     if (res.status === 400 || res.status === 401) return fail(res.status, {
//       success: false,
//       message: 'Your credentials are invalid',
//       username,
//     });

//     if (res.ok) {
//       cookies.set('basicAuth', `Basic ${encodedCredentials}`, {
//         path: '/',
//         httpOnly: true,
//         sameSite: 'strict',
//         // secure: process.env.NODE_ENV === 'production',
//         maxAge: 60 * 60, // 1h
//       });
//       redirect(302, '/admin/dashboard');
//     }

//     return fail(500, {
//       success: false,
//       message: 'Internal server error',
//       username,
//     });
//   },
// };

