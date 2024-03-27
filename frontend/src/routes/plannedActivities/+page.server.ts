// src/routes/plannedActivities/+page.server.ts
import { API_URL } from '../../constants';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';
import type { PlannedActivity } from '$lib/types/plannedActivity';
import { getLastMonday, getISOFromDate } from '$lib/plannedActivity/activity';

function getUrl(from: string, type: string) {
  const url = new URL(`${API_URL}/plannedactivities?`);
  // Week starts on monday by default
  if (!from) {
    from = getISOFromDate(getLastMonday(new Date()));
  }
  url.searchParams.set('from', from);

  if (type !== 'All') {
    url.searchParams.set('type', type);
  }
  return url;
}

export const load: PageServerLoad = async ({ url, locals }) => {
  const from = url.searchParams.get('from') || '';
  const type = url.searchParams.get('type') || '';
  const pActivitiesUrl = getUrl(from, type);

  const res = await fetch(pActivitiesUrl, {
    method: 'GET',
    headers: { Authorization: `Bearer ${locals.token}` },
  });


  // This might be unncessary later on when default redirect is implemented
  if (res.status === 401) {
    redirect(302, '/login');
  }

  // Instead use error message on page and return empty array
  if (!res.ok) {
    return error(404, { message: 'Could not load the ressource' });
  }

  const json = await res.json();
  const plannedActivities: PlannedActivity[] = json.plannedActivities || [];

  return { plannedActivities };
};
