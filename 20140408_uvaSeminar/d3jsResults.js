var margin = {
	top : 20,
	right : 20,
	bottom : 30,
	left : 50
}, width = 900 - margin.left - margin.right, height = 700 - margin.top
		- margin.bottom, plotWidth = width - 300, plotHeight = height - 200;

var color = d3.scale.category20();

var x = d3.scale.linear().range([ 0, plotWidth ]);

var y = d3.scale.linear().range([ plotHeight, 0 ]);

var xAxis = d3.svg.axis().scale(x).orient("bottom");

var yAxis = d3.svg.axis().scale(y).orient("left");

var lineFunction = d3.svg.line().x(function(d) {
	return x(d.SampleSize);
}).y(function(d) {
	return y(d.recall);
}).interpolate("basis");

var svgContainer = d3.select("#d3jsResults").attr("width",
		width + margin.left + margin.right).attr("height",
		height + margin.top + margin.bottom).append("g").attr("transform",
		"translate(" + margin.left + "," + margin.top + ")");

d3.tsv("allResults.tsv",
		function(error, data) {
			drawSelectionTable(data[0]);
			color.domain(d3.keys(data[0]).filter(function(key) {
				return key !== "SampleSize";
			}));

			var sampleMethods = color.domain().map(function(name) {
				return {
					name : name,
					values : data.map(function(d) {
						// return {sampleSize: d.sampleSize, recall: +d[name]};
						return {
							SampleSize : d.SampleSize,
							recall : +d[name]
						};
					})
				};
			});
			console.log(sampleMethods);
			x.domain(d3.extent(data, function(d) {
				return d.SampleSize;
			}));
			y.domain([ d3.min(sampleMethods, function(c) {
				return d3.min(c.values, function(v) {
					return v.recall;
				});
			}), d3.max(sampleMethods, function(c) {
				return d3.max(c.values, function(v) {
					return v.recall;
				});
			}) ]);

			/**
			 * add legend
			 */
			// console.log("translate(" + (width) + " ," + (height +
			// margin.bottom - 40) + ")");
			var legends = svgContainer.append('g').attr('class', 'legend')
					.attr(
							"transform",
							"translate(35 ," + (0)
									+ ")")
									;
			var legend = legends.selectAll('g').data(sampleMethods).enter()
					.append('g');

			legend.append('rect').attr('x', plotWidth - 20).attr('y',
					function(d, i) {
						return i * 20;
					}).attr('width', 10).attr('height', 10).style('fill',
					function(d) {
						return color(d.name);
					});

			legend.append('text').attr('x', plotWidth - 8).attr('y',
					function(d, i) {
						return (i * 20) + 9;
					}).text(function(d) {
				return d.name.replace(/_/g, " - ");
			});

			// draw x axis
			svgContainer.append("g").attr("class", "x axis").attr("transform",
					"translate(0," + plotHeight + ")").call(xAxis);

			// add x label
			svgContainer.append("text").attr(
					"transform",
					"translate(" + (plotWidth) + " ,"
							+ (plotHeight + margin.bottom - 40) + ")").style(
					"text-anchor", "end").text("Sample Size");

			// draw y axis
			svgContainer.append("g").attr("class", "y axis").call(yAxis);

			// add y label
			svgContainer.append("text").attr("transform", "rotate(-90)").attr(
					"y", 6)// offset to right
			.attr("dy", ".71em").style("text-anchor", "end").text("Recall");

			var sampleMethod = svgContainer.selectAll(".sampleMethod").data(
					sampleMethods).enter().append("g").each(
					function(methodObj) {
						d3.select(this).attr("class",
								"sampleMethod " + methodObj.name);
					});
			;

			sampleMethod.append("path").attr("class", "line").attr("d",
					function(d) {
						return lineFunction(d.values);
					}).style("stroke", function(d) {
				return color(d.name);
			});

			// .each(function() {console.log(this);});
		});

function doStuff() {

	d3.tsv("data.tsv", function(error, data) {

		color.domain(d3.keys(data[0]).filter(function(key) {
			return key !== "SampleSize";
		}));

		var sampleMethods = color.domain().map(function(name) {
			return {
				name : name,
				values : data.map(function(d) {
					// return {sampleSize: d.sampleSize, recall: +d[name]};
					return {
						SampleSize : d.SampleSize,
						recall : +e[name]
					};
				})
			};
		});

		x.domain(d3.extent(data, function(d) {
			return d.SampleSize;
		}));
		y.domain([ d3.min(sampleMethods, function(c) {
			return d3.min(c.values, function(v) {
				return v.recall;
			});
		}), d3.max(sampleMethods, function(c) {
			return d3.max(c.values, function(v) {
				return v.recall;
			});
		}) ]);

		var newparameters = svgContainer.selectAll("g.sampleMethod").data(
				sampleMethods);

		newparameters.select("path.line").transition().ease("linear").duration(
				750).attr("d", function(d) {
			return lineFunction(d.values);
		});
	});
}

function drawSelectionTable(firstTsvRow) {
	if ($("#tableSelection").length > 0) {
		$("#tableSelection").remove();
	}
	var tsvHeaders = Object.keys(firstTsvRow);
	tsvHeaders.sort();
	var table = $("<table></table>");

}
