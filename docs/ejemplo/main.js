
  const config = {
    numSpirals: spirals,
    start: 0,
    end: spirals,
    donut: donutSlider
  };

  const theta = (r) => config.numSpirals * Math.PI * r;

  const _width = d3.min([width, window.outerHeight]);
  const height = _width;

  let r = _width / 2 - config.donut * 2;
  let radius = d3
    .scaleLinear()
    .domain([config.start, config.end])
    .range([config.donut, r]);

  const points = d3.range(
    config.start,
    config.end + 0.001,
    (config.end - config.start) / 100
  );

  const spiral = d3
    .radialLine()
    .curve(d3.curveCardinal)
    .angle(theta)
    .radius(radius);

  ///////////////////////////////////////////////   the graphic starts here!
  const tooltip = d3
    .select("body")
    .append("div")
    .attr("id", "tooltip")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .style("display", "none");

  tooltip.append("div").attr("class", "date");
  tooltip.append("div").attr("class", "value");

  const svg = d3
    .select(DOM.svg(_width, height))
    .style("background-color", "#ffffff");

  const g = svg
    .append("g")
    .attr("transform", `translate(${_width / 2},${height / 2})`);

  var path = g
    .append("path")
    .attr("id", "spiral")
    .datum(points)
    .attr("id", "spiral")
    .attr("d", spiral)
    .style("fill", "none")
    .style("stroke", "none");

  var spiralLength = path.node().getTotalLength();
  var N = data.length;
  var barWidth = spiralLength / N - 1.5;

  const timeScale = d3
    .scaleTime()
    .domain(d3.extent(data, (d) => d.dt))
    .range([0, spiralLength]);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => +d[dataColumn])])
    .range([0, r / config.numSpirals - config.donut]);

  const yMax = yScale.domain()[1];

  const color = d3
    .scaleSequential(d3[`interpolate${colorSelector}`])
    .domain(d3.extent(data, (d) => +d[dataColumn]));

  data.map((d) => {
    const linePer = timeScale(d.dt);
    const posOnLine = path.node().getPointAtLength(linePer);
    const angleOnLine = path.node().getPointAtLength(linePer - barWidth);

    d.linePer = linePer; // % distance are on the spiral
    d.x = posOnLine.x; // x postion on the spiral
    d.y = posOnLine.y; // y position on the spiral

    //angle at the spiral position
    d.a = (Math.atan2(angleOnLine.y, angleOnLine.x) * 180) / Math.PI - 90;
  });

  data.sort((a, b) => d3.ascending(a.dt, b.dt));

  const rects = g
    .selectAll("rect.rect")
    .data(data)
    .join("rect")
    .attr(
      "class",
      (d) => `rect date-${d.dt.getMonth()}-${d.dt.getDate()}-${d.dt.getYear()}`
    )
    .style("fill", (d) => color(+d[dataColumn]))
    .attr("transform", (d) => `rotate(${d.a},${d.x},${d.y})`) // rotate bar
    .style("stroke", "none")
    .attr("rx", 5)
    .attr("ry", 5)
    .attr("x", (d) => d.x)
    .attr("y", (d) => {
      switch (barOrientation) {
        case "centered":
          return d.y - yScale(+d[dataColumn]) / 2;
          break;
        case "inside":
          return d.y - yScale(+d[dataColumn]);
          break;
        case "outside":
          return d.y;
          break;
      }
    })
    .attr("width", barWidth)
    .attr("height", 0)
    .transition()
    .delay((d, i) => i * 5)
    .attr("height", (d) => yScale(+d[dataColumn]));

  g.selectAll("rect.background")
    .data(data)
    .join("rect")
    .attr(
      "class",
      (d) =>
        `background date-${d.dt.getMonth()}-${d.dt.getDate()}-${d.dt.getYear()}`
    )
    .style("fill", (d) => "#fff")
    .style("fill-opacity", 0)
    .attr("transform", (d) => `rotate(${d.a},${d.x},${d.y})`) // rotate bar
    .style("stroke", "none")
    .attr("rx", 5)
    .attr("ry", 5)
    .attr("x", (d) => d.x)
    .attr("height", (d) => yScale(yMax))
    .attr("y", (d) => {
      if (barOrientation == "centered") {
        return d.y - yScale(yMax) / 2;
      } else if (barOrientation === "inside") {
        return d.y - yScale(yMax);
      } else {
        return d.y;
      }
    })
    .attr("width", barWidth)
    .on("mouseover", function (event, d) {
      d3.selectAll("rect.rect").attr("opacity", 0.2);

      if (outline === "Yes") {
        d3.selectAll(
          `rect.date-${d.dt.getMonth()}-${d.dt.getDate()}-${d.dt.getYear()}`
        )
          .style("stroke", "#323232")
          .style("stroke-width", "1px")
          .attr("opacity", 1);
      } else if (outline === "No") {
        d3.selectAll(
          `rect.rect.date-${d.dt.getMonth()}-${d.dt.getDate()}-${d.dt.getYear()}`
        )
          .style("stroke", "#323232")
          .style("stroke-width", "1px")
          .attr("opacity", 1);
      }

      tooltip
        .select(".date")
        .html("Date: <b>" + d3.timeFormat("%B %d, %Y")(d.dt) + "</b>");
      tooltip
        .select(".value")
        .html("Value: <b>" + d3.format(".3s")(+d[dataColumn]) + "<b>");

      tooltip
        .style("display", "block")
        .attr("data-html", "true")
        .style("visibility", "visible");
    })
    .on("mousemove", function (event, d) {
      var x = event.pageX;
      var y = event.pageY;
      var toolTipWidth = tooltip.node().getBoundingClientRect().width;
      var toolTipMargin = 10;
      let parsedX = x + toolTipMargin;
      if (parsedX > _width - toolTipWidth - toolTipMargin)
        parsedX = parsedX - toolTipWidth - toolTipMargin * 3;

      tooltip
        .style("left", `${parsedX}px`)
        .style("top", event.pageY + toolTipMargin + "px");
    })
    .on("mouseout", function (event, d) {
      d3.selectAll("rect").style("stroke", "none").attr("opacity", 1);

      tooltip.style("display", "none");
    });

  if (axisTicks === "Yes") {
    g.selectAll("text").remove();
    g.selectAll("text")
      .data(data.filter((d) => d.dt.getDate() === 1))
      .join("text")
      .attr("class", "axis-text")
      .attr("dy", () => {
        if (barOrientation === "centered") {
          return yScale(yScale.domain()[1]) / 2 + 12;
        } else if (barOrientation === "inside") {
          return -10;
        } else if (barOrientation === "outside") {
          return 15;
        }
      })
      .style("text-anchor", "start")
      .style("font", ".65rem Avenir")
      .style("letter-spacing", () =>
        barOrientation === "centered" ? "2px" : "1px"
      )
      .append("textPath")
      .text((d, i) => {
        if (d.dt.getMonth() !== 0 && i !== 0) {
          if ([4, 5, 6].includes(d.dt.getMonth())) {
            return d3.timeFormat("%B")(d.dt);
          } else if (d.dt.getMonth() === 8) {
            return "Sept.";
          } else {
            return d3.timeFormat("%b.")(d.dt);
          }
        } else {
          return d3.timeFormat("%b. '%y")(d.dt);
        }
      })
      .attr("xlink:href", "#spiral")
      .style("fill", "grey")
      .attr("startOffset", (d) => (d.linePer / spiralLength) * 100 + "%")
      .attr("opacity", 0)
      .transition()
      .delay((d, i) => i * 150)
      .attr("opacity", 1);
  }

  svg
    .append("text")
    .text(`${stateSelector}: ${dataColumn}`)
    .attr("x", _width / 2)
    .attr("y", 22*1.25)
    .attr('text-anchor','middle')
    .style("font-size", "22px")
    .style("font-weight", "900");
  
  svg.append("text").text("Source: CDC").attr("x", 0).attr("y", height);
  
  svg
    .append("text")
    .text(`Date: ${d3.timeFormat("%B %d, %Y")(data[data.length - 1].dt)}`)
    .attr("x", 0)
    .attr("y", height - 18);

 
}
