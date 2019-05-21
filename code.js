d3.csv("data1.csv", // 1.a Connect to the data
    function(d) {
      return {
        country: d.country,
        valA: +d.valA,
        valB: +d.valB,
        valC: +d.valC
      }
    })
  .then(function(dataset) { // 1.c Do stuff with the data

    console.log(dataset);

    // ---- VARIABLES --------------------------------------------------

    // 2. Set up variables

    var w = 500;
    var h = 500;
    var padding = 60;

    // ---- SCALES AND AXES --------------------------------------------

    // 3. Create scales

    var xScale = d3.scaleBand()
      // 3.a. Set the domain to the countries
      .domain(dataset.map(
        function(d) {
          return d.country;
        }
      ))
      .rangeRound([padding, w - padding])
      .paddingInner(0.05);

    var yScale = d3.scaleBand()
      // 3.b. Set the domain to the values
      .domain(dataset.map(function(d) {
        return d.country;
      }))
      .rangeRound([padding, h - padding])
      .paddingInner(0.05);

    var zScale = d3.scaleLinear()
      // 3.b. Set the domain to the values
      .domain([0, d3.max(dataset,
        function(d) {
          return d.valC;
        })])
      .range([padding, w - padding]);

    // 4. Define axes.

    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);
    var zAxis = d3.axisBottom(zScale);

    // ---- START BUILDING! --------------------------------------------

    // 5. Create SVG and generate axes.

    // 5.a. Create SVG
    var svg = d3.select("#chart")
      .append("svg")
      .attr("width", w)
      .attr("height", h);


    // 5.b. Create Axes
    //		svg.append("g")
    //			.attr("class", "bottomAxis")
    //			.attr("transform", "translate(0," + (h - padding) + ")")
    //			.call(xAxis);

    svg.append("g")
      .attr("class", "leftAxis")
      .attr("transform", "translate(" + padding + ",0)")
      .call(yAxis);


    // Button bars at the top
    for (var i = 0; i < d3.selectAll(dataset).size(); i++) {
      var Button = d3.select("#TheButtons")
      d3.select("#TheButtons")
        .append("button")
        .attr("type", "button")
        .attr("class", function(d) {
          return 'button' + i;
        })
        .text(function(d) {
          console.log(dataset[i].country);
          return dataset[i].country;
        })
    }

    function updateSliderText() {
      document.getElementById('sliderData').innerHTML = document.getElementById("slider").value;

      //console.log("updateSliderText has Run!");
      //console.log("Slider value" + document.getElementById("slider").value);
    }

    d3.select("#slider").on("change", function() {
      console.log("Slider updated!");

      updateSliderText()

    })

    d3.select("body")
      .style("background-color", "rgb(240,240,240)")

    // 6. Create bars
    var circlesOne = svg.selectAll("circles")
      .data(dataset)
      .enter()
      .append("circle")
      .attr("class", "circle")
      .attr("cy", function(d, i) {
        return yScale(d.country) + yScale.bandwidth() / 2;
      })
      .attr("cx", w / 4)
      .attr("r", function(d) {
        return 4 * Math.sqrt((d.valA) / (2 * Math.PI))
      })
      .attr("fill", function(d, i) {
        // 6.a. Set fill colour based on data.
        return "rgba(" + 1.5 * (d.valA + 100) + "," + 0 + "," + 0 + "," + 0.5 + ")"
      });

    var circlesTwo = svg.selectAll("circlesTwo")
      .data(dataset)
      .enter()
      .append("circle")
      .attr("class", "circle")
      .attr("cy", function(d, i) {
        return yScale(d.country) + yScale.bandwidth() / 2;
      })
      .attr("cx", 2 * (w / 4))
      .attr("r", function(d) {
        return 4 * Math.sqrt((d.valB) / (2 * Math.PI))
      })
      .attr("fill", function(d, i) {
        // 6.a. Set fill colour based on data.
        return "rgb(" + 0 + "," + 1.5 * (d.valB + 100) + "," + 0 + "," + 0.5 + ")"
      });

    var circlesThree = svg.selectAll("circlesThree")
      .data(dataset)
      .enter()
      .append("circle")
      .attr("class", "circle")
      .attr("cy", function(d, i) {
        return yScale(d.country) + yScale.bandwidth() / 2;
      })
      .attr("cx", 3 * (w / 4))
      .attr("r", function(d) {
        return 4 * Math.sqrt((d.valC) / (2 * Math.PI))
      })
      .attr("fill", function(d, i) {
        // 6.a. Set fill colour based on data.
        return "rgb(" + 0 + "," + 0 + "," + 1.5 * (d.valC + 100) + "," + 0.5 + ")"
      });

    // 7. Create Labels

    var labelsOne = svg.selectAll("labelsOne")
      .data(dataset)
      .enter()
      .append("text")
      .attr("class", "label")
      .text(function(d, i) {
        return d.valA
        // 7.a. Set text value
      })
      .attr("y", function(d, i) {
        return yScale(d.country) + 6 + yScale.bandwidth() / 2;
      })
      .attr("x", 1 * (w / 4))

      .attr("text-anchor", "middle")
      .attr("font-family", "IBM Plex Sans")
      .attr("font-size", "16px")
      .attr("fill", "white");

    var labelsTwo = svg.selectAll("labelsTwo")
      .data(dataset)
      .enter()
      .append("text")
      .attr("class", "label")
      .text(function(d, i) {
        return d.valB
        // 7.a. Set text value
      })
      .attr("y", function(d, i) {
        return yScale(d.country) + 6 + yScale.bandwidth() / 2;
      })
      .attr("x", 2 * (w / 4))

      .attr("text-anchor", "middle")
      .attr("font-family", "IBM Plex Sans")
      .attr("font-size", "16px")
      .attr("fill", "white");

    var labelsThree = svg.selectAll("labelsThree")
      .data(dataset)
      .enter()
      .append("text")
      .attr("class", "label")
      .text(function(d, i) {
        return d.valC
        // 7.a. Set text value
      })
      .attr("y", function(d, i) {
        return yScale(d.country) + 6 + yScale.bandwidth() / 2;
      })
      .attr("x", 3 * (w / 4))

      .attr("text-anchor", "middle")
      .attr("font-family", "IBM Plex Sans")
      .attr("font-size", "16px")
      .attr("fill", "white");

    d3.select("#Isolate").on("click", function() {
      console.log("Clicked Isolate!");

      labelsOne
        .transition()
        .duration(820)
        .ease(d3.easeBackInOut)
        .attr("fill", "white");

      labelsTwo
        .transition()
        .duration(820)
        .ease(d3.easeBackInOut)
        .attr("fill", "white");

      labelsThree
        .transition()
        .duration(820)
        .ease(d3.easeBackInOut)
        .attr("fill", "white");

      circlesOne
        .transition()
        .duration(820)
        .ease(d3.easeBackInOut)
        .attr("r", function(d) {
          return 4 * Math.sqrt((d.valA) / (2 * Math.PI))
        })
        .attr("cx", 1 * (w / 4))

      circlesTwo
        .transition()
        .duration(820)
        .ease(d3.easeBackInOut)
        .attr("r", function(d) {
          return 4 * Math.sqrt((d.valB) / (2 * Math.PI))
        })
        .attr("cx", 2 * (w / 4))

      circlesThree
        .transition()
        .duration(820)
        .ease(d3.easeBackInOut)
        .attr("r", function(d) {
          return 4 * Math.sqrt((d.valC) / (2 * Math.PI))
        })
        .attr("cx", 3 * (w / 4))

    }) // Isolate Clicked Changed

    d3.select("#Compare").on("click", function() {
      console.log("Clicked Compare!");

      labelsOne
        .transition()
        .duration(820)
        .ease(d3.easeBackInOut)
        .attr("fill", "transparent");

      labelsTwo
        .transition()
        .duration(820)
        .ease(d3.easeBackInOut)
        .attr("fill", "transparent");

      labelsThree
        .transition()
        .duration(820)
        .ease(d3.easeBackInOut)
        .attr("fill", "transparent");

      circlesOne
        .transition()
        .duration(820)
        .ease(d3.easeBackInOut)
        .attr("r", function(d) {
          return 6 * Math.sqrt((d.valA) / (2 * Math.PI))
        })
        .attr("cx", (w / 2))

      circlesTwo
        .transition()
        .duration(820)
        .ease(d3.easeBackInOut)
        .attr("r", function(d) {
          return 6 * Math.sqrt((d.valB) / (2 * Math.PI))
        })
        .attr("cx", (w / 2))

      circlesThree
        .transition()
        .duration(820)
        .ease(d3.easeBackInOut)
        .attr("r", function(d) {
          return 6 * Math.sqrt((d.valC) / (2 * Math.PI))
        })
        .attr("cx", (w / 2))

    }) // Compare Clicked Changed

    d3.select("#Australia").on("click", function() {
      console.log("Clicked Compare!");

      labelsOne
        .transition()
        .duration(820)
        .ease(d3.easeBackInOut)
        .attr("fill", "transparent");

      labelsTwo
        .transition()
        .duration(820)
        .ease(d3.easeBackInOut)
        .attr("fill", "transparent");

      labelsThree
        .transition()
        .duration(820)
        .ease(d3.easeBackInOut)
        .attr("fill", "transparent");

      circlesOne
        .transition()
        .duration(820)
        .ease(d3.easeBackInOut)
        .attr("r", function(d) {
          return 6 * Math.sqrt((d.valA) / (2 * Math.PI))
        })
        .attr("cx", (w / 2))

      circlesTwo
        .transition()
        .duration(820)
        .ease(d3.easeBackInOut)
        .attr("r", function(d) {
          return 6 * Math.sqrt((d.valB) / (2 * Math.PI))
        })
        .attr("cx", (w / 2))

      circlesThree
        .transition()
        .duration(820)
        .ease(d3.easeBackInOut)
        .attr("r", function(d) {
          return 6 * Math.sqrt((d.valC) / (2 * Math.PI))
        })
        .attr("cx", (w / 2))

    }) // Compare Clicked Changed

  });


  function createForceSimulation() {
    forceSimulation = d3.forceSimulation()
      .force("x", forces.combine.x)
      .force("y", forces.combine.y)
      .force("collide", d3.forceCollide(forceCollide));
    forceSimulation.nodes(countries)
      .on("tick", function() {
        circles
          .attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; });
      });
  }
