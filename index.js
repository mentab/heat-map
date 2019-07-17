const w = 1000;
const h = 500;
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
	.then((data) => {

		const dataset = data.monthlyVariance;

		console.log(dataset);

		// const years = d3.map(dataset, function (d) { return d.year; }).keys();
		// const months = d3.map(dataset, function (d) { return d.month; }).keys();

		const colorScale = d3.scaleLinear()
			.domain(d3.extent(dataset, (d) => d.variance))
			.range(['blue', 'red']);

		const xScale = d3.scaleBand()
			.domain(d3.extent(dataset, (d) => d.year))
			.range([m, w - m]);

		const yScale = d3.scaleBand()
			.domain(d3.extent(dataset, (d) => d.month))
			.range([m, h - m]);

		svg.selectAll('rect')
			.data(dataset)
			.enter()
			.append('rect')
			.attr('x', (d) => d.year)
			.attr('y', (d) => d.month)
			.attr('width', 2)
			.attr('height', 10)
			.attr('fill', (d) => colorScale(d.variance));

		const xAxis = d3.axisBottom(xScale);

		const yAxis = d3.axisLeft(yScale);

		svg.append('g')
			.attr('transform', 'translate(0,' + (h - m) + ')')
			.attr('id', 'x-axis')
			.call(xAxis);

		svg.append('g')
			.attr('transform', 'translate(' + m + ', 0)')
			.attr('id', 'y-axis')
			.call(yAxis);
	});