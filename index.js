const formatMonth = d3.timeFormat("%B");

const w = 1200;
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
		const baseTemp = data.baseTemperature;

		dataset.forEach(d => d.temp = baseTemp + d.variance);

		const years = d3.map(dataset, d => d.year).keys();
		const months = d3.map(dataset, d => d.month).keys();

		const min = d3.min(dataset, d => d.temp);
		const max = d3.max(dataset, d => d.temp);

		const colorArray = [...Array(10)];
		const colors = colorArray.map((color, index) => (index + 1) * (max - min) / (colorArray.length - 1));

		const colorScale = d3.scaleSequential(d3.interpolateReds)
			.domain(d3.extent(dataset, d => d.temp));

		const xScale = d3.scaleBand()
			.domain(years)
			.range([m, w - m]);

		const yScale = d3.scaleBand()
			.domain(months)
			.range([m, h - m]);

		const legendScale = d3.scaleBand()
			.domain(colors)
			.range([450, 750]);

		d3.select('#legend')
			.selectAll('rect')
			.data(colors)
			.enter()
			.append('rect')
			.attr('x', d => legendScale(d))
			.attr('y', 0)
			.attr('width', legendScale.bandwidth())
			.attr('height', 40)
			.attr('fill', d => colorScale(d));

		svg.selectAll('rect')
			.data(dataset)
			.enter()
			.append('rect')
			.attr('x', d => xScale(d.year))
			.attr('y', d => yScale(d.month))
			.attr('width', xScale.bandwidth())
			.attr('height', yScale.bandwidth())
			.attr('fill', d => colorScale(d.temp))
			.attr('class', 'cell')
			.attr('data-month', d => d.month - 1)
			.attr('data-year', d => d.year)
			.attr('data-temp', d => d.temp)
			.on('mouseover', d => {
				tooltip.attr('data-year', d.year)
					.style('left', xScale(d.year) + 'px')
					.style('top', yScale(d.month) + 'px')
					.style('opacity', .9)
					.html(() => `<p>${d.year} : ${d.temp.toFixed(1)}&deg;C</p>`);
			})
			.on('mouseout', function () {
				tooltip.style('opacity', 0)
					.html(() => '');
			});

		const xAxis = d3.axisBottom(xScale)
			.tickValues(years.filter(year => year % 10 === 0));

		const yAxis = d3.axisLeft(yScale)
			.tickFormat(month => formatMonth(new Date(0).setMonth(month - 1)));


		const legendAxis = d3.axisBottom(legendScale)
			.tickFormat(temp => temp.toFixed(2));

		svg.append('g')
			.attr('transform', 'translate(0,' + (h - m) + ')')
			.attr('id', 'x-axis')
			.call(xAxis);

		svg.append('g')
			.attr('transform', 'translate(' + m + ', 0)')
			.attr('id', 'y-axis')
			.call(yAxis);

		svg.append('g')
			.attr('id', 'legend-axis')
			.call(legendAxis);
	});