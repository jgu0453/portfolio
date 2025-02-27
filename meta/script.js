import { fetchJSON } from "../global.js";

document.addEventListener("DOMContentLoaded", async () => {
  const data = await fetchJSON("commit_data.csv"); // Ensure this CSV is generated

  if (!data) {
    console.error("Failed to load commit data.");
    return;
  }

  // Summary Statistics
  const totalCommits = data.length;
  const totalLinesAdded = d3.sum(data, d => +d.lines_added);
  const totalLinesDeleted = d3.sum(data, d => +d.lines_deleted);

  document.getElementById("summary-stats").innerHTML = `
    <p><strong>Total Commits:</strong> ${totalCommits}</p>
    <p><strong>Lines Added:</strong> ${totalLinesAdded}</p>
    <p><strong>Lines Deleted:</strong> ${totalLinesDeleted}</p>
  `;

  // Scatterplot Setup
  const width = 800, height = 400;
  const svg = d3.select("#scatterplot").append("svg")
    .attr("width", width)
    .attr("height", height);

  const xScale = d3.scaleTime()
    .domain(d3.extent(data, d => new Date(d.timestamp)))
    .range([50, width - 50]);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.lines_added + d.lines_deleted)])
    .range([height - 50, 50]);

  svg.selectAll("circle")
    .data(data)
    .enter().append("circle")
    .attr("cx", d => xScale(new Date(d.timestamp)))
    .attr("cy", d => yScale(d.lines_added + d.lines_deleted))
    .attr("r", 5)
    .attr("fill", "steelblue")
    .append("title")
    .text(d => `Commit at ${d.timestamp}\nLines Changed: ${d.lines_added + d.lines_deleted}`);
});
