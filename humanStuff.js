/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////  HUMAN   ///  HUMAN   ///  HUMAN
/////////////////////////////////////////////////////////////////////

createSVGHuman();
mayTheHumanForceBe();
makeTheHumanCircles();
createForceSimulationHuman();

function createSVGHuman() {
  svgHuman = d3.select("#HumanContent")
    .append("svg")
    .attr("width", width + paddingLarge)
    .attr("height", height + paddingLarge);
}

function makeTheHumanCircles() {
  circlesHuman = svgHuman.selectAll("Human")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("class", "Human")
    .attr("id", function(d) {
      return d.Income;
    })
    .attr("r", function(d) {
      if (d.HumanLoss <= 0) {
        var dataMean = d3.mean(dataset, function(d) {
          return d.HumanLoss;
        });
        return Math.sqrt((dataMean / 2) / Math.PI) * 8;
      } else {
        return Math.sqrt(d.HumanLoss / Math.PI) * 8;
      }
    })
    .attr("fill", function(d) {
      if (d.HumanLoss == "0") {
        return "transparent";
      } else {
        return redColors[d.Income];
      }
    })
    .attr("stroke", function(d) {
      if (d.HumanLoss == "0") {
        return redColors[d.Income];
      } else {
        return "transparent";
      }
    })
    .attr("stroke-width", 3)
    .on("mouseover", function(d) {
      console.log(d.Country);
      updateCountryInfo(d.Country + " had " + d3.format(",.3r")(d.HumanLoss) + " deaths from natural disasters");
    })
    .on("mouseout", function(d) {
      updateCountryInfo("...");
    });

  function updateCountryInfo(number) {
    d3.select("#HoverInfo")
      .text(number);
    d3.select("#HoverInfo2")
      .text(number);
    d3.select("#HoverInfo3")
      .text(number);
  }
}

function createForceSimulationHuman() {

  forceSimulationHuman = d3.forceSimulation()
    .force("x", forces.center.x)
    .force("y", forces.center.y)
    .force("charge", d3.forceManyBody().strength(-5))
    .force('collision',
      d3.forceCollide().strength(0.5).radius(forceCollideHuman));

  forceSimulationHuman.nodes(dataset)
    .on("tick", function() {
      circlesHuman
        .attr("cx", function(d) {
          return d.x;
        })
        .attr("cy", function(d) {
          return d.y;
        });
    });
}

function updateHumanForces(forces) {
  forceSimulationHuman
    .force("x", forces.x)
    .force("y", forces.y)
    .force('collision',
      d3.forceCollide().radius(forceCollideHuman))
    .alphaTarget(0.5)
    .restart();
}

function forceCollideHuman(d) {
  if (d.HumanLoss <= 0) {
    var dataMean = d3.mean(dataset, function(d) {
      return d.HumanLoss;
    });
    return (Math.sqrt((dataMean / 2) / Math.PI) + 0.8) * 8;
  } else {
    return (Math.sqrt(d.HumanLoss / Math.PI) + 0.8) * 8;
  }
}

function mayTheHumanForceBe() {
  var forceStrength = 0.05;

  forces = {
    center: centerForce(),
    sortIncomeBracket: sortIncomeBracketForce(),
    sortTopCountries: sortTopCountriesForce(),
    barScatter: barScatterForce()
  };

  function barScatterForce() {
    return {
      x: d3.forceX(width / 2).strength(forceStrength),
      y: d3.forceY(-1000).strength(forceStrength)
    };
  }

  function centerForce() {
    return {
      x: d3.forceX(centerForceX).strength(0.005),
      y: d3.forceY(centerForceY).strength(0.005)
    };

    function centerForceX(d) {

      if (this.className == "Eco") {
        console.log(this.className);
        return width * 2;
      } else {
        return width / 2;
      }

    }

    function centerForceY(d) {

      if (this.className == "Eco") {
        console.log(this.className);
        return height * 2 - paddingSmall;
      } else {
        return height / 2;
      }

    }

    function centerScreenForceX() {
      return d3.forceX(width / 2).strength(forceStrength);
    }

    function centerScreenForceY() {
      return d3.forceY(height / 2).strength(forceStrength);
    }

    function offScreenForceX() {
      return d3.forceX(width * 20 * Math.random()).strength(forceStrength);
    }

    function offScreenForceY() {
      return d3.forceY(width * 20 * Math.random()).strength(forceStrength);
    }

  }

  function sortIncomeBracketForce() {
    var sortIncomeBracketStrength = 0.03;
    return {
      x: d3.forceX(incomeBracketForceX).strength(sortIncomeBracketStrength),
      y: d3.forceY(incomeBracketForceY).strength(sortIncomeBracketStrength)
    };

    function incomeBracketForceX(d) {
      if (d.Income == "0") {
        return lowX(width);
      } else if (d.Income == "1") {
        return middleX(width);
      } else if (d.Income == "2") {
        return heighX(width);
      } else if ((d.Income == "3")) {
        return noDataX(width);
      } else {
        return 20 * Math.random();
      }
    }

    function incomeBracketForceY(d) {
      if (d.Income == "0") {
        return lowY(height);
      } else if (d.Income == "1") {
        return middleY(height);
      } else if (d.Income == "2") {
        return heighY(height);
      } else if ((d.Income == "3")) {
        return noDataY(height);
      } else {
        return 20 * Math.random();
      }
    }

    function lowY(dimension) {
      return dimension * (1 / 2);
    }

    function middleY(dimension) {
      return dimension * (1 / 2);
    }

    function heighY(dimension) {
      return dimension * (1 / 2);
    }

    function noDataY(dimension) {
      return dimension - paddingChart;
    }

    function lowX(dimension) {
      return paddingChart;
    }

    function middleX(dimension) {
      return dimension * (1 / 2);
    }

    function heighX(dimension) {
      return dimension - paddingChart;
    }

    function noDataX(dimension) {
      return dimension - paddingChart;
    }
  }

  function sortTopCountriesForce() {
    return {
      x: d3.forceX(TopCountriesForceX).strength(forceStrength),
      y: d3.forceY(TopCountriesForceY).strength(forceStrength)
    };

    function TopCountriesForceX(d) {
      if (d.HumanTop >= 1) {
        return width / 2;
      } else {
        return width * 2;
      }
    }

    function TopCountriesForceY(d) {
      if (d.HumanTop >= 1) {
        return height / 2;
      } else {
        return height * 2;
      }
    }
  }
}
