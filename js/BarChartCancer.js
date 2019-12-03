var margin = {top: 30, right: 60, bottom: 70, left: 60},
    width = 800 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg2 = d3.select("#my_dataviz2")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Parse the Data
d3.csv("https://raw.githubusercontent.com/MarcHerbert/csv/master/BarChartCancer.csv", function(data) {

// X axis
var x = d3.scaleBand()
  .range([ 0, width ])
  .domain(data.map(function(d) { return d.Country; }))
  .padding(0.2);
svg2.append("g")
  .attr('transform', `translate(0, ${height})`)
  .call(d3.axisBottom(x))
  .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end")
    .style("fill", "Black")
    .style("font-size", 16+ "px");

    

// Add Y axis
var y = d3.scaleLinear()
  .range([height, 0])
  .domain([200, 500]);
svg2.append("g")
  .call(d3.axisLeft(y))
  .selectAll("text")
    .style("fill", "Black");
  
const makeYLines = () => d3.axisLeft()
.scale(y)

svg2.append('g')
.attr('class', 'grid')
.call(makeYLines()
  .tickSize(-width, 0, 0)
  .tickFormat('')
)
// Bars
svg2.selectAll("mybar")
  .data(data)
  .enter()
  .append("rect")
    .attr("x", function(d) { return x(d.Country); })
    .attr("y", function(d) { return y(d.Value); })
    .attr("width", x.bandwidth())
    .attr("height", function(d) { return height - y(d.Value); })
    .attr("fill", "#69b3a2")

    svg2
    .append('text')
    .attr('class', 'label')
    .attr('x', -(height / 2) )
    .attr('y', -50)
    .attr('transform', 'rotate(-90)')
    .attr('text-anchor', 'middle')
    .text('Age-Standardised Cancer Diagnosis per 100,000')
    .style("fill", "Black")
  
  svg2.append('text')
    .attr('class', 'label')
    .attr('x', width / 2)
    .attr('y', 500)
    .attr('text-anchor', 'middle')
    .text('Country')
    .style("fill", "Black")
  
  svg2.append('text')
    .attr('class', 'title')
    .attr('x', width / 2 )
    .attr('y', -10)
    .attr('text-anchor', 'middle')
    .text('Age-Standardised Cancer Rates per Country')
    .style("fill", "Black")

})

