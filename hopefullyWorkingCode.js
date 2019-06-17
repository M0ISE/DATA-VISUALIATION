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

    var width = 1000,
      height = 600,
      controlStripHeight = 100,
      wayOffScreen = 2000,
      paddingControlStrip = 20,
      paddingLarge = 100,
      paddingSmall = 32,
      paddingChart = 50,
      paddingLegend = width / 6,
      scale = 3,
      legendWidth = 190,
      legendPadding = 20;

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

    /////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////  Splah Screen   ///  Splah Screen   ///  Splah Screen
    ////////////////////////////////////////////////////////////////////

    createSVGEco();
    mayTheEcoForceBe();
    makeTheEcoCircles();
    createForceSimulationEco();
    EcoHoverText();

    createSVGHuman();
    mayTheHumanForceBe();
    makeTheHumanCircles();
    createForceSimulationHuman();
    HumanHoverText();

    createSVGControlStrip();
    makeHomeButton();
    makeSelectionEcoButton();
    makeSelectionHumanButton();
    makeIncomeButton();
    makeTopButton();
    makeLegendButton();

    createSVGLegend();

    createSVGSplash();
    SplahScreenContent();

    var filter = svgEco.append("defs")
      .append("filter")
      .attr("id", "blur")
      .append("feGaussianBlur")
      .attr("stdDeviation", 10);

    function createSVGSplash() {
      svgSplash = d3.select("#SplahScreen")
        .append("svg")
        .attr("width", width + paddingLarge)
        .attr("height", height + paddingLarge)
        .attr('transform', "translate(0," + -((height + paddingLarge) * 3) + ")")
        .on('click', function() {

          svgSplash
            .transition()
            .duration(2000)
            .ease(d3.easePolyInOut)
            .style("opacity", 0)
            .attr('transform', "translate(0," + -wayOffScreen * 4 + ")");

          svgEco
            .attr("filter", "null");
          svgHuman
            .attr("filter", "null");
          svgLegend
            .attr("filter", "null");
          svgControlStrip
            .attr("filter", "null");
        });

      svgEco
        .attr("filter", "url(#blur)");
      svgHuman
        .attr("filter", "url(#blur)");
      svgLegend
        .attr("filter", "url(#blur)");
      svgControlStrip
        .attr("filter", "url(#blur)");
    }

    function SplahScreenContent() {

      // Adding the legend Background
      svgSplash
        .append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", width + paddingLarge)
        .attr("height", height + paddingLarge)
        .attr("rx", 16)
        .attr("ry", 16)
        .attr("fill", "rgba(10, 10, 10, 0.2)")
        .attr("class", "SplahScreenBackground");

      // Adding the Splash TITLE TEXT
      svgSplash
        .append("text")
        .attr("class", "LegendECOText")
        .attr('x', 50)
        .attr('y', height / 1.5)
        .text("Just how much are Natural")
        .style("font-size", 64)
        .style("font-weight", "bold")
        .style("fill", "rgb(10,10,10)")
        .attr('alignment-baseline', 'middle')
        .attr("class", "SplahScreenTitle unselectable");

      svgSplash
        .append("text")
        .attr("class", "LegendECOText")
        .attr('x', 50)
        .attr('y', height / 1.5 + 60)
        .text("Disasters really costing us?")
        .style("font-size", 64)
        .style("font-weight", "bold")
        .style("fill", "rgb(10,10,10)")
        .attr('alignment-baseline', 'middle')
        .attr("class", "SplahScreenTitle unselectable");

      svgSplash
        .append("text")
        .attr("class", "LegendECOText")
        .attr('x', 50)
        .attr('y', height / 1.5 + 80 + paddingSmall)
        .text("When it comes to evaluating the impacts of natural disasters, often only the ")
        .style("font-size", 20)
        .style("font-weight", "bold")
        .style("fill", "rgb(100,100,100)")
        .attr('alignment-baseline', 'middle')
        .attr("class", "SplahScreenTitle unselectable");

      svgSplash
        .append("text")
        .attr("class", "LegendECOText")
        .attr('x', 50)
        .attr('y', height / 1.5 + 80 + paddingSmall + 25)
        .text("economic costs are considered. But what about the impacts on human life ")
        .style("font-size", 20)
        .style("font-weight", "bold")
        .style("fill", "rgb(100,100,100)")
        .attr('alignment-baseline', 'middle')
        .attr("class", "SplahScreenTitle unselectable");

      svgSplash
        .append("text")
        .attr("class", "LegendECOText")
        .attr('x', 50)
        .attr('y', height / 1.5 + 80 + paddingSmall + 50)
        .text(" and human losses experienced?")
        .style("font-size", 20)
        .style("font-weight", "bold")
        .style("fill", "rgb(100,100,100)")
        .attr('alignment-baseline', 'middle')
        .attr("class", "SplahScreenTitle unselectable");

      svgSplash
        .append("text")
        .attr("class", "LegendECOText")
        .attr('x', 50)
        .attr('y', height / 1.5 + 80 + paddingSmall + 100)
        .text("Press anywhere to get started")
        .style("font-size", 12)
        .style("font-weight", "bold")
        .style("fill", "rgba(38, 81, 208,0.8)")
        .attr('alignment-baseline', 'middle')
        .attr("class", "SplahScreenTitle unselectable");

    }

    /////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////  CONTROLSTRIP   ///  CONTROLSTRIP   ///  CONTROLSTRIP
    ////////////////////////////////////////////////////////////////////

    function createSVGControlStrip() {
      svgControlStrip = d3.select("#controlStrip")
        .append("svg")
        .attr("width", width + paddingLarge)
        .attr("height", controlStripHeight);
    }

    function makeHomeButton() {

      // adding the House background
      svgControlStrip
        .selectAll("legend")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("x", paddingControlStrip)
        .attr("y", paddingControlStrip)
        .attr("width", 42)
        .attr("height", 42)
        .attr("fill", "rgba(150, 150, 150, 0.8)")
        .attr("class", "buttonHome unselectable")
        .on('click', function() {

          updateEcoForces(forces.center);
          updateHumanForces(forces.center);

          svgSplash
            .transition()
            .duration(500)
            .ease(d3.easePolyInOut)
            .style("opacity", 100)
            .attr('transform', "translate(0," + -((height + paddingLarge) * 3) + ")");

          svgEco
            .attr("filter", "url(#blur)");
          svgHuman
            .attr("filter", "url(#blur)");
          svgLegend
            .attr("filter", "url(#blur)");

        });

      // adding the House icon
      svgControlStrip
        .append("svg:image")
        .attr("href", "house.svg")
        .attr("width", 22)
        .attr("height", 22)
        .attr("x", paddingControlStrip + 10)
        .attr("y", paddingControlStrip + 10)
        .on('click', function() {

          updateEcoForces(forces.center);
          updateHumanForces(forces.center);

          svgSplash
            .transition()
            .duration(500)
            .ease(d3.easePolyInOut)
            .style("opacity", 100)
            .attr('transform', "translate(0," + -((height + paddingLarge) * 3) + ")");

          svgEco
            .attr("filter", "url(#blur)");
          svgHuman
            .attr("filter", "url(#blur)");
          svgLegend
            .attr("filter", "url(#blur)");
          svgControlStrip
            .attr("filter", "url(#blur)");

        });
    }

    function makeSelectionEcoButton() {
      svgControlStrip
        .selectAll("legend")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("x", paddingControlStrip * 2 + 42)
        .attr("y", paddingControlStrip)
        .attr("width", 150)
        .attr("height", 42)
        .attr("fill", "rgba(72,224,154,0.6)")
        .attr("class", "ButtonSelectEcoRect unselectable")
        .on('click', function() {
          if (svgEco.style("opacity") == "0") {

            updateEcoForces(forces.center);
            updateHumanForces(forces.center);

            svgEco
              .transition()
              .duration(500)
              .ease(d3.easePolyInOut)
              .style("opacity", 100)
              .attr('transform', "translate(0," + -((height + paddingLarge)) + ")");

            svgHuman
              .transition()
              .duration(500)
              .ease(d3.easePolyInOut)
              .style("opacity", 0)
              .attr('transform', "translate(" + -wayOffScreen + "," + -((height + paddingLarge) * 2) + ")");


            d3.selectAll(".ButtonSelectEcoRect")
              .transition()
              .duration(500)
              .ease(d3.easePolyInOut)
              .attr("fill", "rgba(72,224,154,0.6)")
              .attr("stroke", "rgba(150, 150, 150, 0)")
              .attr("stroke-width", 0);

            d3.selectAll(".ButtonSelectEcoText")
              .transition()
              .duration(500)
              .ease(d3.easePolyInOut)
              .style("fill", "rgb(255, 255, 255)");

            d3.selectAll(".ButtonSelectHumanRect")
              .transition()
              .duration(500)
              .ease(d3.easePolyInOut)
              .attr("fill", "rgba(72,224,154,0)")
              .attr("stroke", "rgba(150, 150, 150, 0.8)")
              .attr("stroke-width", 2);

            d3.selectAll(".ButtonSelectHumanText")
              .transition()
              .duration(500)
              .ease(d3.easePolyInOut)
              .style("fill", "rgba(150, 150, 150, 0.8)");


          } else {

            updateEcoForces(forces.center);
            updateHumanForces(forces.center);

            svgEco
              .transition()
              .duration(500)
              .ease(d3.easePolyInOut)
              .style("opacity", 0)
              .attr('transform', "translate(" + -wayOffScreen + "," + -((height + paddingLarge)) + ")");


            svgHuman
              .transition()
              .duration(500)
              .ease(d3.easePolyInOut)
              .style("opacity", 100)
              .attr('transform', "translate(0," + -((height + paddingLarge) * 2) + ")");


            d3.selectAll(".ButtonSelectEcoRect")
              .transition()
              .duration(500)
              .ease(d3.easePolyInOut)
              .attr("fill", "rgba(72,224,154,0)")
              .attr("stroke", "rgba(150, 150, 150, 0.8)")
              .attr("stroke-width", 2);

            d3.selectAll(".ButtonSelectEcoText")
              .transition()
              .duration(500)
              .ease(d3.easePolyInOut)
              .style("fill", "rgba(150, 150, 150, 0.8)");

            d3.selectAll(".ButtonSelectHumanRect")
              .transition()
              .duration(500)
              .ease(d3.easePolyInOut)
              .attr("fill", "rgba(229,16,62,0.9)")
              .attr("stroke", "rgba(150, 150, 150, 0)")
              .attr("stroke-width", 0);

            d3.selectAll(".ButtonSelectHumanText")
              .transition()
              .duration(500)
              .ease(d3.easePolyInOut)
              .style("fill", "rgb(255,255,255)");
          }
        });

      svgControlStrip
        .selectAll("legend")
        .data(dataset)
        .enter()
        .append("text")
        .attr('x', paddingControlStrip * 2 + 42 + 10)
        .attr('y', paddingControlStrip + 22)
        .text("Economic Loss")
        .style("font-size", 16)
        .style("font-weight", "bold")
        .style("fill", "rgb(255,255,255)")
        .attr('alignment-baseline', 'middle')
        .attr("class", "ButtonSelectEcoText unselectable")
        .on('click', function() {
          if (svgEco.style("opacity") == "0") {

            updateEcoForces(forces.center);
            updateHumanForces(forces.center);

            svgEco
              .transition()
              .duration(500)
              .ease(d3.easePolyInOut)
              .style("opacity", 100)
              .attr('transform', "translate(0," + -((height + paddingLarge)) + ")");

            svgHuman
              .transition()
              .duration(500)
              .ease(d3.easePolyInOut)
              .style("opacity", 0)
              .attr('transform', "translate(" + -wayOffScreen + "," + -((height + paddingLarge) * 2) + ")");


            d3.selectAll(".ButtonSelectEcoRect")
              .transition()
              .duration(500)
              .ease(d3.easePolyInOut)
              .attr("fill", "rgba(72,224,154,0.6)")
              .attr("stroke", "rgba(150, 150, 150, 0)")
              .attr("stroke-width", 0);

            d3.selectAll(".ButtonSelectEcoText")
              .transition()
              .duration(500)
              .ease(d3.easePolyInOut)
              .style("fill", "rgb(255, 255, 255)");

            d3.selectAll(".ButtonSelectHumanRect")
              .transition()
              .duration(500)
              .ease(d3.easePolyInOut)
              .attr("fill", "rgba(72,224,154,0)")
              .attr("stroke", "rgba(150, 150, 150, 0.8)")
              .attr("stroke-width", 2);

            d3.selectAll(".ButtonSelectHumanText")
              .transition()
              .duration(500)
              .ease(d3.easePolyInOut)
              .style("fill", "rgba(150, 150, 150, 0.8)");


          } else {

            updateEcoForces(forces.center);
            updateHumanForces(forces.center);

            svgEco
              .transition()
              .duration(500)
              .ease(d3.easePolyInOut)
              .style("opacity", 0)
              .attr('transform', "translate(" + -wayOffScreen + "," + -((height + paddingLarge)) + ")");


            svgHuman
              .transition()
              .duration(500)
              .ease(d3.easePolyInOut)
              .style("opacity", 100)
              .attr('transform', "translate(0," + -((height + paddingLarge) * 2) + ")");


            d3.selectAll(".ButtonSelectEcoRect")
              .transition()
              .duration(500)
              .ease(d3.easePolyInOut)
              .attr("fill", "rgba(72,224,154,0)")
              .attr("stroke", "rgba(150, 150, 150, 0.8)")
              .attr("stroke-width", 2);

            d3.selectAll(".ButtonSelectEcoText")
              .transition()
              .duration(500)
              .ease(d3.easePolyInOut)
              .style("fill", "rgba(150, 150, 150, 0.8)");

            d3.selectAll(".ButtonSelectHumanRect")
              .transition()
              .duration(500)
              .ease(d3.easePolyInOut)
              .attr("fill", "rgba(229,16,62,0.9)")
              .attr("stroke", "rgba(150, 150, 150, 0)")
              .attr("stroke-width", 0);

            d3.selectAll(".ButtonSelectHumanText")
              .transition()
              .duration(500)
              .ease(d3.easePolyInOut)
              .style("fill", "rgb(255,255,255)");
          }
        });
    }

    function makeSelectionHumanButton() {
      svgControlStrip
        .selectAll("legend")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("x", paddingControlStrip * 3 + 42 + 150)
        .attr("y", paddingControlStrip)
        .attr("width", 130)
        .attr("height", 42)
        .attr("fill", "rgba(72,224,154,0)")
        .attr("stroke", "rgba(150, 150, 150, 0.8)")
        .attr("stroke-width", 2)
        .attr("class", "ButtonSelectHumanRect unselectable")
        .on('click', function() {
          if (svgEco.style("opacity") == "0") {

            updateEcoForces(forces.center);
            updateHumanForces(forces.center);

            svgEco
              .transition()
              .duration(500)
              .ease(d3.easePolyInOut)
              .style("opacity", 100)
              .attr('transform', "translate(0," + -((height + paddingLarge)) + ")");

            svgHuman
              .transition()
              .duration(500)
              .ease(d3.easePolyInOut)
              .style("opacity", 0)
              .attr('transform', "translate(" + -wayOffScreen + "," + -((height + paddingLarge) * 2) + ")");


            d3.selectAll(".ButtonSelectEcoRect")
              .transition()
              .duration(500)
              .ease(d3.easePolyInOut)
              .attr("fill", "rgba(72,224,154,0.6)")
              .attr("stroke", "rgba(150, 150, 150, 0)")
              .attr("stroke-width", 0);

            d3.selectAll(".ButtonSelectEcoText")
              .transition()
              .duration(500)
              .ease(d3.easePolyInOut)
              .style("fill", "rgb(255, 255, 255)");

            d3.selectAll(".ButtonSelectHumanRect")
              .transition()
              .duration(500)
              .ease(d3.easePolyInOut)
              .attr("fill", "rgba(72,224,154,0)")
              .attr("stroke", "rgba(150, 150, 150, 0.8)")
              .attr("stroke-width", 2);

            d3.selectAll(".ButtonSelectHumanText")
              .transition()
              .duration(500)
              .ease(d3.easePolyInOut)
              .style("fill", "rgba(150, 150, 150, 0.8)");


          } else {

            updateEcoForces(forces.center);
            updateHumanForces(forces.center);

            svgEco
              .transition()
              .duration(500)
              .ease(d3.easePolyInOut)
              .style("opacity", 0)
              .attr('transform', "translate(" + -wayOffScreen + "," + -((height + paddingLarge)) + ")");


            svgHuman
              .transition()
              .duration(500)
              .ease(d3.easePolyInOut)
              .style("opacity", 100)
              .attr('transform', "translate(0," + -((height + paddingLarge) * 2) + ")");


            d3.selectAll(".ButtonSelectEcoRect")
              .transition()
              .duration(500)
              .ease(d3.easePolyInOut)
              .attr("fill", "rgba(72,224,154,0)")
              .attr("stroke", "rgba(150, 150, 150, 0.8)")
              .attr("stroke-width", 2);

            d3.selectAll(".ButtonSelectEcoText")
              .transition()
              .duration(500)
              .ease(d3.easePolyInOut)
              .style("fill", "rgba(150, 150, 150, 0.8)");

            d3.selectAll(".ButtonSelectHumanRect")
              .transition()
              .duration(500)
              .ease(d3.easePolyInOut)
              .attr("fill", "rgba(229,16,62,0.9)")
              .attr("stroke", "rgba(150, 150, 150, 0)")
              .attr("stroke-width", 0);

            d3.selectAll(".ButtonSelectHumanText")
              .transition()
              .duration(500)
              .ease(d3.easePolyInOut)
              .style("fill", "rgb(255,255,255)");
          }
        });

      svgControlStrip
        .selectAll("legend")
        .data(dataset)
        .enter()
        .append("text")
        .attr('x', paddingControlStrip * 3 + 42 + 10 + 150)
        .attr('y', paddingControlStrip + 22)
        .text("Human Loss")
        .style("font-size", 16)
        .style("font-weight", "bold")
        .style("fill", "rgb(150, 150, 150, 0.8)")
        .attr('alignment-baseline', 'middle')
        .attr("class", "ButtonSelectHumanText unselectable")
        .on('click', function() {
          if (svgEco.style("opacity") == "0") {

            updateEcoForces(forces.center);
            updateHumanForces(forces.center);

            svgEco
              .transition()
              .duration(500)
              .ease(d3.easePolyInOut)
              .style("opacity", 100)
              .attr('transform', "translate(0," + -((height + paddingLarge)) + ")");

            svgHuman
              .transition()
              .duration(500)
              .ease(d3.easePolyInOut)
              .style("opacity", 0)
              .attr('transform', "translate(" + -wayOffScreen + "," + -((height + paddingLarge) * 2) + ")");


            d3.selectAll(".ButtonSelectEcoRect")
              .transition()
              .duration(500)
              .ease(d3.easePolyInOut)
              .attr("fill", "rgba(72,224,154,0.6)")
              .attr("stroke", "rgba(150, 150, 150, 0)")
              .attr("stroke-width", 0);

            d3.selectAll(".ButtonSelectEcoText")
              .transition()
              .duration(500)
              .ease(d3.easePolyInOut)
              .style("fill", "rgb(255, 255, 255)");

            d3.selectAll(".ButtonSelectHumanRect")
              .transition()
              .duration(500)
              .ease(d3.easePolyInOut)
              .attr("fill", "rgba(72,224,154,0)")
              .attr("stroke", "rgba(150, 150, 150, 0.8)")
              .attr("stroke-width", 2);

            d3.selectAll(".ButtonSelectHumanText")
              .transition()
              .duration(500)
              .ease(d3.easePolyInOut)
              .style("fill", "rgba(150, 150, 150, 0.8)");


          } else {

            updateEcoForces(forces.center);
            updateHumanForces(forces.center);

            svgEco
              .transition()
              .duration(500)
              .ease(d3.easePolyInOut)
              .style("opacity", 0)
              .attr('transform', "translate(" + -wayOffScreen + "," + -((height + paddingLarge)) + ")");


            svgHuman
              .transition()
              .duration(500)
              .ease(d3.easePolyInOut)
              .style("opacity", 100)
              .attr('transform', "translate(0," + -((height + paddingLarge) * 2) + ")");


            d3.selectAll(".ButtonSelectEcoRect")
              .transition()
              .duration(500)
              .ease(d3.easePolyInOut)
              .attr("fill", "rgba(72,224,154,0)")
              .attr("stroke", "rgba(150, 150, 150, 0.8)")
              .attr("stroke-width", 2);

            d3.selectAll(".ButtonSelectEcoText")
              .transition()
              .duration(500)
              .ease(d3.easePolyInOut)
              .style("fill", "rgba(150, 150, 150, 0.8)");

            d3.selectAll(".ButtonSelectHumanRect")
              .transition()
              .duration(500)
              .ease(d3.easePolyInOut)
              .attr("fill", "rgba(229,16,62,0.9)")
              .attr("stroke", "rgba(150, 150, 150, 0)")
              .attr("stroke-width", 0);

            d3.selectAll(".ButtonSelectHumanText")
              .transition()
              .duration(500)
              .ease(d3.easePolyInOut)
              .style("fill", "rgb(255,255,255)");
          }
        });
    }

    function makeIncomeButton() {
      svgControlStrip
        .selectAll("legend")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("x", (width + paddingLarge) - paddingControlStrip - paddingControlStrip * 2 - 95 - 135 - 95)
        .attr("y", paddingControlStrip)
        .attr("width", 95)
        .attr("height", 42)
        .attr("fill", "rgba(150, 150, 150, 0.8)")
        .on('click', function(d) {
          return updateEcoForces(forces.sortIncomeBracket) || updateHumanForces(forces.sortIncomeBracket);
        });

      svgControlStrip
        .selectAll("legend")
        .data(dataset)
        .enter()
        .append("text")
        .attr("class", "LegendECOText")
        .attr('x', (width + paddingLarge + 15) - paddingControlStrip - paddingControlStrip * 2 - 95 - 135 - 95)
        .attr('y', paddingControlStrip + 22)
        .text("Income")
        .style("font-size", 16)
        .style("font-weight", "bold")
        .style("fill", "rgb(255,255,255)")
        .attr('alignment-baseline', 'middle')
        .attr("class", "ButtonText unselectable")
        .on('click', function(d) {
          return updateEcoForces(forces.sortIncomeBracket) || updateHumanForces(forces.sortIncomeBracket);
        });
    }

    function makeTopButton() {
      svgControlStrip
        .selectAll("legend")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("x", (width + paddingLarge) - paddingControlStrip - paddingControlStrip - 95 - 135)
        .attr("y", paddingControlStrip)
        .attr("width", 135)
        .attr("height", 42)
        .attr("fill", "rgba(150, 150, 150, 0.8)")
        .on('click', function(d) {
          return updateEcoForces(forces.sortTopCountries) || updateHumanForces(forces.sortTopCountries);
        });

      svgControlStrip
        .selectAll("legend")
        .data(dataset)
        .enter()
        .append("text")
        .attr("class", "LegendECOText")
        .attr("x", (width + paddingLarge + 15) - paddingControlStrip - paddingControlStrip - 95 - 135)
        .attr('y', paddingControlStrip + 22)
        .text("Top Affected")
        .style("font-size", 16)
        .style("font-weight", "bold")
        .style("fill", "rgb(255,255,255)")
        .attr('alignment-baseline', 'middle')
        .attr("class", "ButtonText unselectable")
        .on('click', function(d) {
          return updateEcoForces(forces.sortTopCountries) || updateHumanForces(forces.sortTopCountries);
        });
    }

    function makeLegendButton() {
      svgControlStrip
        .selectAll("legend")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("x", (width + paddingLarge) - paddingControlStrip - 95)
        .attr("y", paddingControlStrip)
        .attr("width", 95)
        .attr("height", 42)
        .attr("fill", "transparent")
        .attr("stroke", "rgba(150, 150, 150, 0.8)")
        .attr("stroke-width", 2)
        .attr("class", "ButtonLegendRect unselectable")
        .on('click', function() {

          if (svgLegend.style("opacity") == 0) {

            svgLegend
              .transition()
              .duration(500)
              .ease(d3.easePolyInOut)
              .style("opacity", 100);

            d3.selectAll(".ButtonLegendText")
              .transition()
              .duration(500)
              .ease(d3.easePolyInOut)
              .style("fill", "rgb(255, 255, 255)");


            d3.selectAll(".ButtonLegendRect")
              .transition()
              .duration(500)
              .ease(d3.easePolyInOut)
              .attr("fill", "rgba(150, 150, 150, 0.8)")
              .attr("stroke-width", 0);

          } else {

            svgLegend
              .transition()
              .duration(500)
              .ease(d3.easePolyInOut)
              .style("opacity", 0);

            d3.selectAll(".ButtonLegendText")
              .transition()
              .duration(500)
              .ease(d3.easePolyInOut)
              .style("fill", "rgb(150, 150, 150)");

            d3.selectAll(".ButtonLegendRect")
              .transition()
              .duration(500)
              .ease(d3.easePolyInOut)
              .attr("fill", "transparent")
              .attr("stroke", "rgba(150, 150, 150, 0.8)")
              .attr("stroke-width", 2);

          }
        });

      svgControlStrip
        .selectAll("legend")
        .data(dataset)
        .enter()
        .append("text")
        .attr("class", "LegendECOText")
        .attr("x", (width + paddingLarge + 15) - paddingControlStrip - 95)
        .attr('y', paddingControlStrip + 22)
        .text("Legend")
        .style("font-size", 16)
        .style("font-weight", "bold")
        .style("fill", "rgb(150, 150, 150)")
        .attr('alignment-baseline', 'middle')
        .attr("class", "ButtonLegendText")
        .on('click', function() {

          if (svgLegend.style("opacity") == 0) {

            svgLegend
              .transition()
              .duration(500)
              .ease(d3.easePolyInOut)
              .style("opacity", 100);

            d3.selectAll(".ButtonLegendText")
              .transition()
              .duration(500)
              .ease(d3.easePolyInOut)
              .style("fill", "rgb(255, 255, 255)");


            d3.selectAll(".ButtonLegendRect")
              .transition()
              .duration(500)
              .ease(d3.easePolyInOut)
              .attr("fill", "rgba(150, 150, 150, 0.8)")
              .attr("stroke-width", 0);

          } else {

            svgLegend
              .transition()
              .duration(500)
              .ease(d3.easePolyInOut)
              .style("opacity", 0);

            d3.selectAll(".ButtonLegendText")
              .transition()
              .duration(500)
              .ease(d3.easePolyInOut)
              .style("fill", "rgb(150, 150, 150)");

            d3.selectAll(".ButtonLegendRect")
              .transition()
              .duration(500)
              .ease(d3.easePolyInOut)
              .attr("fill", "transparent")
              .attr("stroke", "rgba(150, 150, 150, 0.8)")
              .attr("stroke-width", 2);

          }
        });
    }


    /////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////  HUMAN   ///  HUMAN   ///  HUMAN
    /////////////////////////////////////////////////////////////////////

    function createSVGEco() {
      svgEco = d3.select("#EcoContent")
        .append("svg")
        .attr("width", width + paddingLarge)
        .attr("height", height + paddingLarge)
        .attr('transform', "translate(0," + -(height + paddingLarge) + ")");

    }

    function EcoHoverText() {

      console.log("Hello");

      // Adding the HOVER  TEXT
      svgEco
        .append("text")
        .attr("class", "LegendECOText")
        .attr('x', paddingSmall)
        .attr('y', height)
        .text("...")
        .style("font-size", 12)
        .style("fill", "rgb(10,10,10)")
        .attr('alignment-baseline', 'middle')
        .attr("class", "EcoHoverText unselectable");

      console.log("GoodBye");

    }

    function makeTheEcoCircles() {
      circlesEco = svgEco.selectAll("Eco")
        .data(dataset)
        .enter()
        .append("circle")
        .classed(" ", true)
        .attr("class", "Eco")
        .attr("id", function(d) {
          return d.Income;
        })
        .attr("r", function(d) {
          if (d.EcoLoss == "0") {
            var dataMean = d3.mean(dataset, function(d) {
              return d.EcoLoss;
            });
            return Math.sqrt((dataMean / 2) / Math.PI) * 200;
          } else {
            return Math.sqrt(d.EcoLoss / Math.PI) * 200;
          }
        })
        .attr("fill", function(d) {
          if (d.EcoLoss == "0") {
            return "transparent";
          } else {
            return greenColors[d.Income];
          }
        })
        .attr("stroke", function(d) {
          if (d.EcoLoss == "0") {
            return greenColors[d.Income];
          } else {
            return "transparent";
          }
        })
        .attr("stroke-width", 3)
        .on("mouseover", function(d) {
          console.log(d.Country);
          updateCountryInfo(d.Country + " had " + d3.format(",.3r")(d.EcoLoss) + "% of global GDP lost from Natural Disasters");
        })
        .on("mouseout", function(d) {
          updateCountryInfo("...");
        })
        .call(d3.drag()
          .on("start", dragstartedEco)
          .on("drag", draggedEco)
          .on("end", dragendedEco));

      function updateCountryInfo(number) {
        d3.select(".EcoHoverText")
          .text(number);
      }
    }

    function dragstartedEco(d) {
      if (!d3.event.active)
        forceSimulationEco
        .alphaTarget(0.3)
        .restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function draggedEco(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragendedEco(d) {
      if (!d3.event.active)
        forceSimulationEco
        .alphaTarget(0.3);
      d.fx = null;
      d.fy = null;
    }

    function createForceSimulationEco() {
      forceSimulationEco = d3.forceSimulation()
        .force("x", forces.center.x)
        .force("y", forces.center.y)
        .force("charge", d3.forceManyBody().strength(-0.5))
        .force('collision',
          d3.forceCollide().strength(0.5).radius(forceCollideEco));

      forceSimulationEco
        .nodes(dataset)
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

    function updateEcoForces(forces) {
      forceSimulationEco
        .force("x", forces.x)
        .force("y", forces.y)
        .force('collision',
          d3.forceCollide().radius(forceCollideEco))
        .alphaTarget(0.3)
        .restart();
    }

    function forceCollideEco(d) {
      if (d.EcoLoss <= 0) {
        var dataMean = d3.mean(dataset, function(d) {
          return d.EcoLoss;
        });
        return (Math.sqrt((dataMean / 2) / Math.PI) + 0.018) * 200;
      } else {
        return (Math.sqrt(d.EcoLoss / Math.PI) + 0.018) * 200;
      }
    }

    function mayTheEcoForceBe() {
      var forceStrength = 0.03;

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
            return height * 2;
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
          return (dimension - legendWidth) * (1 / 2);
        }

        function heighX(dimension) {
          return dimension - paddingChart - legendWidth;
        }

        function noDataX(dimension) {
          return dimension - paddingChart - legendWidth;
        }
      }

      function sortTopCountriesForce() {
        return {
          x: d3.forceX(TopCountriesForceX).strength(forceStrength),
          y: d3.forceY(TopCountriesForceY).strength(forceStrength)
        };

        function TopCountriesForceX(d) {
          if (d.EcoTop >= 1) {
            return width / 2;
          } else {
            return width * 2;
          }
        }

        function TopCountriesForceY(d) {
          if (d.EcoTop >= 1) {
            return height / 2;
          } else {
            return height * 2;
          }
        }
      }
    }

    /////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////  HUMAN   ///  HUMAN   ///  HUMAN
    /////////////////////////////////////////////////////////////////////

    function createSVGHuman() {
      svgHuman = d3.select("#HumanContent")
        .append("svg")
        .attr("width", width + paddingLarge)
        .attr("height", height + paddingLarge)
        .style("opacity", 0)
        .attr('transform', "translate(" + -wayOffScreen + "," + -(height * 2 + paddingLarge * 2) + ")");

    }

    function HumanHoverText() {

      console.log("Hello");

      // Adding the HOVER  TEXT
      svgHuman
        .append("text")
        .attr('x', paddingSmall)
        .attr('y', height)
        .text("...")
        .style("font-size", 12)
        .style("fill", "rgb(10,10,10)")
        .attr('alignment-baseline', 'middle')
        .attr("class", "HumanHoverText unselectable");

      console.log("GoodBye");

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
          updateCountryInfo(d.Country + " had " + d3.format(",.3r")(d.HumanLoss) + " Deaths from Natural Disasters");
        })
        .on("mouseout", function(d) {
          updateCountryInfo("...");
        })
        .call(d3.drag() // Drag Function based off of code from https://bl.ocks.org/HarryStevens/f636199a46fc4b210fbca3b1dc4ef372
          .on("start", dragstartedHuman)
          .on("drag", draggedHuman)
          .on("end", dragendedHuman));

      function updateCountryInfo(number) {
        d3.select(".HumanHoverText")
          .text(number);
      }
    }

    function dragstartedHuman(d) {
      if (!d3.event.active)
        forceSimulationHuman
        .alphaTarget(0.3)
        .restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function draggedHuman(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragendedHuman(d) {
      if (!d3.event.active)
        forceSimulationHuman
        .alphaTarget(0.3);
      d.fx = null;
      d.fy = null;
    }

    function createForceSimulationHuman() {

      forceSimulationHuman = d3.forceSimulation()
        .force("x", forces.center.x)
        .force("y", forces.center.y)
        .force("charge", d3.forceManyBody().strength(-0.5))
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
        .alphaTarget(0.3)
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
      var forceStrength = 0.03;

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
          return (dimension - legendWidth) * (1 / 2);
        }

        function heighX(dimension) {
          return dimension - paddingChart - legendWidth;
        }

        function noDataX(dimension) {
          return dimension - paddingChart - legendWidth;
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

    /////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////  GroupingListeners   ///  GroupingListeners   ///  GroupingListeners
    /////////////////////////////////////////////////////////////////////



    /////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////  LEGEND   ///  LEGEND   ///  LEGEND
    /////////////////////////////////////////////////////////////////////


    function createSVGLegend() {
      svgLegend = d3.select("#theLegend")
        .append("svg")
        .style("opacity", 0)
        .attr("width", width + paddingLarge)
        .attr("height", height + paddingLarge);

    }

    // The scale you use for bubble size
    var size = d3.scaleSqrt()
      .domain([0, 1]) // What's in the data, let's say it is percentage
      .range([1, 40]); // Size in pixel

    var sizeHuman = d3.scaleSqrt()
      .domain([0, 1]) // What's in the data, let's say it is percentage
      .range([1, 40]); // Size in pixel

    var EcoDataMax = d3.max(dataset, function(d) {
      return d.EcoLoss;
    });
    var HumanDataMax = d3.max(dataset, function(d) {
      return d.HumanLoss;
    });
    var valuesToShow = [
      d3.format(",.2r")(Math.abs(EcoDataMax) / 8),
      d3.format(",.3r")(Math.abs(EcoDataMax / 2)),
      d3.format(",.3r")(Math.abs(EcoDataMax))
    ];
    var valuesToShowHuman = [
      d3.format(",.3r")(Math.abs(HumanDataMax) / 1500),
      d3.format(",.3r")(Math.abs(HumanDataMax / 1000)),
      d3.format(",.3r")(Math.abs(HumanDataMax) / 500)
    ];
    var alpha = [0.3, 0.6, 0.9];
    var xCircle = width - paddingLegend;
    var xLabel = width - 16;
    var yCircle = height - paddingChart;

    // Adding the legend Background
    svgLegend
      .selectAll("legend")
      .data(valuesToShow)
      .enter()
      .append("rect")
      .attr("rx", 10)
      .attr("ry", 10)
      .attr("x", width - paddingLarge - 9)
      .attr("y", 10)
      .attr("width", legendWidth)
      .attr("height", height - 10)
      .attr("fill", "rgba(0, 0, 0, 0.01)")
      .attr("class", "legendBackground");

    // Adding the legend TITLE TEXT
    svgLegend
      .selectAll("legend")
      .data(valuesToShow)
      .enter()
      .append("text")
      .attr("class", "LegendECOText")
      .attr('x', (width - legendWidth) + paddingLarge)
      .attr('y', legendPadding + 18)
      .text("Legend")
      .style("font-size", 20)
      .style("font-weight", "bold")
      .style("fill", "rgb(100,100,100)")
      .attr('alignment-baseline', 'middle')
      .attr("class", "legendMainTitle unselectable");


    /////////////////////////////////// BINCOME LEVELS   ///  INCOME LEVELS   ///  INCOME LEVELS

    // Adding the legend INCOME LEVELS TEXT
    svgLegend
      .selectAll("legend")
      .data(valuesToShow)
      .enter()
      .append("text")
      .attr("class", "LegendECOText")
      .attr('x', (width - legendWidth) + paddingLarge)
      .attr('y', 75)
      .text("Income Levels")
      .style("font-size", 14)
      .style("fill", "rgb(100,100,100)")
      .attr('alignment-baseline', 'middle')
      .attr("class", "legendGreyText unselectable");

    // Adding the GREEN INCOME BOXES
    svgLegend
      .selectAll("legend")
      .data(valuesToShow)
      .enter()
      .append("rect")
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("x", (width - legendWidth) + paddingLarge)
      .attr("y", function(d, i) {
        return 90 + i * 30;
      })
      .attr("width", 20)
      .attr("height", 20)
      .attr("fill", function(d, i) {
        return "rgba(72,224,154," + alpha[i] + ")";
      })
      .attr("class", "legendGreenBoxes");

    // Adding the RED INCOME BOXES
    svgLegend
      .selectAll("legend")
      .data(valuesToShow)
      .enter()
      .append("rect")
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("x", (width - legendWidth) + paddingLarge + 30)
      .attr("y", function(d, i) {
        return 90 + i * 30;
      })
      .attr("width", 20)
      .attr("height", 20)
      .attr("fill", function(d, i) {
        return "rgba(229,16,62," + alpha[i] + ")";
      })
      .attr("class", "legendRedBoxes");

    // Adding the legend INCOME TEXT LOW
    svgLegend
      .selectAll("legend")
      .data(valuesToShow)
      .enter()
      .append("text")
      .attr("class", "LegendECOText")
      .attr('x', (width - legendWidth) + paddingLarge + 60)
      .attr('y', 100)
      .text("Low")
      .style("font-size", 12)
      .style("fill", "rgb(150,150,150)")
      .attr('alignment-baseline', 'middle')
      .attr("class", "legendGreyText unselectable");

    // Adding the legend INCOME TEXT MIDDLE
    svgLegend
      .selectAll("legend")
      .data(valuesToShow)
      .enter()
      .append("text")
      .attr("class", "LegendECOText")
      .attr('x', (width - legendWidth) + paddingLarge + 60)
      .attr('y', 130)
      .text("Middle")
      .style("font-size", 12)
      .style("fill", "rgb(150,150,150)")
      .attr('alignment-baseline', 'middle')
      .attr("class", "legendGreyText unselectable");

    // Adding the legend INCOME TEXT HIGH
    svgLegend
      .selectAll("legend")
      .data(valuesToShow)
      .enter()
      .append("text")
      .attr("class", "LegendECOText")
      .attr('x', (width - legendWidth) + paddingLarge + 60)
      .attr('y', 160)
      .text("High")
      .style("font-size", 12)
      .style("fill", "rgb(150,150,150)")
      .attr('alignment-baseline', 'middle')
      .attr("class", "legendGreyText unselectable");

    /////////////////////////////////// Bubble Categories  ///  Bubble Categories  ///  Bubble Categories

    // Adding the legend INCOME TEXT
    svgLegend
      .selectAll("legend")
      .data(valuesToShow)
      .enter()
      .append("text")
      .attr("class", "LegendECOText")
      .attr('x', (width - legendWidth) + paddingLarge)
      .attr('y', 200)
      .text("Bubble Categories")
      .style("font-size", 14)
      .style("fill", "rgb(100,100,100)")
      .attr('alignment-baseline', 'middle')
      .attr("class", "legendGreyText unselectable");

    // Adding the legend ECOLOSS CIRCLE
    svgLegend
      .selectAll("legend")
      .data(valuesToShow)
      .enter()
      .append("circle")
      .attr("cx", (width - legendWidth) + paddingLarge + 10)
      .attr("cy", 230)
      .attr("r", 10)
      .style("fill", "rgb(72,224,154)")
      .attr("stroke", "transparent")
      .attr("class", "legendCatoEco");

    // Adding the legend ECOLOSS Lines
    svgLegend
      .selectAll("legend")
      .data(valuesToShow)
      .enter()
      .append("line")
      .attr('x1', (width - legendWidth) + paddingLarge)
      .attr('x2', (width - legendWidth) + paddingLarge + 32)
      .attr('y1', 230)
      .attr('y2', 230)
      .attr('stroke', 'rgb(72,224,154)')
      .style('stroke-dasharray', ('2,4'))
      .attr("class", "legendCatoEcoLine");

    // Adding the legend ECOLOSS TEXT
    svgLegend
      .selectAll("legend")
      .data(valuesToShow)
      .enter()
      .append("text")
      .attr("class", "LegendECOText")
      .attr('x', (width - legendWidth) + paddingLarge + 35)
      .attr('y', 230)
      .text("Economic Loss")
      .style("font-size", 12)
      .style("fill", "rgb(72,224,154)")
      .attr('alignment-baseline', 'middle')
      .attr("class", "legendCatoEco unselectable");

    // Adding the legend  HUMAN LOSS  CIRCLE
    svgLegend
      .selectAll("legend")
      .data(valuesToShow)
      .enter()
      .append("circle")
      .attr("cx", (width - legendWidth) + paddingLarge + 10)
      .attr("cy", 255)
      .attr("r", 10)
      .style("fill", "rgb(229,16,62)")
      .attr("stroke", "transparent")
      .attr("class", "legendCatoHuman");

    // Adding the legend HUMAN LOSS Lines
    svgLegend
      .selectAll("legend")
      .data(valuesToShow)
      .enter()
      .append("line")
      .attr('x1', (width - legendWidth) + paddingLarge)
      .attr('x2', (width - legendWidth) + paddingLarge + 32)
      .attr('y1', 255)
      .attr('y2', 255)
      .attr('stroke', 'rgb(229,16,62)')
      .style('stroke-dasharray', ('2,4'))
      .attr("class", "legendCatoHumanLine");

    // Adding the legend  HUMAN LOSS  TEXT
    svgLegend
      .selectAll("legend")
      .data(valuesToShow)
      .enter()
      .append("text")
      .attr("class", "LegendECOText")
      .attr('x', (width - legendWidth) + paddingLarge + 35)
      .attr('y', 255)
      .text("Human Loss")
      .style("font-size", 12)
      .style("fill", "rgb(229,16,62)")
      .attr('alignment-baseline', 'middle')
      .attr("class", "legendCatoHuman unselectable");

    // Adding the legend Income Data Missing CIRCLE
    svgLegend
      .selectAll("legend")
      .data(valuesToShow)
      .enter()
      .append("circle")
      .attr("cx", (width - legendWidth) + paddingLarge + 10)
      .attr("cy", 280)
      .attr("r", 10)
      .style("fill", "rgb(153,153,153)")
      .attr("stroke", "transparent")
      .attr("class", "legendCatoNoData");

    // Adding the legend  Income Data Missing  Lines
    svgLegend
      .selectAll("legend")
      .data(valuesToShow)
      .enter()
      .append("line")
      .attr('x1', (width - legendWidth) + paddingLarge)
      .attr('x2', (width - legendWidth) + paddingLarge + 32)
      .attr('y1', 280)
      .attr('y2', 280)
      .attr('stroke', 'rgb(153,153,153)')
      .style('stroke-dasharray', ('2,4'))
      .attr("class", "legendCatoNoDataLine");

    // Adding the legend  Income Data Missing  TEXT
    svgLegend
      .selectAll("legend")
      .data(valuesToShow)
      .enter()
      .append("text")
      .attr("class", "LegendNODATAText")
      .attr('x', (width - legendWidth) + paddingLarge + 35)
      .attr('y', 280)
      .text("Income Data Missing")
      .style("font-size", 12)
      .style("fill", "rgb(153,153,153)")
      .attr('alignment-baseline', 'middle')
      .attr("class", "legendCatoNoData unselectable");

    // Adding the legend LOSS Data Missing CIRCLE
    svgLegend
      .selectAll("legend")
      .data(valuesToShow)
      .enter()
      .append("circle")
      .attr("cx", (width - legendWidth) + paddingLarge + 10)
      .attr("cy", 305)
      .attr("r", 9)
      .style("fill", "transparent")
      .attr("stroke", "rgb(153,153,153)")
      .attr("stroke-width", 3)
      .attr("class", "legendCatoNoData");

    // Adding the legend LOSS Data Missing  Lines
    svgLegend
      .selectAll("legend")
      .data(valuesToShow)
      .enter()
      .append("line")
      .attr('x1', (width - legendWidth) + paddingLarge + 23)
      .attr('x2', (width - legendWidth) + paddingLarge + 32)
      .attr('y1', 305)
      .attr('y2', 305)
      .attr('stroke', 'rgb(153,153,153)')
      .style('stroke-dasharray', ('2,4'))
      .attr("class", "legendCatoNoDataLine");

    // Adding the legend LOSS Data Missing  TEXT
    svgLegend
      .selectAll("legend")
      .data(valuesToShow)
      .enter()
      .append("text")
      .attr("class", "LegendNODATAText")
      .attr('x', (width - legendWidth) + paddingLarge + 35)
      .attr('y', 305)
      .text("Loss Data Missing")
      .style("font-size", 12)
      .style("fill", "rgb(153,153,153)")
      .attr('alignment-baseline', 'middle')
      .attr("class", "legendCatoNoData unselectable");

    /////////////////////////////////// Bubble Scale  ///  Bubble Scale  ///  Bubble Scale

    // Adding the legend BUBBLE SCALE TITLE
    svgLegend
      .selectAll("legend")
      .data(valuesToShow)
      .enter()
      .append("text")
      .attr("class", "LegendECOText")
      .attr('x', (width - legendWidth) + paddingLarge)
      .attr('y', 340)
      .text("Bubble Scale")
      .style("font-size", 14)
      .style("fill", "rgb(100,100,100)")
      .attr('alignment-baseline', 'middle')
      .attr("class", "unselectable")
      .attr("class", "legendGreyText unselectable");

    ////////////////////////////////////////// ECO LOSS

    // Adding the legend SCALE CIRCLES
    svgLegend
      .selectAll("legend")
      .data(valuesToShow)
      .enter()
      .append("circle")
      .attr("cx", (width - legendWidth) + paddingLarge + 32)
      .attr("cy", 380)
      .attr("r", function(d) {
        return size(d);
      })
      .style("fill", "rgba(72,224,154,0)")
      .attr("stroke", "rgba(72,224,154,0.9)")
      .attr("class", "legendScaleEco");

    // Adding the legend LINES
    svgLegend
      .selectAll("legend")
      .data(valuesToShow)
      .enter()
      .append("line")
      .attr('x1', (width - legendWidth) + paddingLarge + 32)
      .attr('x2', (width - legendWidth) + paddingLarge + 32 + 40)
      .attr('y1', function(d, i) {
        return 380 + size(d);
      })
      .attr('y2', function(d, i) {
        return 380 + size(d) + i * 4;
      })
      .attr('stroke', 'rgba(72,224,154,0.9)')
      .style('stroke-dasharray', ('2,1'))
      .attr("class", "legendScaleEcoLine");

    // Adding the legend TEXT
    svgLegend
      .selectAll("legend")
      .data(valuesToShow)
      .enter()
      .append("text")
      .attr("class", "LegendText")
      .attr('x', (width - legendWidth) + paddingLarge + 32 + 40)
      .attr('y', function(d, i) {
        return 380 + size(d) + i * 4;
      })
      .text(function(d, i) {
        return d3.format(",.3r")(Math.abs(d * (2 + i * i)));
      })
      .style("font-size", 10)
      .style("fill", "rgba(72,224,154,0.9)")
      .attr('alignment-baseline', 'middle')
      .attr("class", "legendScaleEcoText unselectable");

    ////////////////////////////////////////// HUMAN LOSS

    // Adding the legend SCALE CIRCLES
    svgLegend
      .selectAll("legend")
      .data(valuesToShowHuman)
      .enter()
      .append("circle")
      .attr("cx", (width - legendWidth) + paddingLarge + 34)
      .attr("cy", 450)
      .attr("r", function(d) {
        return sizeHuman(d);
      })
      .style("fill", "rgba(229,16,62,0)")
      .attr("stroke", "rgba(229,16,62,0.9)")
      .attr("class", "legendScaleHuman");

    // Adding the legend LINES
    svgLegend
      .selectAll("legend")
      .data(valuesToShowHuman)
      .enter()
      .append("line")
      .attr('x1', (width - legendWidth) + paddingLarge + 34)
      .attr('x2', (width - legendWidth) + paddingLarge + 34 + 40)
      .attr('y1', function(d, i) {
        return 450 + sizeHuman(d);
      })
      .attr('y2', function(d, i) {
        return 450 + sizeHuman(d) + (i * 7);
      })
      .attr('stroke', 'rgba(229,16,62,0.9)')
      .style('stroke-dasharray', ('2,1'))
      .attr("class", "legendScaleHumanLine");

    // Adding the legend TEXT
    svgLegend
      .selectAll("legend")
      .data(valuesToShowHuman)
      .enter()
      .append("text")
      .attr("class", "LegendText")
      .attr('x', (width - legendWidth) + paddingLarge + 34 + 40)
      .attr('y', function(d, i) {
        return 450 + sizeHuman(d) + (i * 7);
      })
      .text(function(d, i) {
        return d * (500 + i * 500);
      })
      .style("font-size", 10)
      .style("fill", "rgba(229,16,62,0.9)")
      .attr('alignment-baseline', 'middle')
      .attr("class", "legendScaleHumanText unselectable");

    /////////////////////////////////// HIDE LEGEND  /// HIDE LEGEND  /// HIDE LEGEND

    //Hide the leggend
    d3.select("#hideLegend").on("click", function() {

      console.log("You pressed Hide Legend");

      //Moving the Legend BACKGROUND out of the way!
      svgLegend
        .selectAll("rect")
        .transition()
        .ease(d3.easePolyInOut)
        .attr('fill', "transparent");

      //Moving the Legend Circles out of the way!
      svgLegend
        .selectAll("circle")
        .transition()
        .ease(d3.easePolyInOut)
        .style("fill", "transparent")
        .attr("stroke", "transparent");

      //Moving the Legend Lines out of the way!
      svgLegend
        .selectAll("line")
        .transition()
        .ease(d3.easePolyInOut)
        .attr("stroke", "transparent");

      //Moving the Legend Text out of the way!
      svgLegend
        .selectAll("text")
        .transition()
        .ease(d3.easePolyInOut)
        .style("fill", "rgba(0,0,0,0)");
    });

    /////////////////////////////////// SHOWING LEGEND  /// SHOWING LEGEND  /// SHOWING LEGEND

    // Showing the Legend
    d3.select("#showLegend").on("click", function() {

      console.log("You pressed Show The Legend");

      d3.selectAll(".legendBackground")
        .transition()
        .ease(d3.easePolyInOut)
        .attr("fill", "rgba(0, 0, 0, 0.01)");

      d3.selectAll(".legendMainTitle")
        .transition()
        .ease(d3.easePolyInOut)
        .style("fill", "rgb(10,10,10)");

      d3.selectAll(".legendGreyText")
        .transition()
        .ease(d3.easePolyInOut)
        .style("fill", "rgb(100,100,100)");

      d3.selectAll(".legendGreenBoxes")
        .transition()
        .ease(d3.easePolyInOut)
        .attr("fill", function(d, i) {
          return "rgba(72,224,154," + alpha[i] + ")";
        });

      d3.selectAll(".legendRedBoxes")
        .transition()
        .ease(d3.easePolyInOut)
        .attr("fill", function(d, i) {
          return "rgba(229,16,62," + alpha[i] + ")";
        });

      d3.selectAll(".legendCatoEco")
        .transition()
        .ease(d3.easePolyInOut)
        .style("fill", "rgb(72,224,154)")
        .attr("stroke", "transparent");

      d3.selectAll(".legendCatoEcoLine")
        .transition()
        .ease(d3.easePolyInOut)
        .attr('stroke', 'rgb(72,224,154)');

      d3.selectAll(".legendCatoHuman")
        .transition()
        .ease(d3.easePolyInOut)
        .style("fill", "rgb(229,16,62)")
        .attr("stroke", "transparent");

      d3.selectAll(".legendCatoHumanLine")
        .transition()
        .ease(d3.easePolyInOut)
        .attr('stroke', 'rgb(229,16,62)');

      d3.selectAll(".legendCatoNoData")
        .transition()
        .ease(d3.easePolyInOut)
        .style("fill", "rgb(153,153,153)")
        .attr("stroke", "transparent");

      d3.selectAll(".legendCatoNoDataLine")
        .transition()
        .ease(d3.easePolyInOut)
        .attr('stroke', 'rgb(153,153,153)');

      d3.selectAll(".legendScaleEco")
        .transition()
        .ease(d3.easePolyInOut)
        .style("fill", "rgba(72,224,154,0)")
        .attr("stroke", "rgba(72,224,154,0.9)");

      d3.selectAll(".legendScaleEcoLine")
        .transition()
        .ease(d3.easePolyInOut)
        .attr('stroke', 'rgba(72,224,154,0.9)');

      d3.selectAll(".legendScaleEcoText")
        .transition()
        .ease(d3.easePolyInOut)
        .style("fill", "rgba(72,224,154,0.9)");

      d3.selectAll(".legendScaleHuman")
        .transition()
        .ease(d3.easePolyInOut)
        .style("fill", "rgba(229,16,62,0)")
        .attr("stroke", "rgba(229,16,62,0.9)");

      d3.selectAll(".legendScaleHumanLine")
        .transition()
        .ease(d3.easePolyInOut)
        .attr('stroke', 'rgba(229,16,62,0.9)');

      d3.selectAll(".legendScaleHumanText")
        .transition()
        .ease(d3.easePolyInOut)
        .style("fill", "rgba(229,16,62,0.9)");

    });

  });
