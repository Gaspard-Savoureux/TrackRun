// src/routes/plannedActivities/+page.server.ts

export type PlannedActivity = {
  id: number;
  type: string;
  date: string;
  duration: number;
  name: string;
  comment: string;
  activity_id: number | null;
};

// Static JSON data
const staticPlannedActivities: PlannedActivity[] = [
  {
    id: 1,
    type: 'Running',
    date: '2024-02-26 16:30:00',
    duration: 1800,
    name: 'A run in the park',
    comment: '',
    activity_id: null,
  },
  {
    id: 2,
    type: 'Running',
    date: '2024-02-27 16:30:00',
    duration: 1200,
    name: 'A run in the park again',
    comment: '',
    activity_id: null,
  },
  {
    id: 3,
    type: 'Biking',
    date: '2024-03-02 19:00:00',
    duration: 3600,
    name: 'Biking around the block',
    comment: 'Be carefull with your knee!',
    activity_id: null,
  },
  {
    id: 4,
    type: 'Walking',
    date: '2024-03-05 13:00:00',
    duration: 2400,
    name: 'Smooth walk',
    comment: 'Enjoy your walk!',
    activity_id: null,
  },
];

export async function load(): Promise<{ plannedActivities: PlannedActivity[] }> {
  return {
    props: {
      plannedActivities: staticPlannedActivities,
    },
  };
  
}

