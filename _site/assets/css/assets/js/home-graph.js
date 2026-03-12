async function buildHomeGraph() {
  const GRAPH_SETTINGS = {
    backgroundColor: "#000000",

    baseNodeSize: 2.5,
    tagSizeFactor: 0.26,
    maxNodeSize: 8,

    baseLinkWidth: 0.35,
    linkWeightFactor: 0.22,
    linkColor: "rgba(255,255,255,0.12)",

    glowEnabled: true,       // set false if you want no glow
    glowStrength: 10,
    glowOpacity: 0.18,
    nodeCoreSizeFactor: 1.0,
    nodeGlowSizeFactor: 1.9,

    cooldownTime: 4000,
    chargeStrength: -75,
    linkDistance: 85,
    clusterStrength: 0.08,
    centerStrength: 0.03,

    zoomFitDelay: 1000,
    zoomFitDuration: 800,
    zoomFitPadding: 80
  };

  const colorMap = {
    neuroscience: "#5f96ff",
    behavioral: "#d08af7",
    systems: "#d8d84d",
    social: "#56d27d",
    history: "#b9b9b9"
  };

  const clusterTargets = {
    neuroscience: { x: 180, y: -40 },
    behavioral:   { x: -170, y: 150 },
    systems:      { x: 0, y: 180 },
    social:       { x: -90, y: -155 },
    history:      { x: 230, y: 120 }
  };

  const res = await fetch("/essays.json");
  const data = await res.json();

  const allNodes = (data.nodes || []).map(node => ({
    ...node,
    tags: Array.isArray(node.tags) ? node.tags : []
  }));

  const allLinks = [];

  for (let i = 0; i < allNodes.length; i++) {
    for (let j = i + 1; j < allNodes.length; j++) {
      const a = allNodes[i];
      const b = allNodes[j];
      const shared = a.tags.filter(t => b.tags.includes(t));

      if (shared.length > 0) {
        allLinks.push({
          source: a.id,
          target: b.id,
          weight: shared.length
        });
      }
    }
  }

  const graphEl = document.getElementById("essayGraph");
  const tooltip = document.getElementById("graphTooltip");
  const searchInput = document.getElementById("graphSearch");
  const clusterFilter = document.getElementById("graphClusterFilter");
  const resetButton = document.getElementById("graphReset");

  function getNodeColor(node) {
    return colorMap[node.cluster] || "#bcbcbc";
  }

  function getNodeSize(node) {
    const size = GRAPH_SETTINGS.baseNodeSize + (node.tags.length * GRAPH_SETTINGS.tagSizeFactor);
    return Math.min(size, GRAPH_SETTINGS.maxNodeSize);
  }

  function getFilteredData() {
    const query = (searchInput?.value || "").trim().toLowerCase();
    const cluster = clusterFilter?.value || "all";

    const filteredNodes = allNodes.filter(node => {
      const titleMatch = (node.title || "").toLowerCase().includes(query);
      const subtitleMatch = (node.subtitle || "").toLowerCase().includes(query);
      const clusterMatch = cluster === "all" || node.cluster === cluster;
      return clusterMatch && (titleMatch || subtitleMatch);
    });

    const allowedIds = new Set(filteredNodes.map(n => n.id));

    const filteredLinks = allLinks.filter(link => {
      const sourceId = typeof link.source === "object" ? link.source.id : link.source;
      const targetId = typeof link.target === "object" ? link.target.id : link.target;
      return allowedIds.has(sourceId) && allowedIds.has(targetId);
    });

    return { nodes: filteredNodes, links: filteredLinks };
  }

  function showTooltip(node) {
    if (!node) {
      tooltip.style.opacity = 0;
      return;
    }

    tooltip.innerHTML = `
      <div class="graph-tooltip-title">${node.title || ""}</div>
      <div class="graph-tooltip-subtitle">${node.subtitle || ""}</div>
    `;
    tooltip.style.opacity = 1;
  }

  window.addEventListener("mousemove", e => {
    tooltip.style.left = `${e.clientX}px`;
    tooltip.style.top = `${e.clientY}px`;
  });

  const Graph = ForceGraph()(graphEl)
    .graphData({ nodes: allNodes, links: allLinks })
    .backgroundColor(GRAPH_SETTINGS.backgroundColor)
    .nodeId("id")
    .nodeLabel(node => node.title || "")
    .nodeVal(node => getNodeSize(node))
    .linkWidth(link => GRAPH_SETTINGS.baseLinkWidth + (Math.min(link.weight || 1, 5) * GRAPH_SETTINGS.linkWeightFactor))
    .linkColor(() => GRAPH_SETTINGS.linkColor)
    .cooldownTime(GRAPH_SETTINGS.cooldownTime)
    .onNodeHover(showTooltip)
    .onNodeClick(node => {
      if (node.url) window.location.href = node.url;
    })
    .nodeCanvasObject((node, ctx, globalScale) => {
      const x = node.x;
      const y = node.y;
      const size = getNodeSize(node);
      const color = getNodeColor(node);

      if (GRAPH_SETTINGS.glowEnabled) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, size * GRAPH_SETTINGS.nodeGlowSizeFactor, 0, 2 * Math.PI);
        ctx.shadowColor = color;
        ctx.shadowBlur = GRAPH_SETTINGS.glowStrength;
        ctx.globalAlpha = GRAPH_SETTINGS.glowOpacity;
        ctx.fillStyle = color;
        ctx.fill();
        ctx.restore();
      }

      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, size * GRAPH_SETTINGS.nodeCoreSizeFactor, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.restore();

      if (globalScale > 1.6) {
        const fontSize = Math.max(10 / globalScale, 4.8);
        ctx.save();
        ctx.font = `${fontSize}px EB Garamond, serif`;
        ctx.fillStyle = "rgba(245,239,230,0.82)";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillText(node.title || "", x, y + size + 3);
        ctx.restore();
      }
    });

  Graph.d3Force("charge").strength(GRAPH_SETTINGS.chargeStrength);
  Graph.d3Force("link").distance(GRAPH_SETTINGS.linkDistance);

  Graph.d3Force("cluster", () => {
    const activeData = Graph.graphData();
    (activeData.nodes || []).forEach(node => {
      const target = clusterTargets[node.cluster] || { x: 0, y: 0 };
      node.vx += (target.x - node.x) * GRAPH_SETTINGS.clusterStrength;
      node.vy += (target.y - node.y) * GRAPH_SETTINGS.clusterStrength;
    });
  });

  Graph.d3Force("centerBias", () => {
    const activeData = Graph.graphData();
    (activeData.nodes || []).forEach(node => {
      node.vx += (0 - node.x) * GRAPH_SETTINGS.centerStrength;
      node.vy += (0 - node.y) * GRAPH_SETTINGS.centerStrength;
    });
  });

  function applyFilters() {
    const filtered = getFilteredData();
    Graph.graphData(filtered);

    setTimeout(() => {
      if (filtered.nodes.length > 0) {
        Graph.zoomToFit(
          GRAPH_SETTINGS.zoomFitDuration,
          GRAPH_SETTINGS.zoomFitPadding
        );
      }
    }, 120);
  }

  searchInput?.addEventListener("input", applyFilters);
  clusterFilter?.addEventListener("change", applyFilters);

  resetButton?.addEventListener("click", () => {
    if (searchInput) searchInput.value = "";
    if (clusterFilter) clusterFilter.value = "all";

    Graph.graphData({ nodes: allNodes, links: allLinks });

    setTimeout(() => {
      Graph.zoomToFit(
        GRAPH_SETTINGS.zoomFitDuration,
        GRAPH_SETTINGS.zoomFitPadding
      );
    }, 120);
  });

  setTimeout(() => {
    Graph.zoomToFit(
      GRAPH_SETTINGS.zoomFitDuration,
      GRAPH_SETTINGS.zoomFitPadding
    );
  }, GRAPH_SETTINGS.zoomFitDelay);
}

function initHeroSlide() {
  const heroInner = document.getElementById("homeHeroInner");
  if (!heroInner) return;

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;

    const shift = Math.min(scrollY * 0.55, 320);
    const opacity = Math.max(1 - scrollY / 700, 0);

    heroInner.style.transform = `translateY(-${shift}px)`;
    heroInner.style.opacity = opacity;
  });
}

initHeroSlide();
buildHomeGraph();