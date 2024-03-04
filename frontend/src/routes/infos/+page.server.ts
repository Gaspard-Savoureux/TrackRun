// import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, RequestEvent } from './$types';
import { API_URL } from '../../constants';

export type User = {
  username: string;
  password: string,
  age: number,
  height: number,
  weight: number,
  sex: string,
  description: 'Aucune description'
}

// export const actions: object = {
//   info: async ({ locals, cookies, fetch }: RequestEvent) => {
//     // const data = await request.formData();
//     // console.log(data);
//     // const username = data.get('username');
//     // const password = data.get('password');

//     // if (!username) return fail(400, {
//     //   success: false,
//     //   message: 'Please enter a username',
//     //   username,
//     // });

//     // if (!password) return fail(400, {
//     //   success: false,
//     //   message: 'Please enter a password',
//     //   username,
//     // });

//     const res = await fetch(`${API_URL}/user`, {
//       method: 'GET',
//       headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${locals.token}`},
//     });


//     // if (res.status === 400 || res.status === 401) return fail(res.status, {
//     //   success: false,
//     //   message: 'Your credentials are invalid',
//     //   username,
//     // });

//     if (res.ok) {
//       const resData = await res.json();
//       console.log(resData);
//       const user = data.get('user');

//       cookies.set('token', resData.token, {
//         path: '/',
//         httpOnly: true,
//         sameSite: 'strict',
//         // secure: process.env.NODE_ENV === 'production',
//         maxAge: 60 * 60, // 1h
//       });

//       redirect(302, '/');
//     }

//     return fail(500, {
//       success: false,
//       message: 'Internal server error',
//       username,
//     });
//   },
// };

export const load: PageServerLoad = async ({ fetch, locals }) => {
  try {
    const res = await fetch(`${API_URL}/user`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${locals.token}`,
      },
    });

    const user: User = await res.json();
    console.log(user);
    return { user };
  } catch (error) {
    console.log(error);
  } 
};
