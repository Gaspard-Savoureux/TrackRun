import type { PageServerLoad, RequestEvent } from './$types';
import { API_URL } from '../../constants';
import type { User } from '$lib/types/user';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ fetch, locals }) => {
  const res = await fetch(`${API_URL}/user`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${locals.token}` },
  });

  const user: User = await res.json();
  return { user };
};



const validateNewUser = (user: User) => {
  const { username, age, height, weight } = user;

  // Username
  if (!username) return 'What ? No username ? How are are you suppose to login if you do that?';

  // Age
  if (age !== null && age !== undefined) {
    if (age < 0) return 'How can your age be negative?';
    if (age === 0) return 'Invalid age: Just born yet ready to train? Impressive determination for a 0 year old.';
    if (age > 122) return 'Invalid age: The oldest human died at 122 years old. You should consider applying here: https://www.guinnessworldrecords.com/contact/application-enquiry';
  }

  // Height;
  if (height !== null && height !== undefined) {
    if (height < 0) return 'Invalid Height: Are you a hole?';
    if (height <= 30) return 'Invalid Height: Are you a gnome?';
    if (height > 280) return 'Invalid Height: Why aren\'t you playing basketball?';
  }

  // Weight
  if (weight !== null && weight !== undefined) {
    if (weight < 0) return 'Invalid Weight: Matching IQ and weight? That\'s a rare sight!';
    if (weight <= 20) return 'Invalid weight: I know our trainers are good, but not that good.';
    if (weight > 650) return 'Invalid Weight: You do know the weight is in kg right? If you do I\'m gonna have to be real with you chief. I don\'t think we can help.';
  }

  return '';
};






export const actions: object = {
  user: async ({ locals, request }: RequestEvent) => {
    const data = await request.formData();

    const ageInput = data.get('age') as string;
    const heightInput = data.get('height') as string;
    const weightInput = data.get('weight') as string;

    const age = ageInput !== undefined && ageInput !== '' ? Number(ageInput) : null;
    const height = heightInput !== undefined && heightInput !== '' ? Number(heightInput) : null;
    const weight = weightInput !== undefined && weightInput !== '' ? Number(weightInput) : null;

    const newUser: User = {
      username: data.get('username') as string || undefined,
      email: data.get('email') as string,
      name: data.get('name') as string,
      age,
      height,
      weight,
      sex: data.get('sex') as string || null,
      img: data.get('img') as string || null,
      description: data.get('description') as string || null,
    };

    // Validation of newUser
    const errorMsg = validateNewUser(newUser);
    if (errorMsg !== '') return fail(400, {success: false, message: errorMsg});

    const res = await fetch(`${API_URL}/user`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${locals.token}`,
      },
      body: JSON.stringify(newUser),
    });

    if (res.ok) {
      return {
        success: true,
        message: 'User updated successfully',
      };
    }

    return fail(400, { success: false, message: 'An error occured'});
  },
  password: async ({ locals, request }: RequestEvent) => {
    const data = await request.formData();
    const password = data.get('password');
    const confirmPassword = data.get('confirm-password');

    if (!password || !confirmPassword) {
      return fail(400, { passwordSuccess: false, passwordMessage: 'Both fields are required' });
    }

    if (password !== confirmPassword) {
      return fail(400, { passwordSuccess: false, passwordMessage: 'Passwords do not match' });
    }

    const res = await fetch(`${API_URL}/user`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${locals.token}`,
      },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      return {
        passwordSuccess: true,
        passwordMessage: 'Password updated successfully',
      };
    }

    return fail(400, { passwordSuccess: false, passwordMessage: 'An error occured'});
  },
  deletepicture: async ({ locals, request }: RequestEvent) => {
    const res = await fetch(`${API_URL}/user/picture`, {
      method: 'DELETE',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${locals.token}`,
      },
      
    });

    if (res.ok) {
      return {
        success: true,
        message: 'Picture deleted successfully',
      };
    }
    return fail(400, { success: false, message: 'An error occured'});
  },

  updatepicture: async ({ locals, request }: RequestEvent) => {
    const data = await request.formData();
    const form = new FormData();
    form.append('picture', data.get('picture') || '');
  
    const res = await fetch(`${API_URL}/user/picture`, {
      method: 'PUT',
      headers: { 
        Authorization: `Bearer ${locals.token}`,
      },
      body: form
    });
  
    if (res.ok) {
      return {
        success: true,
        message: 'Picture updated successfully',
      };
    }
    return fail(400, { success: false, message: 'An error occurred'});
  },
  


  delete: async ({ cookies, locals, request }: RequestEvent) => {
    const data = await request.formData();
    const confirmation = data.get('confirmation') as string;

    if (confirmation.toLowerCase() === 'yes, i agree') {
      const res = await fetch(`${API_URL}/user`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${locals.token}`,
        },
      });

      if (res.ok) {
        cookies.delete('token', {
          path: '/',
          secure: false,
        });

        return redirect(303, '/login');
      }
    }
  },
};
