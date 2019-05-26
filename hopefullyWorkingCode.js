d3.csv("data.csv", // 1.a Connect to the data
    function(d) {
      return {
        Country: d.Country,
        Income: +d.Income,
        EcoLoss: +d.EcoLoss * 10000,
        HumanLoss: +d.HumanLoss * 100,
        EcoTop: +d.EcoTop,
        HumanTop: +d.HumanTop,
        type: 0
      };

      //    var numNodes = 68;
      //    var nodes = d3.range(numNodes).map(function(d, i) {
      //      return {
      //        radius: Math.random() * 22,
      //        category: i % scale,
      //        top: i % 3,
      //        income: i % 3,
      //        name: i % 8,
      //        type: i % 2,
      //        years: i & 12
      //      };
      //    });

      // 1.b Prepare the data
    })
  .then(function(dataset) { // 1.c Do stuff with the data

    console.log(dataset);

    var numDataPoints = dataset.length;

    var width = 600,
      height = 400,
      paddingLarge = 100,
      paddingSmall = 32,
      paddingChart = 50,
      scale = 3;

    var greenColors = [
      "rgba(25,164,86,0.3)",
      "rgba(25,164,86,0.6)",
      "rgba(25,164,86,0.9)",
      "rgba(0, 0, 0, 0.4)"
    ];

    var redColors = [
      "rgba(164,58,25,0.3)",
      "rgba(164,58,25,0.6)",
      "rgba(164,58,25,0.9)",
      "rgba(0, 0, 0, 0.4)"
    ];

    var forces,
      forceSimulation;

    createSVG();
    makeTheEcoCircles();
    makeTheHumanCircles();
    mayTheForceBe();
    createForceSimulationEco();
    createForceSimulationHuman();
    addGroupingListeners();

    function createSVG() {
      svg = d3.select("#content")
        .append("svg")
        .attr("width", width + paddingLarge)
        .attr("height", height + paddingLarge);
    }

    function makeTheEcoCircles() {
      //  var formatPopulation = d3.format(",");
      circlesEco = svg.selectAll("circleEco")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("class", "ECO")
        .attr("r", function(d) {
          if (d.EcoLoss <= 0) {
            return Math.sqrt(50 / Math.PI);
          } else {
            return Math.sqrt(d.EcoLoss / Math.PI);
          }
        })
        .attr("fill", function(d) {
          if (d.EcoLoss <= 0) {
            return "rgba(0, 0, 0, 0.2)";
          } else {
            return greenColors[d.Income];
          }
        })
        .on("mouseover", function(d) {
          console.log(d.Country);
          updateCountryInfo(d.Country + " has " + d.EcoLoss + " Eco Loss");
        })
        .on("mouseout", function(d) {
          updateCountryInfo();
        });

      function updateCountryInfo(number) {
        d3.select("#HoverInfo")
          .text(function(d) {
            return number;
          });
      }
    }

    function makeTheHumanCircles() {

      circlesHuman = svg.selectAll("circleHuman")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("class", "ECO")
        .attr("r", function(d) {
          if (d.HumanLoss <= 0) {
            return Math.sqrt(100 / Math.PI);
          } else {
            return Math.sqrt(d.HumanLoss / Math.PI);
          }
        })
        .attr("fill", function(d) {
          if (d.EcoLoss <= 0) {
            return "rgba(0, 0, 0, 0.2)";
          } else {
            return redColors[d.Income];
          }
        })
        .on("mouseover", function(d) {
          console.log(d.Country);
          updateCountryInfo(d.Country + " has " + d.HumanLoss + " Human Loss");
        })
        .on("mouseout", function(d) {
          updateCountryInfo();
        });

      function updateCountryInfo(number) {
        d3.select("#HoverInfo")
          .text(function(d) {
            return number;
          });
      }
    }


    function mayTheForceBe() {
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
          x: d3.forceX(centerForceX).strength(forceStrength),
          y: d3.forceY(centerForceY).strength(forceStrength)
        };

        function centerForceX(d) {
          if (document.getElementById("EcoLoss").checked == true) {
            if (d.EcoLoss == 0) {
              return width / 2;
            } else {
              return width * 2;
            }
          } else if (document.getElementById("HumanLoss").checked == true) {
            if (d.HumanLoss == 1) {
              return width / 2;
            } else {
              return width * 2;
            }
          } else {
            return width / 2;
          }
        }

        function centerForceY(d) {
          if (document.getElementById("EcoLoss").checked == true) {
            if (d.Income == 0) {
              return height / 2;
            } else {
              return height * 2;
            }
          } else if (document.getElementById("HumanLoss").checked == true) {
            if (d.Income == 1) {
              return height / 2;
            } else {
              return height * 2;
            }
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
        return {
          x: d3.forceX(incomeBracketForceX).strength(forceStrength),
          y: d3.forceY(incomeBracketForceY).strength(forceStrength)
        };

        function incomeBracketForceX(d) {
          if (document.getElementById("EcoLoss").checked == true) {
            if (d.EcoLoss == 0) {
              if (d.income == "0") {
                return left(width);
              } else if (d.income == 1) {
                return center(width);
              } else if (d.income == 2) {
                return right(width);
              } else {
                return width * 20 * Math.random();
              }
            } /* END of (d.type == 0) */
            else {
              return width * 20 * Math.random();
            }
          } /* END of if */
          else if (document.getElementById("HumanLoss").checked == true) {
            if (d.HumanLoss == 1) {
              if (d.income == "0") {
                return left(width);
              } else if (d.income == 1) {
                return center(width);
              } else if (d.income == 2) {
                return right(width);
              } else {
                return width * 20 * Math.random();
              }
            } /* END of (d.type == 1) */
            else {
              return width * 20 * Math.random();
            }
          } /* END of Else if */
          else {
            if (d.income == "0") {
              return left(width);
            } else if (d.income == 1) {
              return center(width);
            } else if (d.income == 2) {
              return right(width);
            } else {
              return width * 20 * Math.random();
            }
          } /* END of Else */
        }

        function incomeBracketForceY(d) {
          if (document.getElementById("EcoLoss").checked == true) {
            if (d.EcoLoss == 0) {
              if (d.income == 0) {
                return top(height);
              } else if (d.income == 1) {
                return middle(height);
              } else if (d.income == 2) {
                return bottom(height);
              } else {
                return height * 20 * Math.random();
              }
            } /* END of (d.type == 0) */
            else {
              return height * 20 * Math.random();
            }
          } /* END of if */
          else if (document.getElementById("HumanLoss").checked == true) {
            if (d.HumanLoss == 1) {
              if (d.income == 0) {
                return top(height);
              } else if (d.income == 1) {
                return middle(height);
              } else if (d.income == 2) {
                return bottom(height);
              } else {
                return height * 20 * Math.random();
              }
            } /* END of (d.type == 1) */
            else {
              return height * 20 * Math.random();
            }
          } /* END of Else if */
          else {
            if (d.income == 0) {
              return top(height);
            } else if (d.income == 1) {
              return middle(height);
            } else if (d.income == 2) {
              return bottom(height);
            } else {
              return height * 20 * Math.random();
            }
          } /* END of Else */
        }

        function left(dimension) {
          return dimension / 6;
        }

        function center(dimension) {
          return dimension / 2;
        }

        function right(dimension) {
          return (dimension / 6) * 5;
        }

        function top(dimension) {
          return (dimension) / 2;
        }

        function middle(dimension) {
          return (dimension) / 2;
        }

        function bottom(dimension) {
          return (dimension) / 2;
        }

        function off(dimension) {
          return dimension * 2;
        }
      }

      function sortTopCountriesForce() {
        var sortTopCountriesStrength = 0.05;
        return {
          x: d3.forceX(TopCountriesForceX).strength(sortTopCountriesStrength),
          y: d3.forceY(TopCountriesForceY).strength(sortTopCountriesStrength)
        };

        function TopCountriesForceX(d) {
          if (document.getElementById("EcoLoss").checked == true) {
            if (d.EcoLoss == 0) {
              if (d.top > 1) {
                return width / 2;
              } else {
                return width * 20 * Math.random();
              }
            } else {
              return width * 20 * Math.random();
            }
          } /* END of if */
          else if (document.getElementById("HumanLoss").checked == true) {
            if (d.HumanLoss == 1) {
              if (d.top > 1) {
                return width / 2;
              } else {
                return width * 20 * Math.random();
              }
            } else {
              return width * 20 * Math.random();
            }
          } /* END of Else if */
          else {
            if (d.top > 1) {
              return width / 2;
            } else {
              return width * 20 * Math.random();
            }
          } /* END of Else */
        }

        function TopCountriesForceY(d) {
          if (document.getElementById("EcoLoss").checked == true) {
            if (d.EcoLoss == 0) {
              if (d.top > 1) {
                return height / 2;
              } else {
                return height * 20 * Math.random();
              }
            } else {
              return height * 20 * Math.random();
            }
          } /* END of if */
          else if (document.getElementById("HumanLoss").checked == true) {
            if (d.HumanLoss == 1) {
              if (d.top > 1) {
                return height / 2;
              } else {
                return height * 20 * Math.random();
              }
            } else {
              return height * 20 * Math.random();
            }
          } /* END of Else if */
          else {
            if (d.top > 1) {
              return height / 2;
            } else {
              return height * 20 * Math.random();
            }
          } /* END of Else */
        }
      }
    }

    //  updateCircles();
    function createForceSimulationHuman() {

          forceSimulationHuman = d3.forceSimulation()
            .force("x", forces.center.x)
            .force("y", forces.center.y)
            .force('collision',
              d3.forceCollide()
              .radius(function(d) {
                if (d.HumanLoss <= 0) {
                  return Math.sqrt(100 / Math.PI);
                } else {
                  return Math.sqrt(d.HumanLoss / Math.PI) + 2;
                }
              }));

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

    function createForceSimulationEco() {

      forceSimulationEco = d3.forceSimulation()
        .force("x", forces.center.x)
        .force("y", forces.center.y)
        .force('collision',
          d3.forceCollide()
          .radius(function(d) {
            if (d.EcoLoss <= 0) {
              return Math.sqrt(100 / Math.PI);
            } else {
              return Math.sqrt(d.EcoLoss / Math.PI) + 2;
            }
          }));

      forceSimulationEco.nodes(dataset)
        .on("tick", function() {
          circlesEco
            .attr("cx", function(d) {
              return d.x;
            })
            .attr("cy", function(d) {
              return d.y;
            });
        });
    }

    function addGroupingListeners() {
      addListener("#Home", forces.center);
      addListener("#none", forces.center);
      addListener("#IncomeBracket", forces.sortIncomeBracket);
      addListener("#TopCountries", forces.sortTopCountries);
      addListener("#Bar", forces.barScatter);


      function addListener(selector, forces) {
        d3.select(selector).on("click", function() {
          if (selector == "#Home") {
            document.getElementById("EcoLoss").checked = false;
            document.getElementById("HumanLoss").checked = false;
          } else {}
          updateEcoForces(forces);
          updateHumanForces(forces);
        });
      }

      function updateEcoForces(forces) {
        forceSimulationEco
          .force("x", forces.x)
          .force("y", forces.y)
          .force('collision',
            d3.forceCollide()
            .radius(function(d) {
              if (d.EcoLoss <= 0) {
                return Math.sqrt(100 / Math.PI);
              } else {
                return Math.sqrt(d.EcoLoss / Math.PI) + 2;
              }
            }))
          .alphaTarget(0.5)
          .restart();
      }
      function updateHumanForces(forces) {

          forceSimulationHuman
            .force("x", forces.x)
            .force("y", forces.y)
            .force('collision',
              d3.forceCollide()
              .radius(function(d) {
                if (d.HumanLoss <= 0) {
                  return Math.sqrt(100 / Math.PI);
                } else {
                  return Math.sqrt(d.HumanLoss / Math.PI) + 2;
                }
              }))
            .alphaTarget(0.5)
            .restart();
      }
    }

    var xScale = d3.scaleBand()
      // 3.a. Set the domain to the countries
      .domain(dataset.map(
        function(d) {
          return d.years;
        }
      ))
      .rangeRound([paddingSmall, width - paddingSmall])
      .paddingInner(0.05);


    var yScale = d3.scalePow()
      // 3.b. Set the domain to the s
      .exponent(1)
      .domain([0, d3.max(dataset,
        function(d) {
          return d.EcoLoss;
        })])
      .range([height - paddingSmall, paddingSmall]);


    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);

    d3.select("#Bar").on("click", function() {

      updateEcoForces(forces.barScatter);
      updateHumanForces(forces.barScatter);

      bars
        .transition().duration(420)
        .ease(d3.easeBackInOut)
        .attr("fill", "rgba(209, 238, 27, 0.6)");

      graphLabels
        .transition()
        .duration(840)
        .ease(d3.easeBackInOut)
        .attr("fill", "black")
        .attr("x", function(d, i) {
          return xScale(d.years) + xScale.bandwidth() / 2;
        });


      axisX
        .transition()
        .duration(210)
        .ease(d3.easeBackInOut)
        .attr("transform", "translate(0," + 368 + ")");

      axisY
        .transition()
        .duration(210)
        .ease(d3.easeExpInOut)
        .attr("transform", "translate(" + paddingSmall + ",0)");

    });

    var axisX = svg.append('g')
      .attr("class", "bottomAxis")
      .attr("transform", "translate(0," + 500 + ")")
      .call(xAxis);
    var axisY = svg.append("g")
      .attr("class", "leftAxis")
      .attr("transform", "translate(" + 0 + ",0)")
      .call(yAxis);

    var bars = svg.selectAll(".bar")
      .data(dataset)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", function(d, i) {
        return xScale(d.years);
      })
      .attr("y", function(d, i) {
        return yScale(d.EcoLoss);
      })
      .attr("width", xScale.bandwidth())
      .attr("height", function(d, i) {
        return height - yScale(d.EcoLoss) - paddingSmall;
      })
      .attr("fill", "rgba(209, 238, 27, 0)");

    var graphLabels = svg.selectAll(".label")
      .data(dataset)
      .enter()
      .append("text")
      .attr("class", "label")
      .text(function(d, i) {
        return d3.format(",.2r")(d.EcoLoss);
        // 7.a. Set text economic
      })
      .attr("x", -10)
      .attr("y", function(d, i) {
        return yScale(d.EcoLoss) + 20;
      })
      .attr("text-anchor", "middle")
      .attr("font-family", "sans-serif")
      .attr("font-size", "10px")
      .attr("fill", "white");

  });
