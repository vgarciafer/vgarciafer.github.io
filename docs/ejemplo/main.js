var width = 500,
      height = 500,
      start = 0,
      end = 2.25,
      numSpirals = 1;

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

    var rccdata = [
      { rcc:"1: Infections", freq:172313 }
      ,{ rcc:'2: Diabetes Co-Morbidity Level', freq:149464}
      ,{ rcc:'3: Type I Diabetes', freq:16864}
      ,{ rcc:'4: Malnutrition', freq:8076}
      ,{ rcc:'5: Hyperlipidemia and Lipidoses', freq:426949}
      ,{ rcc:'6: Endocrine Conditions', freq:166509}
      ,{ rcc:'7: Excess Weight', freq:218884}
      ,{ rcc:'8: Other Nutritional and Metabolic Conditions', freq:45827}
      ,{ rcc:'9: Liver Intervention and Complications', freq:296}
      ,{ rcc:'10: Billary and Gallbladder Conditions', freq:9191}
      ,{ rcc:'11: Hepatitis', freq:35605}
      ,{ rcc:'12: Gastrointestinal Intervention and Complications', freq:110}
      ,{ rcc:'13: Peptic Ulcer and Related Conditions', freq:6247}
      ,{ rcc:'14: Other Gastrointestinal Conditions', freq:384987}
      ,{ rcc:'15: Pancreatic Disorders', freq:8396}
      ,{ rcc:'16: Inflammatory Bowel Disease', freq:9227}
      ,{ rcc:'17: Knee Disorders and Injuries', freq:113964}
      ,{ rcc:'18: Hip Disorders and Injuries', freq:55277}
      ,{ rcc:'19: Back Disorders and Injuries', freq:335735}
      ,{ rcc:'20: Other Musculoskeletal Conditions', freq:237768}
      ,{ rcc:'21: Musculoskeletal Infection', freq:3126}
      ,{ rcc:'22: Inflammatory Musculoskeletal Conditions', freq:27910}
      ,{ rcc:'23: Lower Leg & Foot Disorders and Injuries', freq:189168}
      ,{ rcc:'24: Shoulder & Upper Arm Disorders and Injuries', freq:115989}
      ,{ rcc:'25: Forearm & Hand Disorders and Injuries', freq:129787}
      ,{ rcc:'26: Hemorrhagic Conditions', freq:2355}
      ,{ rcc:'27: Anemia', freq:77653}
      ,{ rcc:'28: Disorders of Immunity', freq:3476}
      ,{ rcc:'29: Cognitive Disorders', freq:27183}
      ,{ rcc:'30: Drug Abuse', freq:24668}
      ,{ rcc:'31: Alcohol Abuse', freq:24432}
      ,{ rcc:'32: Tobacco Use', freq:85348}
      ,{ rcc:'33: Personality Disorders', freq:4883}
      ,{ rcc:'34: Other Mental Conditions', freq:114127}
      ,{ rcc:'35: Psychoses', freq:9434}
      ,{ rcc:'36: Eating Disorders', freq:3396}
      ,{ rcc:'37: Mood and Anxiety Disorders', freq:192709}
      ,{ rcc:'38: Suicide Attempts', freq:1178}
      ,{ rcc:'39: Chromosomal and Developmental Disorders', freq:25802}
      ,{ rcc:'40: Severe Developmental Disability', freq:62}
      ,{ rcc:'41: Neurological Trauma', freq:16228}
      ,{ rcc:'42: Paralysis and Coma', freq:2588}
      ,{ rcc:'43: Seizure Disorders', freq:15261}
      ,{ rcc:'44: Myoneural Conditions', freq:173}
      ,{ rcc:'45: Other Neurological Conditions', freq:94753}
      ,{ rcc:'46: Headache', freq:136205}
      ,{ rcc:'47: Respiratory Arrest', freq:10383}
      ,{ rcc:'48: Cardiac Arrest', freq:935}
      ,{ rcc:'49: Cardiovascular Intervention and Complications', freq:3483}
      ,{ rcc:'50: Coronary Artery Disease', freq:50439}


    ];

    var spiralLength = path.node().getTotalLength(),
        N = rccdata.length,
        barWidth = (spiralLength / N) - 1;
    var someData = [];
    for (var i = 0; i < N; i++) {
      var currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + i);
      someData.push({
        date: currentDate,
        cat: rccdata[i].rcc,
        value: rccdata[i].freq
      });
    }
   var timeScale = d3.scaleTime()
      .domain(d3.extent(someData, function(d){
        return d.date;
      }))
      .range([0, spiralLength]);
    
    var ordinalScale = d3.scaleBand()
      //.domain(categories)
      .domain(rccdata.map(function(d){ return d.rcc; }))
      // This is the code to implement removing the above .domain(categories) statement
      .range([0, 1200000]);

    // yScale for the bar height
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
      .attr("dy", 10)
      .style("text-anchor", "start")
      .style("font", "10px arial")
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

        tooltip.select('.date').html("Category: <b>" + d.cat + "</b>");
        tooltip.select('.value').html("Value: <b>" + Math.round(d.value*100)/100 + "<b>");

        d3.select(this)
        .style("fill","#FFFFFF")
        .style("stroke","#000000")
        .style("stroke-width","2px");

        tooltip.style('display', 'block');
        tooltip.style('opacity',2);

    })
    .on('mousemove', function(d) {
        tooltip.style('top', (d3.event.layerY + 10) + 'px')
        .style('left', (d3.event.layerX - 25) + 'px');
    })
    .on('mouseout', function(d) {
        d3.selectAll("rect")
        .style("fill", function(d){return color(d.cat);})
        .style("stroke", "none")

        tooltip.style('display', 'none');
        tooltip.style('opacity',0);
    });
