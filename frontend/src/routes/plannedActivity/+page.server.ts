import { API_URL } from '../../constants';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';
import type { PlannedActivity } from '$lib/types/plannedActivity';

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

