var margina = {top: 30, right: 30, bottom: 30, left: 60},
    widtha = 800 - margina.left - margina.right,
    heighta = 500 - margina.top - margina.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", widtha + margina.left + margina.right)
    .attr("height", heighta + margina.top + margina.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margina.left + "," + margina.top + ")");

//Read the data
d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv",

  // When reading the csv, I must format variables:
  function(d){
    return { date : d3.timeParse("%Y-%m-%d")(d.date), value : d.value }
  },

  // Now I can use this dataset:
  function(data) {

    // Add X axis --> it is a date format
    var x = d3.scaleTime()
      .domain(d3.extent(data, function(d) { return d.date; }))
      .range([ 0, widtha ]);
    xAxis = svg.append("g")
      .attr("transform", "translate(0," + heighta + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
        .style("fill", "Black");

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return +d.value; })])
      .range([ heighta, 0 ]);
    yAxis = svg.append("g")
      .call(d3.axisLeft(y))
      .selectAll("text")
        .style("fill", "Black");

    // Add a clipPath: everything out of this area won't be drawn.
    var clip = svg.append("defs").append("svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("width", widtha )
        .attr("height", heighta )
        .attr("x", 0)
        .attr("y", 0);

    // Add brushing
    var brush = d3.brushX()                   // Add the brush feature using the d3.brush function
        .extent( [ [0,0], [widtha,heighta] ] )  // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
        .on("end", updateChart)               // Each time the brush selection changes, trigger the 'updateChart' function

    // Create the area variable: where both the area and the brush take place
    var area = svg.append('g')
      .attr("clip-path", "url(#clip)")

    // Create an area generator
    var areaGenerator = d3.area()
      .x(function(d) { return x(d.date) })
      .y0(y(0))
      .y1(function(d) { return y(d.value) })

    // Add the area
    area.append("path")
      .datum(data)
      .attr("class", "myArea")  // I add the class myArea to be able to modify it later on.
      .attr("fill", "#69b3a2")
      .attr("fill-opacity", .4)
      .attr("stroke", "black")
      .attr("stroke-width", 2)
      .attr("d", areaGenerator )

    // Add the brushing
    area
      .append("g")
        .attr("class", "brush")
        .call(brush);

    // A function that set idleTimeOut to null
    var idleTimeout
    function idled() { idleTimeout = null; }

    // A function that update the chart for given boundaries
    function updateChart() {

      // What are the selected boundaries?
      extent = d3.event.selection

      // If no selection, back to initial coordinate. Otherwise, update X axis domain
      if(!extent){
        if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
        x.domain([ 4,8])
      }else{
        x.domain([ x.invert(extent[0]), x.invert(extent[1]) ])
        area.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
      }

      // Update axis and area position
      xAxis.transition().duration(1000).call(d3.axisBottom(x))
      area
          .select('.myArea')
          .transition()
          .duration(1000)
          .attr("d", areaGenerator)
    }

    // If user double click, reinitialize the chart
    svg.on("dblclick",function(){
      x.domain(d3.extent(data, function(d) { return d.date; }))
      xAxis.transition().call(d3.axisBottom(x))
      area
        .select('.myArea')
        .transition()
        .attr("d", areaGenerator)
    });

    svg
    .append('text')
    .attr('class', 'label')
    .attr('x', -(heighta / 2) )
    .attr('y', -50)
    .attr('transform', 'rotate(-90)')
    .attr('text-anchor', 'middle')
    .text('People Diagnosed with Cancer')
    .style("fill", "Black")
  
  svg.append('text')
    .attr('class', 'label')
    .attr('x', widtha / 2)
    .attr('y', 500)
    .attr('text-anchor', 'middle')
    .text('Year')
    .style("fill", "Black")
  
  svg.append('text')
    .attr('class', 'title')
    .attr('x', widtha / 2 )
    .attr('y', 0)
    .attr('text-anchor', 'middle')
    .text('Cancer Diagnoses over time')
    .style("fill", "Black")

})