// src/routes/plannedActivities/+page.server.ts
import { API_URL } from '../../constants';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';
import type { PlannedActivity } from '$lib/types/plannedActivity';

// To create activities in DB quickly
// insert into planned_activities(user_id, type, date, duration, name) values (60, 'Running', '2024-02-12 00:00:00', 3600, 'A good run!');

const pActivitiesUrl = `${API_URL}/plannedactivities`;

export const load: PageServerLoad = async ({ fetch, locals }) => {
  const res = await fetch(pActivitiesUrl, {
    method: 'GET',
      headers: { Authorization: `Bearer ${locals.token}` },
  });
  if (!res.ok) {
    // Should not really happen since user is logged in but you never know
    return error(404, { message: 'Could not load the ressource'});
  }
  const json = await res.json();
  const plannedActivities: PlannedActivity[] = json.plannedActivities; 

  return { plannedActivities };
};
