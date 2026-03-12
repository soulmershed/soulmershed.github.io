async function buildGraph() {
  const GRAPH_SETTINGS = {
    backgroundColor: "#0f1012",

    /* NODE SIZE */
    baseNodeSize: 2.4,
    tagSizeFactor: 0.28,
    maxNodeSize: 8,

    /* LINK STYLE */
    baseLinkWidth: 0.35,
    linkWeightFactor: 0.22,
    linkColor: "rgba(255,255,255,0.12)",

    /* GLOW CONTROL */
    glowEnabled: true,              // CHANGE TO false TO TURN GLOW OFF
    glowStrength: 14,               // outer glow blur
    glowOpacity: 0.28,              // glow alpha
    nodeCoreSizeFactor: 1.0,        // central visible node size
    nodeGlowSizeFactor: 2.2,        // glow radius multiplier

    /* CLUSTER / PHYSICS */
    cooldownTime: 4000,
    chargeStrength: -70,
    linkDistance: 85,
    clusterStrength: 0.075,
    centerStrength: 0.035,

    /* INITIAL CAMERA */
    zoomFitDelay: 900,
    zoomFitDuration: 800,
    zoomFitPadding: 80
  };

  const colorMap = {
    neuroscience: "#59a5ff",
    behavioral: "#d889ff",
    systems: "#e3df59",
    social: "#60d685",
    history: "#b9b9b9"
  };

  const clusterTargets = {
    neuroscience: { x: 170, y: -60 },
    behavioral: { x: -170, y: 150 },
    systems: { x: 10, y: 170 },
    social: { x: -80, y: -160 },
    history: { x: 230, y: 120 }
  };

  const res = await fetch("/essays.json");
  const data = await res.json();

  const allNodes = (data.nodes || []).map(node => ({
    ...node,
    tags: Array.isArray(node.tags) ? node.tags : []
  }));

  const allLinks = [];

  /* BUILD LINKS FROM SHARED TAGS */
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
      if (node.url) {
        window.location.href = node.url;
      }
    })
    .nodeCanvasObject((node, ctx, globalScale) => {
      const x = node.x;
      const y = node.y;
      const size = getNodeSize(node);
      const color = getNodeColor(node);

      /* OPTIONAL GLOW */
      if (GRAPH_SETTINGS.glowEnabled) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(
          x,
          y,
          size * GRAPH_SETTINGS.nodeGlowSizeFactor,
          0,
          2 * Math.PI
        );
        ctx.shadowColor = color;
        ctx.shadowBlur = GRAPH_SETTINGS.glowStrength;
        ctx.globalAlpha = GRAPH_SETTINGS.glowOpacity;
        ctx.fillStyle = color;
        ctx.fill();
        ctx.restore();
      }

      /* NODE CORE */
      ctx.save();
      ctx.beginPath();
      ctx.arc(
        x,
        y,
        size * GRAPH_SETTINGS.nodeCoreSizeFactor,
        0,
        2 * Math.PI
      );
      ctx.fillStyle = color;
      ctx.fill();
      ctx.restore();

      /* OPTIONAL LABELS WHEN ZOOMED IN */
      if (globalScale > 1.55) {
        const fontSize = Math.max(10 / globalScale, 4.8);
        ctx.save();
        ctx.font = `${fontSize}px EB Garamond, serif`;
        ctx.fillStyle = "rgba(245,239,230,0.85)";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillText(node.title || "", x, y + size + 2);
        ctx.restore();
      }
    });

  /* PHYSICS */
  Graph.d3Force("charge").strength(GRAPH_SETTINGS.chargeStrength);
  Graph.d3Force("link").distance(GRAPH_SETTINGS.linkDistance);

  Graph.d3Force(
    "cluster",
    () => {
      allNodes.forEach(node => {
        const target = clusterTargets[node.cluster] || { x: 0, y: 0 };
        node.vx += (target.x - node.x) * GRAPH_SETTINGS.clusterStrength;
        node.vy += (target.y - node.y) * GRAPH_SETTINGS.clusterStrength;
      });
    }
  );

  Graph.d3Force(
    "centerBias",
    () => {
      allNodes.forEach(node => {
        node.vx += (0 - node.x) * GRAPH_SETTINGS.centerStrength;
        node.vy += (0 - node.y) * GRAPH_SETTINGS.centerStrength;
      });
    }
  );

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

/* HERO SCROLL */
(function () {
  const heroInner = document.querySelector(".essay-hero-inner");
  if (!heroInner) return;

  window.addEventListener("scroll", () => {
    const s = window.scrollY;
    const shift = Math.min(s * 0.5, 240);
    const opacity = Math.max(1 - (s / 500), 0);

    heroInner.style.transform = `translateY(-${shift}px)`;
    heroInner.style.opacity = opacity;
  });
})();

buildGraph();