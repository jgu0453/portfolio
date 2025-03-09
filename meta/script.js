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

  document.getElementById("summary-stats").innerHTML = 
    <p><strong>Total Commits:</strong> ${totalCommits}</p>
    <p><strong>Lines Added:</strong> ${totalLinesAdded}</p>
    <p><strong>Files Affected:</strong> ${totalFiles}</p>
  ;

  // Scatterplot Setup
  const container = document.getElementById("scatterplot");
  const width = container.clientWidth - 100, height = 500, margin = { top: 50, right: 50, bottom: 50, left: 70 };
  
  const svg = d3.select("#scatterplot").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .style("max-width", "100%")
    .style("overflow", "hidden")
    .append("g")
    .attr("transform", translate(${margin.left},${margin.top}));

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
    .attr("transform", translate(0,${height}))
    .call(d3.axisBottom(xScale).ticks(10));

  svg.append("g")
    .call(d3.axisLeft(yScale).tickFormat(d => ${d}:00));

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
    .text(d => Commit: ${d.commit}\nLines Changed: ${d.length});

  // Title
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", -10)
    .attr("font-size", "20px")
    .attr("font-weight", "bold")
    .attr("text-anchor", "middle")
    .text("Commits by time of day");

  // Commit Scrollytelling with Scrollable Section
  const commitScrolly = d3.select("#commit-scrollytelling")
    .style("max-height", "300px") // Set a fixed height
    .style("overflow-y", "auto") // Enable scrolling
    .style("border", "1px solid #ddd") // Add a border for visibility
    .style("padding", "10px");

  commitScrolly.selectAll("p")
    .data(data)
    .enter().append("p")
    .html(d => 
      On ${d.datetime.toLocaleString("en", { dateStyle: "full", timeStyle: "short" })}, I made
      <a href="https://github.com/jgu0453/commit/${d.commit}" target="_blank">
        ${d.commit === data[0].commit ? 'my first commit, and it was glorious' : 'another glorious commit'}
      </a>. 
      I edited ${d.length} lines across 1 file. Then I looked over all I had made, and I saw that it was very good.
    );

  // File Size Visualization
  const fileData = d3.rollups(data, v => d3.sum(v, d => d.length), d => d.file);

  const fileWidth = 600, fileHeight = 300;
  const fileSvg = d3.select("#file-size-viz").append("svg")
    .attr("width", fileWidth)
    .attr("height", fileHeight);

  const xScaleFile = d3.scaleBand()
    .domain(fileData.map(d => d[0]))
    .range([0, fileWidth])
    .padding(0.1);

  const yScaleFile = d3.scaleLinear()
    .domain([0, d3.max(fileData, d => d[1])])
    .range([fileHeight, 0]);

  fileSvg.selectAll(".bar")
    .data(fileData)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", d => xScaleFile(d[0]))
    .attr("y", d => yScaleFile(d[1]))
    .attr("width", xScaleFile.bandwidth())
    .attr("height", d => fileHeight - yScaleFile(d[1]))
    .attr("fill", "steelblue");

  fileSvg.append("g")
    .attr("transform", translate(0,${fileHeight}))
    .call(d3.axisBottom(xScaleFile));

  fileSvg.append("g")
    .call(d3.axisLeft(yScaleFile));
});
