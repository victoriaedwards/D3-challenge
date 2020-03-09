// @TODO: YOUR CODE HERE!
// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 500;

// Define the chart's margins as an object
var chartMargin = {
  top: 20,
  right: 40,
  bottom: 100,
  left: 100
};

// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area to it, and set the dimensions
var chart = d3.select("#scatter").append("div").classed("chart", true);

var svg = chart.append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Append a group to the SVG area and shift ('translate') it to the right and down to adhere
// to the margins set in the "chartMargin" object.
var chartGroup = svg.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

// Load data 
d3.csv("./assets/data/data.csv").then(function(censusData) {
    console.log(censusData);
  
    censusData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
    });

    var xLinearScale = d3.scaleLinear()
        .range([0, chartWidth]);

    // Configure a linear scale with a range between the chartHeight and 0
    var yLinearScale = d3.scaleLinear()
        .range([chartHeight, 0]);

     // Create two new functions passing the scales in as arguments
    // These will be used to create the chart's axes
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    var xMin;
    var xMax;
    var yMin;
    var yMax;

    xMin = d3.min(censusData, function(data) {
        return data.healthcare;
    });

    xMax = d3.max(censusData, function(data) {
        return data.healthcare;
    });

    yMin = d3.min(censusData, function(data) {
        return data.poverty;
    });

    yMax = d3.max(censusData, function(data) {
        return data.poverty;
    });

    xLinearScale.domain([xMin, xMax]);
    yLinearScale.domain([yMin, yMax]);
    console.log(xMin);
    console.log(yMax);

    // Append an SVG group element to the chartGroup, create the bottom axis inside of it
    // Translate the bottom axis to the bottom of the page
    chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);
    chartGroup.append("g")
        .call(leftAxis)

    //Create circles
    var circlesGroup = chartGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.healthcare +1.5))
    .attr("cy", d => yLinearScale(d.poverty +0.3))
    .attr("r", "11")
    .attr("fill", "blue")
    .attr("opacity", .5)
  
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });
    // Step 1: Initialize Tooltip
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([80, -60])
        .html(function(d) {
            return(abbr + '%')
            });
            
    // Step 2: Create the tooltip in chartGroup.
    circlesGroup.call(toolTip);

    // Step 3: Create "mouseover" event listener to display tooltip
    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data);
      })
    // Step 4: Create "mouseout" event listener to hide tooltip
        .on("mouseout", function(data) {
          toolTip.hide(data);
        });

    chartGroup.append("text")
    .style("font-size", "12px")
    .selectAll("tspan")
    .data(censusData)
    .enter()
    .append("tspan")
        .attr("x", function(data) {
            return xLinearScale(data.healthcare +1.3);
        })
        .attr("y", function(data) {
            return yLinearScale(data.poverty +.1);
        })
        .text(function(data) {
            return data.abbr
        });

    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - chartMargin.left + 40)
        .attr("x", 0 - (chartHeight / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Lacks Healthcare(%)");

    chartGroup.append("text")
        .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + chartMargin.top + 30})`)
        .attr("class", "axisText")
        .text("In Poverty (%)");
    });
