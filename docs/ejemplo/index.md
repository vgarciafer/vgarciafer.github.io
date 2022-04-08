
 <script src="https://unpkg.com/force-graph@1.42.9/dist/force-graph.min.js"></script>
</head>

<body>
  <div id="graph"></div>
  <div id="graph"></div>

  <script>
 fetch('datos/starwars-episode-1-interactions.json').then(res => res.json()).then(data => {
      const Graph = ForceGraph()
      (document.getElementById('graph'))
        .graphData(data)
        .nodeId('name')
        .nodeVal('value')
        .nodeLabel('name')
        .nodeAutoColorBy('colour')
       .linkSource('source')
        .linkTarget('target')
       .onNodeDragEnd(node => {
        	node.fx = node.x;
        	node.fy = node.y;
	      })
	.onNodeClick(node => {
        Graph.centerAt(node.x, node.y, 1000);
        Graph.zoom(8, 500);
      });

    });
</script>

