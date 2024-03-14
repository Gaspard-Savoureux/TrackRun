import { fail } from '@sveltejs/kit';
import type { RequestEvent } from '../$types';
import { API_URL } from '../../../constants';

// Might be usefull to define a type for newPlannedActivity?
// Or maybe reuse the same existing type, but keep id, user_id and activity_id null?

function formatPlannedActivity(pActivity: any) {
  // Add any other formatting here

  // Time in seconds from minutes
  const sec = pActivity.duration as number * 60;
  pActivity.duration = sec;
}

export const actions: object = {
  default: async ({ cookies, fetch, request }: RequestEvent) => {
    const data = await request.formData();
    const pActivity = {
      type: data.get('type'),
      date: `${data.get('date')} ${data.get('time')}`,
      duration: data.get('duration'),
      name: data.get('name') || data.get('type'),
      comment: data.get('comment') || '',
    };
    formatPlannedActivity(pActivity);

    
    if (!pActivity.type || !pActivity.date || !pActivity.duration) {
      return fail(400, {
        success: false,
        message: 'Please fill all mandatory fields',
      });
    } 


    const res = await fetch(`${API_URL}/plannedactivities`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cookies.get('token')}`,
      },
      body: JSON.stringify(pActivity),
    });


    if (res.status === 400) {
      return fail(res.status, {
        success: false,
        message: 'Invalid request: could not create planned activity.',
      });
    }


    if (res.status === 401) {
      return fail(res.status, {
        success: false,
        message: 'User not logged in. Please log in to continue.',
      });
    }


    if (res.ok) {
      // TODO: use id of created activity to show on page
      // const pActivityId = await res.json();

      // For now return nothing
      return { success: true };
    }


    return fail(500, {
      success: false,
      message: 'Internal server error',
    });
  },
};
