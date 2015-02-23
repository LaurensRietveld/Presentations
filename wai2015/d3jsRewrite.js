// http://blog.thomsonreuters.com/index.php/mobile-patent-suits-graphic-of-the-day/


var triples = [
//	{sub: "vu:webinformation", pred:"a", obj:"vu:Course"},
//	{sub: "vu:webinformation", pred:"skos:prefLabel", obj:"'Web Information'@en"},
//	{sub: "uva:ks2010", pred:"a", obj:"uva:Cursus"},
//	{sub: "uva:ks2010", pred:"skos:prefLabel", obj:"'Kennissystemen'@nl"},
//	{sub: "vu:rinke_hoekstra", pred:"a", obj:"foaf:Person "},
//	{sub: "vu:rinke_hoekstra", pred:"vu:teaches", obj:"vu:webinformation"},
//	{sub: "uva:rinke_hoekstra", pred:"a", obj:"uva:Persoon"},
//	{sub: "uva:rinke_hoekstra", pred:"owl:sameAs", obj:"vu:rinke_hoekstra"},
//	{sub: "vu:Course", pred:"rdfs:subClassOf", obj:"au:Course"},
//	{sub: "uva:Cursus", pred:"rdfs:subClassOf", obj:"au:Course"},
	{sub: "R1", pred:"P1", obj:"R3"},
	{sub: "R1", pred:"P1", obj:"R2"},
	{sub: "R2", pred:"P3", obj:"L1"},
	{sub: "R2", pred:"P2", obj:"R4"},
	{sub: "R4", pred:"P3", obj:"L1"},
	{sub: "R4", pred:"P1", obj:"R5"},
];


var drawOriginalRdf = function(svgId, hideLabel) {
	if (!svgId) svgId = "#d3jsOrig";
	$(svgId).html("");
//	return;
	var svg = d3.select(svgId);
//	.attr("width", width)
//	.attr("height", height);
	var links = [];
	var nodes = {};
	predicates = {};//easier, to make predicate list unique
	for (var i = 0; i < triples.length; i++) {
		var triple = triples[i];
		links.push({source: triple.sub, target: triple.obj, type: triple.pred});
		predicates[triple.pred] = true;
	}
	predicates = Object.keys(predicates);
	
	links.forEach(function(link) {
	  link.source = nodes[link.source] || (nodes[link.source] = {name: link.source});
	  link.target = nodes[link.target] || (nodes[link.target] = {name: link.target});
	});
	
	draw(svg, nodes, links, predicates, hideLabel);
};
//var predicates;
//var nodes;
//var links;
var drawSimple = function() {
	drawOriginalRdf("#d3jsRewrite", true);
};
var drawWithout = function() {
	$("#d3jsRewrite").html("");
//	return;
	var svg = d3.select("#d3jsRewrite");
	var links = [];
	var nodes = {};
	predicates = {};//easier, to make predicate list unique
	for (var i = 0; i < triples.length; i++) {
		var triple = triples[i];
		if (triple.obj.charAt(0) != "L") {
			links.push({source: triple.sub, target: triple.obj, type: triple.pred});
			predicates[triple.pred] = true;
		}
	}
	predicates = Object.keys(predicates);
	
	links.forEach(function(link) {
	  link.source = nodes[link.source] || (nodes[link.source] = {name: link.source});
	  link.target = nodes[link.target] || (nodes[link.target] = {name: link.target});
	});
	draw(svg, nodes, links, predicates, true);
};
var drawUnique = function() {
	$("#d3jsRewrite").html("");
//	return;
	var svg = d3.select("#d3jsRewrite");
	var links = [];
	var nodes = {};
	predicates = {};//easier, to make predicate list unique
	for (var i = 0; i < triples.length; i++) {
		var triple = triples[i];
			if (triple.obj.charAt(0) == "L") {
				links.push({source: triple.sub, target: [triple.sub, triple.pred, triple.obj].join("-"), type: triple.pred});
			} else {
				links.push({source: triple.sub, target: triple.obj, type: triple.pred});
			}
			predicates[triple.pred] = true;
	}
	predicates = Object.keys(predicates);
	
	links.forEach(function(link) {
	  link.source = nodes[link.source] || (nodes[link.source] = {name: link.source});
	  link.target = nodes[link.target] || (nodes[link.target] = {name: link.target});
	});
	draw(svg, nodes, links, predicates, true);
};
var drawContext = function() {
	$("#d3jsRewrite").html("");
//	return;
	var svg = d3.select("#d3jsRewrite");
	var links = [];
	var nodes = {};
	predicates = {};//easier, to make predicate list unique
	for (var i = 0; i < triples.length; i++) {
		var triple = triples[i];
		if (triple.obj.charAt(0) == "L") {
			links.push({source: triple.sub, target: [triple.pred, triple.obj].join("-"), type: triple.pred});
		} else {
			links.push({source: triple.sub, target: triple.obj, type: triple.pred});
		}
		predicates[triple.pred] = true;
	}
	predicates = Object.keys(predicates);
	
	links.forEach(function(link) {
		link.source = nodes[link.source] || (nodes[link.source] = {name: link.source});
		link.target = nodes[link.target] || (nodes[link.target] = {name: link.target});
	});
	draw(svg, nodes, links, predicates, true);
};
var drawPath = function() {
	$("#d3jsRewrite").html("");
//	return;
	var svg = d3.select("#d3jsRewrite");
	var links = [];
	var nodes = {};
	predicates = {};//easier, to make predicate list unique
	var allTriples = {};
	for (var i = 0; i < triples.length; i++) {
		
		var triple = triples[i];
		allTriples[[triple.sub, triple.pred, triple.obj].join("-")] = {name: [triple.sub, triple.pred, triple.obj].join("-")};
//		allTriples.push([triple.sub, triple.pred, triple.obj].join("-"));
		for (var j = 0; j < triples.length; j++) {
			var jTriple = triples[j];
			if (triple.obj == jTriple.sub) {
				//we have a link
//				links.push({source: {name:[triple.sub, triple.pred, triple.obj].join("-")}, target: {name:[jTriple.sub, jTriple.pred, jTriple.obj].join("-")}, type: triple.pred});
				links.push({source: [triple.sub, triple.pred, triple.obj].join("-"), target: [jTriple.sub, jTriple.pred, jTriple.obj].join("-"), type: triple.pred});
			}
		}
//		if (triple.obj.charAt(0) == "L") {
//			links.push({source: triple.sub, target: [triple.pred, triple.obj].join("-"), type: triple.pred});
//		} else {
//			links.push({source: triple.sub, target: triple.obj, type: triple.pred});
//		}
		predicates[triple.pred] = true;
	}
	predicates = Object.keys(predicates);
	
	links.forEach(function(link) {
//		if (!nodes[link.source]) nodes[link.source] = {name: link.source};
//		if (!nodes[link.target]) nodes[link.target] = {name: link.target};
		link.source = nodes[link.source] || (nodes[link.source] = {name: link.source});
		link.target = nodes[link.target] || (nodes[link.target] = {name: link.target});
	});
//	console.log(nodes);
//	var nodes = {};
	draw(svg, nodes, links, predicates, true);
};


var draw = function(svg, nodes, links, predicates, hideLabel) {
	var height = svg.style("height").match(/(\d+).*/)[1];
	var width = svg.style("width").match(/(\d+).*/)[1];
	var force = d3.layout.force()
	    .nodes(d3.values(nodes))
	    .links(links)
	    .size([width, height])
	    .linkDistance(300)
	    .charge(-600)
	    .on("tick", tick)
	    .start();
	
	
	// Per-type markers, as they don't inherit styles. These are the actual arrow ends
	svg.append("svg:defs").selectAll("marker")
	    .data(predicates)
	  .enter().append("svg:marker")
	    .attr("id", String)
	    .attr("viewBox", "0 -5 10 10")
	    .attr("refX", 15)
	    .attr("refY", -1.5)
	    .attr("markerWidth", 12)
	    .attr("markerHeight", 12)
	    .attr("orient", "auto")
	  .append("svg:path")
	    .attr("d", "M0,-5L10,0L0,5");
	
	//draw actual edges
	var path = svg.append("svg:g").selectAll("path")
	    .data(force.links());
	path
	  .enter().append("svg:path")
	    .attr("id", function(d) { return d.source.index + "_" + d.target.index; })
	    .attr("class", function(d) { return "link " + d.type; })
	    .attr("marker-end", function(d) { return "url(#" + d.type + ")"; })
	//    .attr("markerWidth", 55)
	//    .attr("markerHeight", 55)
	    ;
//	console.log(path.exit());
//	path.update().remove();
	
	//draw circle
	var circle = svg.append("svg:g").selectAll("circle")
	    .data(force.nodes());
	circle.enter().append("svg:circle")
	    .attr("r", 12)
	    .call(force.drag);
	
	var text = svg.append("svg:g").selectAll("g")
	    .data(force.nodes())
	  .enter().append("svg:g");
	
	// A copy of the text with a thick white stroke for legibility.
	text.append("svg:text")
	    .attr("x", 8)
	    .attr("y", ".31em")
	    .attr("class", "shadow")
	    .text(function(d) { return d.name; });
	
	text.append("svg:text")
	    .attr("x", 8)
	    .attr("y", ".31em")
	    .text(function(d) { return d.name; });
	
	
	//link name
	if (!hideLabel) {
		var path_label = svg.append("svg:g").selectAll(".path_label")
		    .data(force.links())
		  .enter().append("svg:text")
		    .attr("class", "path_label")
		    .append("svg:textPath")
		      .attr("startOffset", "50%")
		      .attr("text-anchor", "middle")
		      .attr("xlink:href", function(d) { return "#" + d.source.index + "_" + d.target.index; })
		      .style("fill", "#000")
		      .style("font-family", "Arial")
		      .text(function(d) { return d.type; });
	}
	
	// Use elliptical arc path segments to doubly-encode directionality.
	function tick() {
	  path.attr("d", function(d) {
	    var dx = d.target.x - d.source.x,
	        dy = d.target.y - d.source.y,
	        dr = Math.sqrt(dx * dx + dy * dy);
	    return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
	  });
	
	  circle.attr("transform", function(d) {
	    return "translate(" + d.x + "," + d.y + ")";
	  });
	
	  text.attr("transform", function(d) {
	    return "translate(" + d.x + "," + d.y + ")";
	  });
	}
};

/**
 * initialize buttons
 */
$("<button>draw simple</button>").on("click", drawSimple).appendTo("body");
$("<button>draw without literals</button>").on("click", drawWithout).appendTo("body");
$("<button>draw with unique literals</button>").on("click", drawUnique).appendTo("body");
$("<button>draw with context literals</button>").on("click", drawContext).appendTo("body");
$("<button>draw as path</button>").on("click", drawPath).appendTo("body");
//initialize everything
$(document).ready(function () {
	drawOriginalRdf();
});
