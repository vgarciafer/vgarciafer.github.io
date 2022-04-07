 <script src="https://unpkg.com/force-graph@1.42.9/dist/force-graph.min.js"></script>
  <div id="graph"></div>

  <script>
 fetch('../ejemplo/datos/miserables.json').then(res => res.json()).then(data => {
      const Graph = ForceGraph()
      (document.getElementById('graph'))
        .graphData(data)
        .nodeId('id')
        .nodeVal('val')
        .nodeLabel('id')
        .nodeAutoColorBy('group')
        .linkSource('source')
        .linkTarget('target')
    });
	
  </script>

