const formatMonth = d3.timeFormat("%B");

const w = 1400;
const h = 600;
const m = 50;

const content = d3.select('.content');

content.append('h1')
	.attr('id', 'title')
	.text('Monthly Global Land-Surface Temperature');

content.append('h2')
	.attr('id', 'description')
	.text('1753 - 2015: base temperature 8.66℃');

const tooltip = content.append('div')
	.attr('id', 'tooltip')
	.style('position', 'absolute')
	.style('opacity', 0);

const svg = content.append('svg')
	.attr('width', w)
	.attr('height', h);

const legend = svg.append('g')
	.attr('id', 'legend');

d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json')
	.then(data => {

		const dataset = data.monthlyVariance;

		console.log(dataset);

		const years = d3.map(dataset, d => d.year).keys();
		const months = d3.map(dataset, d => d.month).keys();

		const min = d3.min(dataset, d => d.variance);
		const max = d3.max(dataset, d => d.variance);
		const middle = min + max / 2;

		const colorScale = d3.scaleLinear()
			.domain([min, middle, max])
			.range(['blue', 'yellow', 'red']);

		const xScale = d3.scaleBand()
			.domain(years)
			.range([m, w - m]);

		const yScale = d3.scaleBand()
			.domain(months)
			.range([m, h - m]);

		svg.selectAll('rect')
			.data(dataset)
			.enter()
			.append('rect')
			.attr('x', d => xScale(d.year))
			.attr('y', d => yScale(d.month))
			.attr('width', xScale.bandwidth())
			.attr('height', yScale.bandwidth())
			.attr('fill', d => colorScale(d.variance));

		const xAxis = d3.axisBottom(xScale)
			.tickValues(years.filter(year => year % 10 === 0));

		const yAxis = d3.axisLeft(yScale)
			.tickFormat(month => formatMonth(new Date(0).setMonth(month - 1)));

		svg.append('g')
			.attr('transform', 'translate(0,' + (h - m) + ')')
			.attr('id', 'x-axis')
			.call(xAxis);

		svg.append('g')
			.attr('transform', 'translate(' + m + ', 0)')
			.attr('id', 'y-axis')
			.call(yAxis);
	});