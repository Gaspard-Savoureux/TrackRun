<script lang="ts">
	import { getFormatDate, getFormatDuration, getFormatTime } from '$lib/plannedActivity/activity';
	import { activityType } from '$lib/plannedActivity/activity.js';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
  import type { PlannedActivity } from '$lib/types/plannedActivity.js';

  export let data;

  type Calendar = {
	  day: Date, 
	  activities: PlannedActivity[]
  }[]

	// Set today's date
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize today's date

	// Filters
  let date: Date;
  let type: string;
  let dateParam: string | null;
  let daysWithActivities: Calendar;

  // Reactive variables
  $: ({ plannedActivities } = data);
  $: {
	  dateParam = $page.url.searchParams.get('from');
	  date = dateParam ? new Date(dateParam) : today;
	  type = $page.url.searchParams.get('type') || 'All';
	  daysWithActivities = getDaysWithActivities();
  }
	
  const handleFilter = () => {
	  goto(`?from=${getDateString()}&type=${type}`);
  };

  const handleActivityClick = (id: number | null) => {
    goto(`./plannedActivity?id=${id}`);
  };
  
  function addDaysToDate(date: Date | string, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  function getDateString() {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${month}-${day}`;
  }

  function nextDay() {
    date = addDaysToDate(date, 1);
  }

  function nextWeek() {
    date = addDaysToDate(date, 7);
  }

  function prevDay() {
    date = addDaysToDate(date, -1);
  }

  function prevWeek() {
    date = addDaysToDate(date, -7);
  }

  // Preparing activities for the next 7 days
  function getDaysWithActivities(): Calendar {
    return Array.from({ length: 7 }).map((_, index) => {
      const day = addDaysToDate(date, index);
      const activitiesForDay = plannedActivities.filter((activity) => {
        const activityDate = new Date(activity.date);
        activityDate.setHours(0, 0, 0, 0);
        return activityDate.getTime() === day.getTime();
      });
      return { day, activities: activitiesForDay };
    });
  }
</script>

<body class="planned-activities">
	<article class="planning-container">
		<h1>Planning this week</h1>
		<div class="filters">
			<div class="filter" on:change={handleFilter}>
				<label for="type">Type</label>
				<select bind:value={type} id="type" name="type">
					<option value="All">All</option>
				{#each activityType as type}
					<option value={type}>{type}</option>
				{/each}
				</select>
			</div>
			<div class="filter">
				<button on:click={prevWeek} on:click={handleFilter} class="no-btn">
					<i class="arrow left"></i><i class="arrow left"></i>
				</button>
				<button on:click={prevDay} on:click={handleFilter} class="no-btn">
					<i class="arrow left"></i>
				</button>
				<button on:click={nextDay} on:click={handleFilter} class="no-btn">
					<i class="arrow right"></i>
				</button>
				<button on:click={nextWeek} on:click={handleFilter} class="no-btn">
					<i class="arrow right"></i><i class="arrow right"></i>
				</button>
			</div>
		</div>
		{#await plannedActivities}
		  <!-- Make a pretty loader -->
			<h2>Loading...</h2>
		{:then}
			{#each daysWithActivities as { day, activities }}
				{#if activities.length > 0}
					{#each activities as activity}
						<div class="activity-card">
							<button class="view-btn" on:click={() => handleActivityClick(activity.id)}>
								Details
							</button>
							<div class="activity-date">{getFormatDate(activity.date)} - {getFormatTime(activity.date)}</div>
							<div class="activity-title">{activity.name || activity.type}</div>
							<div class="activity-duration">{getFormatDuration(activity.duration)}</div>
							{#if activity.comment}
								<div class="activity-comment">{activity.comment}</div>
							{/if}
						</div>
					{/each}
				{:else}
					<div class="no-activity-card">
						<div class="activity-date">{getFormatDate(day.toISOString())}</div>
						<div class="no-activity-title">No activity planned today.</div>
					</div>
				{/if}
			{/each}
			<a href="/plannedActivities/new" class="new-activity-button">Plan New Activity</a>
		{:catch error}
			<p>{error.message}</p>
		{/await}
	</article>
</body>

<style>
  /* default style */
  :root {
    /* planning-container */
    --planning-container-margin-top: 60px;
    --planning-container-max-width: 1000px;
    --planning-container-padding: 20px;

    /* activity general */
    --activity-color: #333;
    --font-weight: bold;

    /* activity-card */
    --activity-card-height: 70px;
    --activity-card-margin-bottom: 0.5rem;
    --activity-card-max-height: 100px;
    --activity-card-padding-top: 20px;
    --activity-card-padding: 10px;
    --activity-card-width: 100%;

    /* activity-title */
    --activity-title-font-size: 20px;

    /* activity-date */
    --activity-date-font-size: 20px;

    /* activity-duration & activity-comment*/
    --activity-comment-color: #555;
    --activity-comment-font-size: 15px;

    /* no-activity-card */
    --no-activity-card-background-color: rgba(85, 85, 85, 0.3);
    --no-activity-card-height: auto;
    --no-activity-card-margin-bottom: 0.4rem;
    --no-activity-card-max-height: 80px;
    --no-activity-card-padding-top: 15px;
    --no-activity-card-padding: 10px;
    --no-activity-card-width: 100%;
  }

  @media (max-width: 600px) {
    /* Small screens */
    .planning-container {
      --planning-container-margin-top: 20px;
      --planning-container-max-width: 100%;
      --planning-container-padding: 10px;
    }

    .activity-card {
      --activity-card-height: auto;
      --activity-card-margin-bottom: 0.2rem;
      --activity-card-max-height: 60px;
      --activity-card-padding-top: 10px;
      --activity-card-padding: 5px;
      --activity-card-width: 100%;
    }

    .activity-title {
      --activity-title-font-size: 12px;
    }

    .activity-date {
      --activity-date-font-size: 12px;
    }

    .activity-duration,
    .activity-comment {
      --activity-comment-font-size: 9px;
    }

    .no-activity-card {
      --no-activity-card-height: auto;
      --no-activity-card-margin-bottom: 0.2rem;
      --no-activity-card-max-height: 60px;
      --no-activity-card-padding-top: 10px;
      --no-activity-card-padding: 5px;
      --no-activity-card-width: 100%;
    }
  }

  @media (min-width: 601px) and (max-width: 1024px) {
    /* Medium screens */
    .planning-container {
      --planning-container-margin-top: 40px;
      --planning-container-max-width: 80%;
      --planning-container-padding: 15px;
    }

    .activity-card {
      --activity-card-height: auto;
      --activity-card-margin-bottom: 0.4rem;
      --activity-card-max-height: 80px;
      --activity-card-padding-top: 15px;
      --activity-card-padding: 10px;
      --activity-card-width: 99%;
    }

    .activity-title {
      --activity-title-font-size: 15px;
    }

    .activity-duration,
    .activity-comment {
      --activity-comment-font-size: 12px;
    }

    .no-activity-card {
      --no-activity-card-height: auto;
      --no-activity-card-margin-bottom: 0.4rem;
      --no-activity-card-max-height: 80px;
      --no-activity-card-padding-top: 15px;
      --no-activity-card-padding: 10px;
      --no-activity-card-width: 99%;
    }
  }
  .planning-container {
    align-items: center;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    margin-top: var(--planning-container-margin-top);
    margin: auto;
    max-height: calc(90vh - 60px);
    max-width: var(--planning-container-max-width);
    overflow-y: auto;
    padding: var(--planning-container-padding);
  }

  .activity-card {
    height: var(--activity-card-height);
    margin-bottom: var(--activity-card-margin-bottom);
    max-height: var(--activity-card-max-height);
    padding-top: var(--activity-card-padding-top);
    padding: var(--activity-card-padding);
    width: var(--activity-card-width);
  }

  .activity-card:nth-of-type(odd) {
    background: rgba(114, 176, 249, 0.3);
  }

  .activity-card:nth-of-type(even) {
    background: rgba(253, 99, 43, 0.3);
  }

  .activity-title {
    color: var(--activity-color);
    font-size: var(--activity-title-font-size);
    font-weight: var(--font-weight);
  }

  .activity-date {
    font-size: var(--activity-date-font-size);
    font-weight: var(--font-weight);
    margin-bottom: 0.25rem;
  }

  .activity-duration {
    color: var(--activity-comment-color);
    float: right;
    font-size: var(--activity-comment-font-size);
  }

  .activity-comment {
    color: var(--activity-comment-color);
    font-size: var(--activity-comment-font-size);
  }

  .no-activity-card {
    background-color: var(--no-activity-card-background-color);
    height: var(--no-activity-card-height);
    margin-bottom: var(--no-activity-card-margin-bottom);
    max-height: var(--no-activity-card-max-height);
    padding-top: var(--no-activity-card-padding-top);
    padding: var(--no-activity-card-padding);
    width: var(--no-activity-card-width);
  }

  .new-activity-button {
    background-color: #007bff;
    border-radius: 4px;
    color: white;
    cursor: pointer;
    display: inline-block;
    font-size: 16px;
    margin: 20px;
    padding: 10px 15px;
    text-decoration: none;
  }

  .new-activity-button:hover {
    background-color: #0056b3;
  }

	.arrow {
		border: solid var(--link);
		border-width: 0 3px 3px 0;
		display: inline-block;
		padding: 8px;
	}

	.right {
		transform: rotate(-45deg);
		-webkit-transform: rotate(-45deg);
	}

	.left {
		transform: rotate(135deg);
		-webkit-transform: rotate(135deg);
	}

	.no-btn {
		background-color: rgba(255,255,255,0);
		border: 0px;
		margin: 5px;
		cursor: pointer;
	}

	.no-btn:hover > .arrow {
    border: solid var(--link-hover);
	  border-width: 0 3px 3px 0;
	}

	.view-btn {
    float: right;
    padding: 5px 8px;
    margin-bottom: 5px;
    background-color: #555;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

	.filters {
		display: flex;
    justify-content: space-between;
		align-items: center;
		width: 100%;
		padding: 5px;
	}

	.filter {
		display:block;
	}

  article {
    font-family: 'Montserrat', sans-serif;
  }

  h1 {
    margin: 10px;
  }
</style>
