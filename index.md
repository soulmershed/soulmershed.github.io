---
layout: page
title: ""
permalink: /
---
<div class="home-hero">
  <div class="arabic-name">ســـليمان بن بســـام مـــرشد</div>
  <h1>SOULAIMAN B. MERSHED</h1>
  <p class="tagline">On cognition, media, and social dynamics.</p>
</div>

</section>

  <div class="home-graph-wrap">
    <div class="home-graph-controls">
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
  </div>

</div>

<script src="https://unpkg.com/force-graph"></script>
<script src="/assets/js/home-graph.js"></script>