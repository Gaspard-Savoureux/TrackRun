// src/routes/plannedActivities/+page.server.ts
import { API_URL } from '../../constants';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';
import type { PlannedActivity } from '$lib/types/plannedActivity';

// To create activities in DB quickly
// insert into planned_activities(user_id, type, date, duration, name) values (60, 'Running', '2024-02-12 00:00:00', 3600, 'A good run!');

const pActivitiesUrl = `${API_URL}/plannedactivities`;

// converts a date to YYYY-MM-DD format
function dateToFormattedDay(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Zero-pad month for YYYY-MM format
  const day = String(date.getDate()).padStart(2, '0'); // Zero-pad day for YYYY-DD format
  return `${year}-${month}-${day}`;
}

export const load: PageServerLoad = async ({ fetch, locals }) => {
  // add from query param to url
  const from = dateToFormattedDay(new Date());
  const url = new URL(pActivitiesUrl);
  url.searchParams.set('from', from);

  const res = await fetch(url, {
    method: 'GET',
    headers: { Authorization: `Bearer ${locals.token}` },
  });
  if (!res.ok) {
    // Should not really happen since user is logged in but you never know
    return error(404, { message: 'Could not load the ressource' });
  }
  const json = await res.json();
  const plannedActivities: PlannedActivity[] = json.plannedActivities || [];

  return { plannedActivities };
};
