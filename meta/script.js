import { fetchJSON } from "../global.js";

document.addEventListener("DOMContentLoaded", async () => {
  const data = await fetchJSON("loc.csv"); // Ensure this CSV is generated and correctly located

  if (!data) {
    console.error("Failed to load commit data.");
    return;
  }

  // Summary Statistics
  const totalCommits = new Set(data.map(d => d.commit)).size; // Count unique commits
  const totalLinesAdded = d3.sum(data, d => +d.length); // Assuming 'length' represents added lines
  const totalFiles = new Set(data.map(d => d.file)).size; // Count unique files

  document.getElementById("summary-stats").innerHTML = `
    <p><strong>Total Commits:</strong> ${totalCommits}</p>
    <p><strong>Lines Added:</strong> ${totalLinesAdded}</p>
    <p><strong>Files Affected:</strong> ${totalFiles}</p>
  `;

  // Scatterplot Setup
  const width = 700, height = 400, margin = { top: 50, right: 30, bottom: 50, left: 70 };
  
  const svg = d3.select("#scatterplot").append("svg")
    .attr("width", "100%")
    .attr("height", "auto")
    .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})");

  const xScale = d3.scaleTime()
    .domain(d3.extent(data, d => new Date(d.datetime)))
    .range([0, width]);

  const yScale = d3.scaleLinear()
    .domain([0, 24]) // Time of day from 0:00 to 24:00
    .range([height, 0]);

  const rScale = d3.scaleSqrt()
    .domain([0, d3.max(data, d => +d.length)])
    .range([5, 30]); // Bubble size based on lines changed

  // Axes
  const xAxis = d3.axisBottom(xScale).ticks(10);
  const yAxis = d3.axisLeft(yScale).tickFormat(d => `${d}:00`);

  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(xAxis);

  svg.append("g")
    .call(yAxis);

  // Plot circles
  svg.selectAll("circle")
    .data(data)
    .enter().append("circle")
    .attr("cx", d => xScale(new Date(d.datetime)))
    .attr("cy", d => yScale(new Date(d.datetime).getHours()))
    .attr("r", d => rScale(d.length))
    .attr("fill", "steelblue")
    .attr("opacity", 0.7)
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
