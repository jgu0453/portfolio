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

  // Commit Scrollytelling
  const commitScrolly = d3.select("#commit-scrollytelling");

  commitScrolly.selectAll("p")
    .data(data)
    .enter().append("p")
    .html(d => `
      On ${d.datetime.toLocaleString("en", { dateStyle: "full", timeStyle: "short" })}, I made
      <a href="https://github.com/jgu0453/commit/${d.commit}" target="_blank">
        ${d.commit === data[0].commit ? 'my first commit, and it was glorious' : 'another glorious commit'}
      </a>. 
      I edited ${d.length} lines across 1 file. Then I looked over all I had made, and I saw that it was very good.
    `);

  // File Size Visualization
  const fileData = d3.rollups(data, v => d3.sum(v, d => d.length), d => d.file);

  const width = 600, height = 300;
  const svg = d3.select("#file-size-viz").append("svg")
    .attr("width", width)
    .attr("height", height);

  const xScale = d3.scaleBand()
    .domain(fileData.map(d => d[0]))
    .range([0, width])
    .padding(0.1);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(fileData, d => d[1])])
    .range([height, 0]);

  svg.selectAll(".bar")
    .data(fileData)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", d => xScale(d[0]))
    .attr("y", d => yScale(d[1]))
    .attr("width", xScale.bandwidth())
    .attr("height", d => height - yScale(d[1]))
    .attr("fill", "steelblue");

  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScale));

  svg.append("g")
    .call(d3.axisLeft(yScale));
});
