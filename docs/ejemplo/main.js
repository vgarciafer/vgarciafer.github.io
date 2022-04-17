var width = 500,
      height = 500,
      start = 0,
      end = 2.25,
      numSpirals = 3
      margin = {top:50,bottom:50,left:50,right:50};

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
      ,{ rcc:'28: Musculoskeletal Infection', freq:3126}
      ,{ rcc:'29: Inflammatory Musculoskeletal Conditions', freq:27910}
      ,{ rcc:'30: Lower Leg & Foot Disorders and Injuries', freq:189168}
      ,{ rcc:'31: Shoulder & Upper Arm Disorders and Injuries', freq:115989}
      ,{ rcc:'32: Forearm & Hand Disorders and Injuries', freq:129787}
      ,{ rcc:'33: Hemorrhagic Conditions', freq:2355}
      ,{ rcc:'34: Anemia', freq:77653}
      ,{ rcc:'35: Disorders of Immunity', freq:3476}
      ,{ rcc:'36: Cognitive Disorders', freq:27183}
      ,{ rcc:'37: Drug Abuse', freq:24668}
      ,{ rcc:'38: Alcohol Abuse', freq:24432}
      ,{ rcc:'39: Tobacco Use', freq:85348}
      ,{ rcc:'40: Personality Disorders', freq:4883}
      ,{ rcc:'41: Other Mental Conditions', freq:114127}
      ,{ rcc:'42: Psychoses', freq:9434}
      ,{ rcc:'43: Eating Disorders', freq:3396}
      ,{ rcc:'44: Mood and Anxiety Disorders', freq:192709}
      ,{ rcc:'45: Suicide Attempts', freq:1178}
      ,{ rcc:'46: Chromosomal and Developmental Disorders', freq:25802}
      ,{ rcc:'47: Severe Developmental Disability', freq:62}
      ,{ rcc:'48: Neurological Trauma', freq:16228}
      ,{ rcc:'49: Paralysis and Coma', freq:2588}
      ,{ rcc:'50: Seizure Disorders', freq:15261}
      ,{ rcc:'52: Myoneural Conditions', freq:173}
      ,{ rcc:'53: Other Neurological Conditions', freq:94753}
      ,{ rcc:'54: Headache', freq:136205}
      ,{ rcc:'55: Respiratory Arrest', freq:10383}
      ,{ rcc:'56: Cardiac Arrest', freq:935}
      ,{ rcc:'57: Cardiovascular Intervention and Complications', freq:3483}
      ,{ rcc:'58: Coronary Artery Disease', freq:50439}
      ,{ rcc:'59: Congestive Heart Failure', freq:22321}
      ,{ rcc:'60: Heart Valve and Pericardial Conditions', freq:13816}
      ,{ rcc:'61: Congenital Heart Conditions', freq:2117}
      ,{ rcc:'62: Cardiac Arrhythmias', freq:53832}
      ,{ rcc:'63: Other Heart Conditions', freq:3664}
      ,{ rcc:'64: Hypertension', freq:257765}
      ,{ rcc:'65: Stroke', freq:12426}
      ,{ rcc:'66: Post-Stroke Paralysis', freq:8796}
      ,{ rcc:'67: Sequelae of Cerebrovascular Events', freq:4578}
      ,{ rcc:'68: Cerebro-Vascular Impairment', freq:3630}
      ,{ rcc:'69: Peripheral Atherosclerosis', freq:6524}
      ,{ rcc:'70: Other Peripheral-Vascular Conditions', freq:95355}
      ,{ rcc:'71: Thrombosis/Phlebitis', freq:26999}
      ,{ rcc:'72: Lung Intervention and Complications', freq:22}
      ,{ rcc:'73: Lung Infection', freq:20633}
      ,{ rcc:'74: Lung Congestion and Effusion', freq:3778}
      ,{ rcc:'75: Lung Fibrosis', freq:7445}
      ,{ rcc:'76: Other Lung Conditions', freq:44780}
      ,{ rcc:'77: COPD and Asthma', freq:183802}
      ,{ rcc:'78: Diabetic/Other Retinopathy', freq:31680}
      ,{ rcc:'79: Blindness', freq:822}
      ,{ rcc:'80: Eye Infection and Inflammation', freq:2027}
      ,{ rcc:'81: Eye Intervention and Complications', freq:47374}
      ,{ rcc:'82: Other Eye Conditions', freq:357819}
      ,{ rcc:'83: Significant ENT Disorders', freq:5040}
      ,{ rcc:'84: Hearing Impairment', freq:59120}
      ,{ rcc:'85: Other ENT Disorders', freq:420787}
      ,{ rcc:'86: Urinary System Intervention and Complications', freq:6232}
      ,{ rcc:'88: Bladder and Other Urinary Conditions', freq:75154}
      ,{ rcc:'89: Nephritis', freq:6534}
      ,{ rcc:'90: Urinary System Infection', freq:53911}
      ,{ rcc:'91: Female Genital Conditions', freq:239871}
      ,{ rcc:'92: Male Genital Conditions', freq:97171}
      ,{ rcc:'93: Completed/Terminated Pregnancy', freq:45184}
      ,{ rcc:'94: Other Pregnancy', freq:649}
      ,{ rcc:'95: Uncompleted Pregnancy', freq:20749}
      ,{ rcc:'96: Severe Burns', freq:143}
      ,{ rcc:'97: Skin Ulcers', freq:7847}
      ,{ rcc:'98: Other Skin Conditions', freq:427180}
      ,{ rcc:'99: Head Injury', freq:16136}
      ,{ rcc:'100: Traumatic Amputation', freq:82}
      ,{ rcc:'101: Other Injuries', freq:122934}
      ,{ rcc:'102: Poisoning', freq:27032}
      ,{ rcc:'103: Symptoms', freq:843464}
      ,{ rcc:'109: Artificial Openings', freq:2438}
      ,{ rcc:'110: Amputation Status', freq:2632}
      ,{ rcc:'111: Other V-Codes', freq:2234}
      ,{ rcc:'114: Other Screening and History', freq:1243320}
      ,{ rcc:'115: Post-Procedural Conditions', freq:252101}
      ,{ rcc:'116: Implant and Device Complications', freq:5750}
      ,{ rcc:'117: Other Complications', freq:26597}
    ];

    var spiralLength = path.node().getTotalLength(),
        N = rccdata.length,
        barWidth = (spiralLength / N) - 1;
    var someData = [];
    for (var i = 0; i < N; i++) {
      someData.push({
        cat: rccdata[i].rcc,
        value: rccdata[i].freq
      });
    }

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

        var linePer = ordinalScale(d.cat),
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
      .filter(function(d,i){
        return i % 10 === 0;
      })
      .text(function(d){
        return d.cat;
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
