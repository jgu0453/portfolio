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
  const width = 800, height = 400;
  const svg = d3.select("#scatterplot").append("svg")
    .attr("width", width)
    .attr("height", height);

  const xScale = d3.scaleTime()
    .domain(d3.extent(data, d => new Date(d.datetime)))
    .range([50, width - 50]);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => +d.length)]) // Use 'length' as the y-axis value
    .range([height - 50, 50]);

  svg.selectAll("circle")
    .data(data)
    .enter().append("circle")
    .attr("cx", d => xScale(new Date(d.datetime)))
    .attr("cy", d => yScale(d.length)) // Plot the 'length' (lines added) on y-axis
    .attr("r", 5)
    .attr("fill", "steelblue")
    .append("title")
    .text(d => `Commit: ${d.commit}\nLines Changed: ${d.length}`);
});
