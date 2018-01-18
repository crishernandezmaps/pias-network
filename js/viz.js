/////// GRAPH ////////
//user-defined parameters
var maxDistance = 300, //max distance between two nodes
  minDistance = 10, //min distance betwween two nodes
  maxRadius = 30, //max radius of circle
  minRadius = 8, //min radius of circle
  minLinkwidth = 0, //min width of link
  maxLinkwidth = 6 //max width of link

var [maxConnect, maxFraction] = getnetworkProp(graph);

var nodes = graph.nodes,
  nodeById = d3.map(nodes, function(d) {
    return d.id;
  }), // id: nombre organización
  links = graph.links,
  value = links.map(function(d) {
    return d.value
  }), // value: igual para todos los nodos

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
  .on("tick", ticked);

var g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + 0.45 * height + ")"),
  link = g.append("g").attr("stroke", "#000").attr("stroke-width", 1.5).selectAll(".link"),
  node = g.append("g").attr("stroke", "#fff").attr("stroke-width", 1.5).selectAll(".node");

restart();

d3.interval(function() {
  restart();
}, 150)


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
    .attr("fill", function(d) {
      return color(d.id);
    })
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
    .duration(50)
    .attr("r", function(d) {
      return Math.max(minRadius, d.fraction[current_year.toString()] / maxFraction * maxRadius);
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
      return Math.max(minLinkwidth, d.value / maxConnect * maxLinkwidth);
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

  simulation.alpha(0.4).restart();
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
