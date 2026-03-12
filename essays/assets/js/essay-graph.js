async function buildGraph(){

const res = await fetch("/essays.json");
const data = await res.json();

const nodes = data.nodes;
const links = [];


/* BUILD LINKS FROM TAGS */

for(let i=0;i<nodes.length;i++){

for(let j=i+1;j<nodes.length;j++){

const a = nodes[i];
const b = nodes[j];

const shared = a.tags.filter(t => b.tags.includes(t));

if(shared.length){

links.push({
source:a.id,
target:b.id,
weight:shared.length
});

}

}

}


/* GRAPH */

const Graph = ForceGraph()
(document.getElementById("essayGraph"))

.graphData({nodes,links})

.backgroundColor("#0f1012")

.nodeLabel(n=>n.title)

.nodeVal(2)

.nodeColor(n=>colorMap[n.cluster]||"#bbb")

.linkColor(()=> "rgba(255,255,255,0.12)")

.linkWidth(l=>0.5*l.weight)

.onNodeClick(n=>window.location=n.url)

.onNodeHover(showTooltip);



setTimeout(()=>Graph.zoomToFit(600,80),800);



/* TOOLTIP */

const tooltip = document.getElementById("graphTooltip");

function showTooltip(node){

if(!node){

tooltip.style.opacity=0;
return;

}

tooltip.innerHTML=`

<div class="graph-tooltip-title">${node.title}</div>
<div class="graph-tooltip-subtitle">${node.subtitle}</div>

`;

tooltip.style.opacity=1;

}

window.addEventListener("mousemove",e=>{

tooltip.style.left=e.clientX+"px";
tooltip.style.top=e.clientY+"px";

});


/* COLORS */

const colorMap = {

neuroscience:"#59a5ff",
behavioral:"#d889ff",
systems:"#e3df59",
social:"#60d685",
history:"#b9b9b9"

};


/* SEARCH */

document.getElementById("graphSearch").addEventListener("input",e=>{

const q=e.target.value.toLowerCase();

Graph.graphData({

nodes:nodes.filter(n=>n.title.toLowerCase().includes(q)),

links:links

});

});


/* FILTER */

document.getElementById("graphClusterFilter").addEventListener("change",e=>{

const c=e.target.value;

if(c==="all"){

Graph.graphData({nodes,links});
return;

}

Graph.graphData({

nodes:nodes.filter(n=>n.cluster===c),

links

});

});


/* RESET */

document.getElementById("graphReset").onclick=()=>{

Graph.graphData({nodes,links});
Graph.zoomToFit(600,80);

};


}


/* HERO SCROLL */

const heroInner = document.querySelector(".essay-hero-inner");

window.addEventListener("scroll",()=>{

const s = window.scrollY;

heroInner.style.transform=`translateY(-${s*0.5}px)`;
heroInner.style.opacity=1-s/500;

});


buildGraph();