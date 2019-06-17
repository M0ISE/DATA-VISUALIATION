d3.csv("data.csv", // 1.a Connect to the data
    function(d) {
      return {
        Country: d.Country,
        Income: +d.Income,
        EcoLoss: +d.EcoLoss,
        HumanLoss: +d.HumanLoss,
        EcoTop: +d.EcoTop,
        HumanTop: +d.HumanTop,
        type: 0
      };
    })
  .then(function(dataset) { // 1.c Do stuff with the data

    console.log(dataset);

    var numDataPoints = dataset.length;

    var width = 500,
      height = 300,
      paddingLarge = 100,
      paddingSmall = 32,
      paddingChart = 50,
      paddingLegend = width / 8,
      scale = 3;

    var greenColors = [
      "rgba(72,224,154,0.3)",
      "rgba(72,224,154,0.6)",
      "rgba(72,224,154,0.9)",
      "rgba(0, 0, 0, 0.4)"
    ];

    var redColors = [
      "rgba(229,16,62,0.3)",
      "rgba(229,16,62,0.6)",
      "rgba(229,16,62,0.9)",
      "rgba(0, 0, 0, 0.4)"
    ];

    var forces,
      forceSimulation,
      forceSimulationEco,
      forceSimulationHuman;

    createSVGLegend();

    function createSVGLegend() {
      svgLegend = d3.select("#legend")
        .append("svg")
        .attr("width", width + paddingLarge)
        .attr("height", height + paddingLarge);
    }

    // CODE OF THIS SECTION IS MODIFIDED FROM THIS SITE: https://bl.ocks.org/lorenzopub/90d90746af84f1fe3d782d47f3739a30

    // The scale you use for bubble size
    var size = d3.scaleSqrt()
      .domain([0, 1]) // What's in the data, let's say it is percentage
      .range([1, 50]); // Size in pixel
    var EcoDataMax = d3.max(dataset, function(d) {
      return d.EcoLoss;
    });
    var valuesToShow = [
      d3.format(",.3r")(Math.abs(EcoDataMax)),
      d3.format(",.3r")(Math.abs(EcoDataMax / 2)),
      d3.format(",.3r")(Math.abs(EcoDataMax / 4))
    ];
    var xCircle = width - paddingLegend;
    var xLabel = width - 16;
    var yCircle = height;

    // Add legend: circles
    svgLegend
      .selectAll("legend")
      .data(valuesToShow)
      .enter()
      .append("circle")
      .attr("cx", xCircle)
      .attr("cy", function(d) {
        return yCircle - size(d);
      })
      .attr("r", function(d) {
        return size(d);
      })
      .style("fill", "transparent")
      .attr("stroke", "rgba(229,16,62,0.9)");

    console.log(valuesToShow);

    // Add legend: Lines
    svgLegend
      .selectAll("legend")
      .data(valuesToShow)
      .enter()
      .append("line")
      .attr('x1', function(d) {
        return xCircle + size(d);
      })
      .attr('x2', xLabel)
      .attr('y1', function(d, i) {
        return yCircle - size(d) + 3 * i;
      })
      .attr('y2', function(d, i) {
        return yCircle - size(d) + 3 * i;
      })
      .attr('stroke', 'rgba(229,16,62,0.9)')
      .style('stroke-dasharray', ('2,2'));

    // Add legend: labels
    svgLegend
      .selectAll("legend")
      .data(valuesToShow)
      .enter()
      .append("text")
      .attr("class", "LegendText")
      .attr('x', xLabel)
      .attr('y', function(d, i) {
        return yCircle - size(d) + 3 * i;
      })
      .text(function(d) {
        return d;
      })
      .style("font-size", 10)
      .style("fill", "rgba(229,16,62,0.9)")
      .attr('alignment-baseline', 'middle');

    d3.select("#showLegend").on("click", function() {

      svgLegend
        .transition()
        .ease(d3.easePolyInOut)
        .attr('y', -100);

    });

  });
