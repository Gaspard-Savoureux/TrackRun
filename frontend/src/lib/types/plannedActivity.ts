export type PlannedActivity = {
  id: number,
  type: string,
  date: string,
  duration: number,
  name: string,
  comment: string,
  activity_id: number | null,
}