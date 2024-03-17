import { API_URL } from '../../constants';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';
import type { PlannedActivity } from '$lib/types/plannedActivity';
import { fail } from '@sveltejs/kit';
import type { RequestEvent } from '../$types';
import { formatPlannedActivity } from '$lib/plannedActivity/activity';


// Load data
export const load: PageServerLoad = async ({ fetch, locals, url }) => {
  const activityId = url.searchParams.get('id');

  const response = await fetch(`${API_URL}/plannedactivities/${activityId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${locals.token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    return error(404, { message: 'Could not load ressource.' });
  }

  const json = await response.json();
  const plannedActivity: PlannedActivity = json.plannedActivity || undefined;

  return { plannedActivity };
};


// Update activity
export const actions: object = {
  save: async ({ cookies, fetch, request }: RequestEvent) => {
    const data = await request.formData();
    
    if (!data.get('date') || !data.get('time') ||
        !data.get('duration') || !data.get('type')) {
      return fail(400, {
        success: false,
        message: 'Please fill all mandatory fields',
      });
    } 

    const pActivity: PlannedActivity = formatPlannedActivity(data);
  
    const res = await fetch(`${API_URL}/plannedactivities/${pActivity.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cookies.get('token')}`,
      },
      body: JSON.stringify(pActivity),
      
    });


    if (res.status === 400) {
      return fail(res.status, {
        updated: false,
        message: 'Invalid request: could not update planned activity.',
      });
    }


    if (res.status === 401) {
      return fail(res.status, {
        updated: false,
        message: 'User not logged in. Please log in to continue.',
      });
    }


    if (res.ok) {
      return { 
        updated: true,
        message: 'Planned activity updated successfully!',
      };
    }

    return fail(500, {
      updated: false,
      message: 'Internal server error',
    });
  },

  delete: async ({ cookies, fetch, request }: RequestEvent) => {
    const data = await request.formData();
    const pActivity: PlannedActivity = formatPlannedActivity(data);
    const res = await fetch(`${API_URL}/plannedactivities/${pActivity.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${cookies.get('token')}` },
    });


    if (res.status === 400 || res.status === 404 ) {
      return fail(res.status, {
        deleted: false,
        message: 'Could not delete planned activity.',
      });
    }


    if (res.status === 401) {
      return fail(res.status, {
        deleted: false,
        message: 'User not logged in. Please log in to continue.',
      });
    }


    if (res.ok) {
      return { 
        deleted: true,
        message: 'Planned activity deleted!',
      };
    }

    return fail(500, {
      success: false,
      message: 'Internal server error',
    });
  },
};

