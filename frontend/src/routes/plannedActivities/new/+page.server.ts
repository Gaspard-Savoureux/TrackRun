import { fail } from '@sveltejs/kit';
import type { RequestEvent } from '../$types';
import { API_URL } from '../../../constants';
import type { PlannedActivity } from '$lib/types/plannedActivity';


function formatPlannedActivity(data: FormData): PlannedActivity {
  const pActivity: PlannedActivity = {
    id: null,
    type: String(data.get('type')) ,
    date: `${data.get('date')} ${data.get('time')}`,
    duration: Number(data.get('duration')) * 60,
    name: String(data.get('name')) || String(data.get('type')),
    comment: String(data.get('comment')),
    activity_id: null,
  };
  return pActivity;
}

export const actions: object = {
  default: async ({ cookies, fetch, request }: RequestEvent) => {
    const data = await request.formData();
    
    if (!data.get('date') || !data.get('time') ||
        !data.get('duration') || !data.get('type')) {
      return fail(400, {
        success: false,
        message: 'Please fill all mandatory fields',
      });
    } 

    const pActivity: PlannedActivity = formatPlannedActivity(data);
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
      return { submitted: true };
    }


    return fail(500, {
      success: false,
      message: 'Internal server error',
    });
  },
};
