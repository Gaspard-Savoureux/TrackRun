import type { PlannedActivity } from '$lib/types/plannedActivity';

export const activityType = ['Running', 'Biking', 'Walking'];

export function getFormatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-CA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function getFormatTime(dateString: string): string {
  const date = new Date(dateString);
  const hours = date.getHours();
  const min = String(date.getMinutes()).padStart(2,'0');
  return `${hours}h${min}`;
}

export function getFormatDuration(duration: number): string {
  if (duration === 0) 
    return '-';
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  return `${hours > 0 ? `${hours}h` : ''}${minutes}m`;
}

export function formatPlannedActivity(data: FormData): PlannedActivity {
  const pActivity: PlannedActivity = {
    id: Number(data.get('id')) || null,
    type: String(data.get('type')) ,
    date: `${data.get('date')} ${data.get('time')}`,
    duration: Number(data.get('duration')) * 60,
    name: String(data.get('name')) || String(data.get('type')),
    comment: String(data.get('comment')),
    activity_id: null,
  };
  return pActivity;
}
