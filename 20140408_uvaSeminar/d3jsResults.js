var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;


//var color = d3.scale.category20();

var x = d3.scale.linear()
.range([0, width]);

var y = d3.scale.linear()
.range([height, 0]);


var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var lineFunction = d3.svg.line()
    .x(function(d) { return x(d.sampleSize); })
    .y(function(d) { return y(d.recall1); })
    .interpolate("linear");


var svgContainer = d3.select("#d3jsResults")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


//draw x axis
svgContainer.append("g")
.attr("class", "x axis")
.attr("transform", "translate(0," + height + ")")
    .call(xAxis);


//add x label
svgContainer.append("text")
.attr("transform", "translate(" + (width) + " ," + (height + margin.bottom - 40) + ")")
.style("text-anchor", "end")
.text("Sample Size");

//draw y axis
svgContainer.append("g")
.attr("class", "y axis")
.call(yAxis);



//add y label
svgContainer.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 6)//offset to right
  .attr("dy", ".71em")
  .style("text-anchor", "end")
  .text("Recall");


d3.tsv("data2.tsv", function(error, data) {
	x.domain(d3.extent(data, function(d) { return d.sampleSize; }));
	y.domain(d3.extent(data, function(d) { return d.recall1; }));


	svgContainer.append("path")
	  .attr("class", "line")
	  .attr("d", lineFunction(data));
 
});
