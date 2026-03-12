---
layout: page
title: Essays
permalink: /essays/
---

<link rel="stylesheet" href="/assets/css/essay-graph.css">

<div class="essay-graph-page">

  <section class="essay-hero" id="essayHero">
    <div class="essay-hero-inner">
      <h1 class="essay-hero-title">Essays</h1>
      <p class="essay-hero-subtitle">
        An evolving map of connected thoughts, themes, and inquiries.
      </p>
    </div>
  </section>

  <section class="essay-graph-shell">
    <div class="essay-graph-controls">
      <input type="text" id="graphSearch" placeholder="Search essays">

      <select id="graphClusterFilter">
        <option value="all">All themes</option>
        <option value="neuroscience">Neuroscience</option>
        <option value="behavioral">Behavior</option>
        <option value="systems">Systems</option>
        <option value="social">Social media</option>
        <option value="history">History</option>
      </select>

      <button id="graphReset">Reset</button>
    </div>

    <div id="essayGraph"></div>
    <div id="graphTooltip" class="graph-tooltip"></div>
  </section>

</div>

<script src="https://unpkg.com/force-graph"></script>
<script src="/assets/js/essay-graph.js"></script>