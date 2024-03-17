export function getFormatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-CA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function getFormatDuration(duration: number): string {
  if (duration === 0) 
    return '-';
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  return `${hours > 0 ? `${hours}h` : ''}${minutes}m`;
}
