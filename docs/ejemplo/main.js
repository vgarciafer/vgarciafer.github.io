//Basado en: https://gist.github.com/arpitnarechania/027e163073864ef2ac4ceb5c2c0bf616 
//license MIT
fetch('https://data.cdc.gov/resource/9mfq-cb36.json?state=NY&&$order=submission_date')
  .then(response => response.json())
  .then(procesaEspiral);


const formatDate = (date) => {
  const [dateStr] = new Date(date).toISOString().split("T");
  return dateStr;
}
const formatDateMonth = (date) => {
  try{ 
    return new Date(date).toISOString().slice(5,7);
  }catch (error) {
   console.error(error);
  }
}

function procesaEspiral(json){
    var rccdata = [];
    for(let i = 0; i < json.length; i++){ 
      rccdata.push([i,json[i]]);  
    }

    var width = 550,
      height = 550,
      start = 0,
      end = 2.25,
      numSpirals = 6; 
      margin = {top:50,bottom:50,left:100,right:100};

    var theta = function(r) {
      return numSpirals * Math.PI * r;
    };

    // used to assign nodes color by group
    var color = d3.scaleOrdinal(d3.schemeCategory10);

    var r = d3.min([width, height]) / 2 - 40;

    var radius = d3.scaleLinear()
      .domain([start, end])
      .range([40, r]);

    var svg = d3.select("#chart").append("svg")
      .attr("width", width + margin.right + margin.left)
      .attr("height", height + margin.left + margin.right)
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var points = d3.range(start, end + 0.001, (end - start) / 1000);

    var spiral = d3.radialLine()
      .curve(d3.curveCardinal)
      .angle(theta)
      .radius(radius);

    var path = svg.append("path")
      .datum(points)
      .attr("id", "spiral")
      .attr("d", spiral)
      .style("fill", "none")
      .style("stroke", "steelblue");
    
   
    var spiralLength = path.node().getTotalLength(),
          N = rccdata.length,
          barWidth = (spiralLength / N) - 1;
      var someData = [];
      for (var i = 0; i < N; i++) {
        someData.push({
          date: Date.parse(rccdata[i][1]["submission_date"]),
          value: rccdata[i][1]["new_death"],
          total: rccdata[i][1]["tot_death"]
        });
      }
     var timeScale = d3.scaleTime()
        .domain(d3.extent(someData, function(d){
          return d.date;
        }))
        .range([0, spiralLength]);

      var yScale = d3.scaleLinear()
        .domain([0, d3.max(someData, function(d){
          return d.value;
        })])
        .range([0, (r / numSpirals) - 30]);

      svg.selectAll("rect")
        .data(someData)
        .enter()
        .append("rect")
        .attr("x", function(d,i){

          var linePer = timeScale(d.date),
              posOnLine = path.node().getPointAtLength(linePer),
              angleOnLine = path.node().getPointAtLength(linePer - barWidth);

          d.linePer = linePer; // % distance are on the spiral
          d.x = posOnLine.x; // x postion on the spiral
          d.y = posOnLine.y; // y position on the spiral

          d.a = (Math.atan2(angleOnLine.y, angleOnLine.x) * 180 / Math.PI) - 90; //angle at the spiral position

          return d.x;
        })
        .attr("y", function(d){
          return d.y;
        })
        .attr("width", function(d){
          return barWidth;
        })
        .attr("height", function(d){
          return yScale(d.value);
        })
        .style("fill", function(d){return color(d.group);})
        .style("stroke", "none")
        .attr("transform", function(d){
          return "rotate(" + d.a + "," + d.x  + "," + d.y + ")"; // rotate the bar
        });

      // add date labels
      var tF = d3.timeFormat("%b %Y"),
          firstInMonth = {};

      svg.selectAll("text")
        .data(someData)
        .enter()
        .append("text")
        .attr("dy", 12)
        .style("text-anchor", "start")
        .style("font", "12px arial")
        .append("textPath")
        // only add for the first of each month
        .filter(function(d){
          var sd = tF(d.date);
          if (!firstInMonth[sd]){
            firstInMonth[sd] = 1;
            return true;
          }
          return false;
        })
        .text(function(d){
          return tF(d.date);
        })
        // place text along spiral
        .attr("xlink:href", "#spiral")
        .style("fill", "grey")
        .attr("startOffset", function(d){
          return ((d.linePer / spiralLength) * 100) + "%";
        })


      var tooltip = d3.select("#chart")
      .append('div')
      .attr('class', 'tooltip');

      tooltip.append('div')
      .attr('class', 'date');
      tooltip.append('div')
      .attr('class', 'value');

      svg.selectAll("rect")
      .on('mouseover', function(d) {
        tooltip.select('.value').html(formatDate(d.date) +" <br> Nuevos fallecidos:" + Math.round(d.value*100)/100 +"<br> Fallecidos totales: <b>" + Math.round(d.total*100)/100 + "<b>");
          d3.select(this)
          .style("fill","#FFFFFF")
          .style("stroke","#000000")
          .style("stroke-width","3px");

          tooltip.style('display', 'block');
          tooltip.style('opacity',3);

      })
     .on('click', function(d) {
          tooltip.select('.value').html(formatDate(d.date) +" <br> Nuevos fallecidos:" + Math.round(d.value*100)/100 +"<br> Fallecidos totales: <b>" + Math.round(d.total*100)/100 + "<b>");

          d3.select(this)
          .style("fill","#FFFFFF")
          .style("stroke","#000000")
          .style("stroke-width","3px");

          tooltip.style('display', 'block');
          tooltip.style('opacity',3);

      })
      .on('mousemove', function(d) {
          tooltip.style('top', (d3.event.layerY + 10) + 'px')
          .style('left', (d3.event.layerX - 25) + 'px');
      })
      .on('mouseout', function(d) {
          d3.selectAll("rect")
          .style("fill", function(d){return color(formatDateMonth(d.date))})
          .style("stroke", "none")

          tooltip.style('display', 'none');
          tooltip.style('opacity',0);
      });

  }
    
