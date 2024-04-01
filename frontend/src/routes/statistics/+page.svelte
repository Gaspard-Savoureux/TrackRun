<script lang='ts'>
  import { getISOFromDate, getDateFromISO } from '$lib/plannedActivity/activity';
  import { activityType } from '$lib/plannedActivity/activity.js';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import type { ActivityStats } from '$lib/types/activityStats.js';
  import Chart, { Chart as ChartType } from 'chart.js/auto';
  import { onDestroy, onMount } from 'svelte';

  export let data;

  let distanceChart: ChartType | null = null;
  let durationChart: ChartType | null = null;
  let amountChart: ChartType | null = null;

  type ActivityDetail = {
    distance: number;
    duration: number;
    amount: number;
  };

  type ProcessedStat = {
    week: string;
    activities: Record<string, ActivityDetail>;
  };

  const colors: Record<string, { backgroundColor: string; borderColor: string }> = {
    running: {
      backgroundColor: 'rgba(253, 99, 43, 0.5)',
      borderColor: 'rgba(253, 99, 43, 1)',
    },
    biking: {
      backgroundColor: 'rgba(114, 176, 249, 0.5)',
      borderColor: 'rgba(114, 176, 249, 1)',
    },
    walking: {
      backgroundColor: 'rgba(195, 177, 225, 0.5)', 
      borderColor: 'rgba(195, 177, 225, 1)',
    },
  };

	// Set today's date
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize today's date

	// Filters
  let dateParam: string | null;
  let typeParam: string | null;
  let dateFilter: Date;
  let currentMonth: string;
/* 
  let activitiesStats: ActivityStats[] = data.activitiesStats;

  // Reactive variables
  $: ({ activitiesStats } = data); */

  $: {
	  dateParam = $page.url.searchParams.get('date');
    typeParam = $page.url.searchParams.get('type');
	  dateFilter = dateParam ? getDateFromISO(dateParam) : today;
    currentMonth = currentPeriod();
  }
	
  const currentPeriod = () => {
    return  dateFilter.toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'long',
    });
  };

  const handleFilter = () => {
    // Binding value on select doesn't work on all browser. Use this instead
    const typeFilter =  (<HTMLInputElement>document.getElementById('type')).value;
	  goto(`?date=${getISOFromDate(dateFilter)}&type=${typeFilter}`);
  };

  function nextMonth() {
    dateFilter.setMonth(dateFilter.getMonth() + 1);
  }

  function prevMonth() {
    dateFilter.setMonth(dateFilter.getMonth() - 1);
  }

  let processedData: ProcessedStat[] = processActivities(data.activitiesStats);

  function processActivities(activities: ActivityStats[]): ProcessedStat[] {
    const weeksMap = new Map<string, ProcessedStat>();

    activities.forEach(activity => {
      const date = new Date(activity.date);
      const weekNumber = `${getWeekNumber(date)}`;
      const weekData = weeksMap.get(weekNumber) || {
        week: weekNumber,
        activities: {
          running: { distance: 0, duration: 0, amount: 0 },
          biking: { distance: 0, duration: 0, amount: 0 },
          walking: { distance: 0, duration: 0, amount: 0 },
        },
      };

      weekData.activities[activity.type.toLowerCase()].distance += parseFloat(activity.distanceTotal);
      weekData.activities[activity.type.toLowerCase()].duration += activity.durationTotal;
      weekData.activities[activity.type.toLowerCase()].amount += 1;

      weeksMap.set(weekNumber, weekData);
    });

    return Array.from(weeksMap.values());
  }

  function getWeekNumber(date: Date) {
    const startOfTheYear = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date.getTime() - startOfTheYear.getTime()) / (24 * 60 * 60 * 1000)) + 1;
    const weekNumber = Math.ceil(days / 7);
    return `Week ${weekNumber}`;
  }

  function weekNumberToDateRange(weekNumber: string, year: number): string {
    const week = parseInt(weekNumber.split(' ')[1]);
    const startDate = new Date(year, 0, (week - 1) * 7 + 1);
    const endDate = new Date(year, 0, week * 7);
    return `${startDate.toISOString().split('T')[0]} - ${endDate.toISOString().split('T')[0]}`;
  }

  const createChart = (canvasId: string, label: string, valueKey: keyof ActivityDetail, chartTitle: string, year: number): ChartType | null => {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement | null;
    if (!canvas) {
      console.error(`Canvas with ID '${canvasId}' not found.`);
      return null; // Return null explicitly if canvas is not found
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error(`Could not get 2D context for canvas with ID '${canvasId}'.`);
      return null;
    }


    const datasets = activityType.map(type => {
      // Safely accessing nested properties
      const data = processedData.map(item => {
        const activity = item.activities[type.toLowerCase()];
        return activity ? activity[valueKey] : 0; // Fallback to 0 if activity or valueKey is not found
      });

      return {
        label: type,
        data,
        backgroundColor: colors[type.toLowerCase()].backgroundColor,
        borderColor: colors[type.toLowerCase()].borderColor,
        borderWidth: 1,
      };
    });

    return new Chart(ctx, {
      type: 'bar',
      data: {
        labels: processedData.map(d => weekNumberToDateRange(d.week, year)),
        datasets,
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: chartTitle,
          },
        },
        scales: {
          x: { stacked: true },
          y: { stacked: true, title: { display: true, text: label } },
        },
      },
    });
  };

  const updateCharts = () => {
    // Destroy the previous charts if they exist
    distanceChart?.destroy();
    durationChart?.destroy();
    amountChart?.destroy();

    const year = dateFilter.getFullYear();

    distanceChart = createChart('distanceChart', 'Total Distance (km)', 'distance', 'Total distance for the month', year);
    durationChart = createChart('durationChart', 'Total Duration (minutes)', 'duration', 'Total duration for the month', year);
    amountChart = createChart('amountChart', 'Total Amount', 'amount', 'Total amount done for the month', year);
  };

  onMount(() => {
    updateCharts();
  });

  $: if (dateParam || typeParam) {
    processedData = processActivities(data.activitiesStats); // Re-process data
    updateCharts(); // Update charts with new data
  }

  onDestroy(() => {
    distanceChart?.destroy();
    durationChart?.destroy();
    amountChart?.destroy();
  });

</script>

<body class="">
	<article class="container">
		<h1>Statistics</h1>
    <!-- Start of filter block -->
		<div class="filters">
      <div class="filter">
				<label for="type">Type</label>
				<select on:change={handleFilter} id="type" name="type">
					<option value="All">All</option>
				  {#each activityType as type}
					  <option value={type} selected={type === typeParam}>{type}</option>
				  {/each} 
				</select>
			</div>
			<div class="filter">
				<button on:click={prevMonth} on:click={handleFilter} class="no-btn">
					<i class="arrow left"></i>
				</button>
        <p>{currentMonth}</p>
				<button on:click={nextMonth} on:click={handleFilter} class="no-btn">
					<i class="arrow right"></i>
				</button>
			</div>
		</div>
    <div>
    <!-- End of filter block -->
    <div>
      <canvas id='distanceChart'/>
    </div>
    <div>
      <canvas id="durationChart"></canvas>
    </div>
    <div>
      <canvas id="amountChart"></canvas>
    </div>    
  </article>	
</body>

<style>
  /* Container can be deleled, only a style placeholder */
  .container {
    max-width: 1000px;
    padding: 20px;
    margin: auto;
    margin-top: 60px;
    border: #505050 solid 1px
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

	.filters {
		display: flex;
    justify-content: space-between;
		align-items: center;
		width: 100%;
		padding: 5px;
	}

	.filter {
		display: flex;
    justify-content: start;
    align-items: center;
    padding: 5px;
	}
</style>
