<script lang="ts">
    import { scaleLinear, line } from "d3";
    
    const data = [
        { name: "Jan", total: Math.floor(Math.random() * 5000) + 1000 },
        { name: "Feb", total: Math.floor(Math.random() * 5000) + 1000 },
        { name: "Mar", total: Math.floor(Math.random() * 5000) + 1000 },
        { name: "Apr", total: Math.floor(Math.random() * 5000) + 1000 },
        { name: "May", total: Math.floor(Math.random() * 5000) + 1000 },
        { name: "Jun", total: Math.floor(Math.random() * 5000) + 1000 },
        { name: "Jul", total: Math.floor(Math.random() * 5000) + 1000 },
        { name: "Aug", total: Math.floor(Math.random() * 5000) + 1000 },
        { name: "Sep", total: Math.floor(Math.random() * 5000) + 1000 },
        { name: "Oct", total: Math.floor(Math.random() * 5000) + 1000 },
        { name: "Nov", total: Math.floor(Math.random() * 5000) + 1000 },
        { name: "Dec", total: Math.floor(Math.random() * 5000) + 1000 }
    ];

    const xTicks = data.map(d => d.name);
    const yTicks = [0, 1500, 3000, 4500, 6000];
    const padding = { top: 20, right: 15, bottom: 10, left: 45 };

    let width = 300;
    let height = 300;

    function formatMobile(tick: number | string) {
        return "'" + tick.toString().slice(-2);
    }

    const xScale = scaleLinear()
        .domain([0, xTicks.length - 1])
        .range([padding.left, width - padding.right]);

    const yScale = scaleLinear()
        .domain([0, Math.max(...yTicks)])
        .range([height - padding.bottom, padding.top]);

    const lineGenerator = line()
        .x((d, i) => xScale(i))
        .y(d => yScale(d.total));
</script>

<div class="chart" bind:clientWidth={width} bind:clientHeight={height}>
    <svg>
        <!-- y axis -->
        <g class="axis y-axis">
            {#each yTicks as tick}
                <g class="text-xs" transform="translate(0, {yScale(tick)})">
                    <text
                        stroke="none"
                        font-size="12"
                        orientation="left"
                        width="60"
                        height="310"
                        x="57"
                        y="-4"
                        fill="#888888"
                        text-anchor="end">
                        <tspan x="36" dy="0.355em">{tick}</tspan>
                    </text>
                </g>
            {/each}
        </g>

        <!-- x axis -->
        <g class="axis x-axis">
            {#each data as point, i}
                <g class="text-xs" transform="translate({xScale(i)},{height})">
                    <text
                        stroke="none"
                        font-size="12"
                        orientation="bottom"
                        width="531"
                        height="30"
                        x={width > 380 ? xScale(i) + (xScale(i + 1) - xScale(i)) / 2 : xScale(i)}
                        y="-15"
                        fill="#888888"
                        text-anchor="middle">
                        <tspan x={width > 380 ? xScale(i) + (xScale(i + 1) - xScale(i)) / 2 : xScale(i)} dy="0.71em">
                            {width > 380 ? point.name : formatMobile(point.name)}
                        </tspan>
                    </text>
                </g>
            {/each}
        </g>

        <!-- Line Path -->
        <path
            class="line"
            d={lineGenerator(data)}
            fill="none"
            stroke="currentColor"
            stroke-width="2"
        />

        <!-- Data Point Circles -->
        {#each data as point, i}
            <circle
                class="data-point"
                cx={xScale(i)}
                cy={yScale(point.total)}
                r="4"
                fill="currentColor"
            />
        {/each}
    </svg>
</div>

<style>
    .chart {
        width: 100%;
        margin: 0 auto;
    }

    svg {
        position: relative;
        width: 100%;
        height: 350px;
    }

    .line {
        fill: none;
        stroke-width: 2;
    }

    .data-point {
        fill: currentColor;
    }
</style>
