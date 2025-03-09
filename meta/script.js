import { fetchJSON } from "../global.js";

document.addEventListener("DOMContentLoaded", async () => {
  const data = await fetchJSON("loc.csv");

  if (!data) {
    console.error("Failed to load commit data.");
    return;
  }

  // Process data
  data.forEach(d => {
    d.datetime = new Date(d.datetime);
    d.length = +d.length;
  });

  // Summary Statistics
  const totalCommits = new Set(data.map(d => d.commit)).size;
  const totalLinesAdded = d3.sum(data, d => d.length);
  const totalFiles = new Set(data.map(d => d.file)).size;

  document.getElementById("summary-stats").innerHTML = `
    <p><strong>Total Commits:</strong> ${totalCommits}</p>
    <p><strong>Lines Added:</strong> ${totalLinesAdded}</p>
    <p><strong>Files Affected:</strong> ${totalFiles}</p>
  `;

  // Scatterplot Setup
  const width = 900, height = 500, margin = { top: 50, right: 50, bottom: 50, left: 70 };
  
  const svg = d3.select("#scatterplot").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const xScale = d3.scaleTime()
    .domain(d3.extent(data, d => d.datetime))
    .range([0, width]);

  const yScale = d3.scaleLinear()
    .domain([0, 24])
    .range([height, 0]);

  const rScale = d3.scaleSqrt()
    .domain([0, d3.max(data, d => d.length)])
    .range([5, 30]);

  // Axes
  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScale).ticks(10));

  svg.append("g")
    .call(d3.axisLeft(yScale).tickFormat(d => `${d}:00`));

  // Plot circles with animation
  svg.selectAll("circle")
    .data(data)
    .enter().append("circle")
    .attr("cx", d => xScale(d.datetime))
    .attr("cy", d => yScale(d.datetime.getHours()))
    .attr("r", 0) // Start small
    .attr("fill", "steelblue")
    .attr("opacity", 0.7)
    .transition()
    .duration(1000)
    .attr("r", d => rScale(d.length));

  // Tooltip
  svg.selectAll("circle")
    .append("title")
    .text(d => `Commit: ${d.commit}\nLines Changed: ${d.length}`);

  // Title
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", -10)
    .attr("font-size", "20px")
    .attr("font-weight", "bold")
    .attr("text-anchor", "middle")
    .text("Commits by time of day");
});
