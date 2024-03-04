<script lang="ts">
  import type { PlannedActivity} from './+page.server';
  export let plannedActivities: PlannedActivity[] = [
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

  const formatDuration = (duration: number) => {
    if (duration === 0) return '-';
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    return `${hours > 0 ? `${hours}h` : ''}${minutes}m`;
  };

  const formatDate = (dateString: string) => {
    const [date] = dateString.split(' ');
    return new Date(date).toLocaleDateString('en-US', {
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
    height: 100px;
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
</style>

<article class="planning-container">
  <h1>Planning this week</h1>
  {#if Array.isArray(plannedActivities) && plannedActivities.length > 0}
    {#each plannedActivities as activity}
      <div class="activity-card">
        <div class="activity-date">{formatDate(activity?.date)}</div>
        <div class="activity-title">{activity?.name || activity?.type}</div>
        {#if activity?.duration}
          <div class="activity-duration">{formatDuration(activity.duration)}</div>
        {/if}
        {#if activity?.comment}
          <div class="activity-comment">{activity.comment}</div>
        {/if}
      </div>
    {/each}
  {:else}
    <p>No planned activities to display.</p>
  {/if}
</article>
