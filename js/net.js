function drawChart(data) {

/// Processing data ///
var links = [];
var nodes_raw = [];

for (var i = 0; i < data.length; i++) {
  var l = {"source": "x", "target": "x", "value":"x", "year":"x"}
  l.source = data[i].source;
  l.target = data[i].target;
  l.value = data[i].value;
  l.year = data[i].category;
  links.push(l)
}

for (var j = 0; j < data.length; j++) {
  var n = {
    "category":"x",
    "id":"x",
    "fraction":{
      "0":"x",
      "1":"x",
      "2":"x",
      "3":"x",
      "4":"x",
      "5":"x",
      "6":"x",
      "7":"x",
      "8":"x",
      "9":"x",
      "10":"x",
      "11":"x",
      "12":"x",
      "13":"x",
      "14":"x",
      "15":"x",
      "16":"x",
      "17":"x",
      "18":"x",
      "19":"x"
    }
  }

  n["category"] = data[j].category;
  n["id"] = data[j].source;
  n["fraction"]["0"] = data[j].cero;
  n["fraction"]["1"] = data[j].uno;
  n["fraction"]["2"] = data[j].dos;
  n["fraction"]["3"] = data[j].tres;
  n["fraction"]["4"] = data[j].cuatro;
  n["fraction"]["5"] = data[j].cinco;
  n["fraction"]["6"] = data[j].seis;
  n["fraction"]["7"] = data[j].siete;
  n["fraction"]["8"] = data[j].ocho;
  n["fraction"]["9"] = data[j].nueve;
  n["fraction"]["10"] = data[j].diez;
  n["fraction"]["11"] = data[j].duno;
  n["fraction"]["12"] = data[j].ddos;
  n["fraction"]["13"] = data[j].dtres;
  n["fraction"]["14"] = data[j].dcuatro;
  n["fraction"]["15"] = data[j].dcinco;
  n["fraction"]["16"] = data[j].dseis;
  n["fraction"]["17"] = data[j].dsiete;
  n["fraction"]["18"] = data[j].docho;
  n["fraction"]["19"] = data[j].dnueve;

  nodes_raw.push(n);
}

for (var k = 0; k < data.length; k++) {
  var m = {
    "category":"x",
    "id":"x",
    "fraction":{
      "0":"x",
      "1":"x",
      "2":"x",
      "3":"x",
      "4":"x",
      "5":"x",
      "6":"x",
      "7":"x",
      "8":"x",
      "9":"x",
      "10":"x",
      "11":"x",
      "12":"x",
      "13":"x",
      "14":"x",
      "15":"x",
      "16":"x",
      "17":"x",
      "18":"x",
      "19":"x"
    }
  }

  m["id"] = data[k].target;
  n["category"] = data[k].category;
  m["fraction"]["0"] = data[k].cero;
  m["fraction"]["1"] = data[k].uno;
  m["fraction"]["2"] = data[k].dos;
  m["fraction"]["3"] = data[k].tres;
  m["fraction"]["4"] = data[k].cuatro;
  m["fraction"]["5"] = data[k].cinco;
  m["fraction"]["6"] = data[k].seis;
  m["fraction"]["7"] = data[k].siete;
  m["fraction"]["8"] = data[k].ocho;
  m["fraction"]["9"] = data[k].nueve;
  m["fraction"]["10"] = data[k].diez;
  m["fraction"]["11"] = data[k].duno;
  m["fraction"]["12"] = data[k].ddos;
  m["fraction"]["13"] = data[k].dtres;
  m["fraction"]["14"] = data[k].dcuatro;
  m["fraction"]["15"] = data[k].dcinco;
  m["fraction"]["16"] = data[k].dseis;
  m["fraction"]["17"] = data[k].dsiete;
  m["fraction"]["18"] = data[k].docho;
  m["fraction"]["19"] = data[k].dnueve;

  nodes_raw.push(m);
}

function removeDuplicates(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
        return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
}

var nodes = removeDuplicates(nodes_raw,"id")

var graph = {"nodes":nodes,"links":links};

// Uncomment to see the JSON file on screen => WARNING!!! Large file
// document.getElementById("json").innerHTML = JSON.stringify(graph, undefined, 2);

var width = 650,
    height = 550;

// // var color = d3.scaleOrdinal(d3.schemeCategory20);
// var color = d3.scaleOrdinal(d3.schemeCategory10);
var color = d3.scaleOrdinal() // D3 Version 4
  .domain(20)
  .range(["#FF0000", "#009933" , "#0000FF"]);

/// Settings ///
var svg = d3.select("svg")
    width = +svg.attr("width"),
    height = +svg.attr("height"),
    color = d3.scaleOrdinal(color);

    svg
     .attr('viewBox','0 0 '+Math.min(width)+' '+Math.min(height))
     .attr("preserveAspectRatio", "xMinYMin meet");

var L = 115;
var slider_size = 0.7*width;
var left_margin = 0.5*(width - slider_size);

var x = d3.scaleLinear()
    .domain([0,L])
    .range([left_margin, slider_size + left_margin])
    .clamp(true);

var slider = svg.append("g")
    .attr("transform", "translate(15,"+(height-50)+")");

slider.append("line")
    .attr("class", "track")
    .attr("x1", x.range()[0])
    .attr("x2", x.range()[1])
    .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-inset")
    .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-overlay")
    .call(d3.drag()
        .on("start.interrupt", function() { slider.interrupt(); })
        .on("start drag", function() { return hue(x.invert(d3.event.x)); }));

var years = d3.range(0,20,1)
var dx = L/(years.length-1)
var xticks = d3.range(0,L+dx,dx)

slider.insert("g", ".track-overlay")
    .attr("class", "ticks")
    .attr("transform", "translate(0," + 25 + ")")
  .selectAll("text")
  .data(xticks)
  .enter().append("text")
    .attr("x", x)
    .attr("text-anchor", "middle")
    .text(function(d,i) { return years[i]; });

var handle = slider.insert("circle", ".track-overlay")
    .attr("class", "handle")
    .attr("r", 9)
    .attr("cx", x.range()[0]);

function hue(h) {
  handle.attr("cx", x(h));
}

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}

/// GRAPH ///
var maxDistance = 50, //max distance between two nodes
  minDistance = 20, //min distance betwween two nodes
  maxRadius = 3, //max radius of circle
  minRadius = 3, //min radius of circle
  minLinkwidth = 1, //min width of link
  maxLinkwidth = 1 //max width of link

var [maxConnect, maxFraction] = getnetworkProp(graph);

var nodes = graph.nodes,
  nodeById = d3.map(nodes, function(d) {
    return d.id;
  }),
  links = graph.links,
  value = links.map(function(d) {
    return d.value
  }),

  l = []
links.forEach(function(link) {
  var s = nodeById.get(link.source),
    t = nodeById.get(link.target),
    v = link.value,
    y = link.year;

  l.push({
    source: s,
    target: t,
    year: y,
    value: v
  });
});

links = l

simulation = d3.forceSimulation(nodes)

simulation.force("charge", d3.forceManyBody())
  .force("link", d3.forceLink(links))
  .force('center', d3.forceCenter(width/10, height/2))
  .force('collide', d3.forceCollide(function (d) { return d.value / 2; }))
  .alphaTarget(0)
  .on("tick", ticked);

// var g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + 0.45 * height + ")"),
var g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + 0 * height + ")"),
  link = g.append("g").attr("stroke", "#000").attr("stroke-width", 1).selectAll(".link"),
  node = g.append("g").attr("stroke", "#fff").attr("stroke-width", 1).selectAll(".node");

restart();

d3.interval(function() {
  restart();
}, 50)


function restart() {

  var current_year = years[Math.round(x.invert(jQuery(".handle").attr("cx")) / dx)];
  //get "radius" of each node for current_year
  var fraction = graph.nodes.map(function(d) {
    return d.fraction
  }).map(function(d) {
    return d[current_year.toString()];
  })

  // Apply the general update pattern to the nodes.
  node = node.data(nodes, function(d) {
    return d.id;
  });
  node.exit().remove();
  node = node.enter().append("circle")
    .attr("class", "node")
    .attr("fill", function(d) { return color(d.category); })
    .merge(node)
    .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended));

  node.append("title")
    .text(function(d) {
      return d.id;
    });

  //apply transition to radii of nodes
  node.transition()
    .duration(5)
    .attr("r", function(d) {
      return Math.max(minRadius, d.fraction[current_year.toString()] / maxFraction * maxRadius * 2.5);
    })

  // Apply the general update pattern to the links
  links_filtered = links.filter(function(d) {
    return d.year == current_year;
  });
  link = link.data(links_filtered, function(d) {
    return d.source.id + "-" + d.target.id;
  });
  link.exit().remove();
  link = link.enter()
    .append("line")
    .attr("class", "link")
    .merge(link);

  //define transition to width of edges
  link.transition()
    .duration(50)
    .attr("stroke-width", function(d, i) {
      return Math.max(minLinkwidth, d.value / maxConnect * maxLinkwidth * 1.5);
    })

  // Update and restart the simulation.
  simulation.nodes(nodes);
  simulation.force("link").links(links)
  simulation.force("link", d3.forceLink(links)
    .distance(function(d) {
      if (d.year == current_year) {
        return Math.min(maxConnect / d.value * minDistance, maxDistance);
      } else {
        return maxDistance;
      }
    })
  )

  // simulation.alpha(0.005).restart();
  simulation.alpha(0).restart();
}

//this function defines position of nodes and links
//at each "simulation time step"
function ticked() {
  node.attr("cx", function(d) {
      return d.x;
    })
    .attr("cy", function(d) {
      return d.y;
    })

  link.attr("x1", function(d) {
      return d.source.x;
    })
    .attr("y1", function(d) {
      return d.source.y;
    })
    .attr("x2", function(d) {
      return d.target.x;
    })
    .attr("y2", function(d) {
      return d.target.y;
    });
}

//this function calculates properties of network
//(i.e., max connection between nodes, max fraction value of node)
function getnetworkProp(graph) {
  //1) max connection between nodes
  var maxConnect = Math.max.apply(Math, graph.links.map(function(d) {
    return d.value;
  })); //max connection between nodes

  //2) max fraction value (used to draw nodes radii)
  var maxFraction = 0;
  var arr, obj, maxf;
  for (i = 0; i < graph.nodes.length; i++) {
    obj = graph.nodes[i].fraction
    arr = Object.keys(obj).map(function(key) {
      return obj[key];
    });
    maxf = Math.max.apply(null, arr);
    maxFraction = Math.max(maxFraction, maxf);
  }
  return [maxConnect, maxFraction];
}


}; ////////////////////////////////// D3 - END //////////////////////////////////

////////////////////////////////// Tabletop //////////////////////////////////
var red = '1r40v-U_LnGxETANZ1lo9ie9-Spxu6PuN3mPlEbm4c8E'
var options = { key: red, simpleSheet: true, callback: draw }
function renderSpreadsheetData() { Tabletop.init(options) }
function draw(data, tabletop) { drawChart(data) }
renderSpreadsheetData();
////////////////////////////////// Tabletop - END//////////////////////////////////
