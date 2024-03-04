<script lang="ts">
  import type { PlannedActivity} from './+page.server';
  export let plannedActivities: PlannedActivity[] = [
    {
      id: 1,
      type: 'Running',
      date: '2024-03-04 16:30:00',
      duration: 1800,
      name: 'A run in the park',
      comment: '',
      activity_id: null,
    },
    {
      id: 2,
      type: 'Running',
      date: '2024-03-05 16:30:00',
      duration: 1200,
      name: 'A run in the park again',
      comment: '',
      activity_id: null,
    },
    {
      id: 3,
      type: 'Biking',
      date: '2024-03-06 19:00:00',
      duration: 3600,
      name: 'Biking around the block',
      comment: 'Be carefull with your knee!',
      activity_id: null,
    },
    {
      id: 4,
      type: 'Walking',
      date: '2024-03-08 13:00:00',
      duration: 2400,
      name: 'Smooth walk',
      comment: 'Enjoy your walk!',
      activity_id: null,
    },
  ];

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize today's date

  // Function to add days
  const addDays = (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  // Preparing activities for the next 7 days
  const daysWithActivities = Array.from({ length: 7 }).map((_, index) => {
    const day = addDays(today, index);
    const activitiesForDay = plannedActivities.filter(activity => {
      const activityDate = new Date(activity.date);
      activityDate.setHours(0, 0, 0, 0);
      return activityDate.getTime() === day.getTime();
    });
    return { day, activities: activitiesForDay };
  });
  
  const formatDuration = (duration: number): string => {
    if (duration === 0) return '-';
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    return `${hours > 0 ? `${hours}h` : ''}${minutes}m`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
</script>

<style>
  .planning-container {
    max-width: 800px;
    margin: auto;
    display: flex; 
    flex-direction: column; 
    align-items: center;
  }

  .activity-card {
    margin-bottom: 0.5rem;
    height: 70px;
    max-height: 100px;
    width: 100%;
    padding: 10px;
    padding-top: 20px;
  }

  .activity-card:nth-of-type(odd) {
    background: rgba(114, 176, 249, 0.3);
  }

  .activity-card:nth-of-type(even) {
    background: rgba(253, 99, 43, 0.3);
  }

  .activity-title {
    font-size: 1.2rem;
    font-weight: bold;
    color: #333;
  }

  .activity-date {
    font-weight: bold;
    margin-bottom: 0.25rem;
  }


  .activity-duration {
    float: right;
    color: #555;
  }

  .no-activity-card {
    margin-bottom: 0.5rem;
    height: 70px;
    max-height: 100px;
    width: 100%;
    padding: 10px;
    padding-top: 20px;
    background-color: rgba(85, 85, 85, 0.3);
  }
</style>

<article class="planning-container">
  <h1>Planning this week</h1>
  {#each daysWithActivities as { day, activities }}
    {#if activities.length > 0}
      {#each activities as activity}
        <div class="activity-card">
          <div class="activity-date">{formatDate(activity.date)}</div>
          <div class="activity-title">{activity.name || activity.type}</div>
          <div class="activity-duration">{formatDuration(activity.duration)}</div>
          {#if activity.comment}
            <div class="activity-comment">{activity.comment}</div>
          {/if}
        </div>
      {/each}
    {:else}
      <div class="no-activity-card">
        <div class="activity-date">{formatDate(day.toISOString())}</div>
        <div class="no-activity-title">No activity planned today.</div>
      </div>
    {/if}
  {/each}
</article>



