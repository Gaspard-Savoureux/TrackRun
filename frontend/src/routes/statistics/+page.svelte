<script lang="ts">
  import { getISOFromDate, getDateFromISO } from '$lib/plannedActivity/activity';
  import { activityType } from '$lib/plannedActivity/activity.js';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import type { ActivityStats } from '$lib/types/activityStats.js';

  export let data;

	// Set today's date
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize today's date

	// Filters
  let dateParam: string | null;
  let typeParam: string | null;
  let dateFilter: Date;
  let currentMonth: string;

  let activitiesStats: ActivityStats[];

  // Reactive variables
  $: ({ activitiesStats } = data);
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
    <!-- Do your magic here: exemple of stats data below-->
      <h2>Data that should be used for graphs</h2>
      {#if data.error}
        <p class=danger>{data.error}</p>
      {/if}
      <!-- This should be replaced by graphs-->
      {#each activitiesStats as stat}
        <div>
          <p>
            <b>Stat:</b><br>
            date: {stat.date}<br>
            type: {stat.type}<br>
            duration: {stat.durationTotal}<br>
            distance: {stat.distanceTotal}<br>
          </p>
        </div>
      {/each}
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
