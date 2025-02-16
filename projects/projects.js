// projects.js
import { fetchJSON, renderProjects } from '../global.js';

document.addEventListener('DOMContentLoaded', async () => {
  const projectsContainer = document.querySelector('.projects');
  const searchInput = document.getElementById('search-input');
  let allProjects = [];

  try {
    allProjects = await fetchJSON('./lib/projects.json');
    if (allProjects) {
      // Save full dataset globally for filtering by pie chart clicks.
      window.allProjectsData = allProjects;
      // Render full projects list
      renderProjects(allProjects, projectsContainer, 'h3');
      // Render the pie chart once using the full dataset.
      renderPieChart(allProjects);
    } else {
      console.error('No projects data found.');
    }
  } catch (error) {
    console.error('Failed to load projects:', error);
  }

  // Search functionality: filter the projects list only.
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    const filteredProjects = allProjects.filter(project =>
      project.title.toLowerCase().includes(query) ||
      project.description.toLowerCase().includes(query) ||
      project.year.toString().includes(query)
    );
    renderProjects(filteredProjects, projectsContainer, 'h3');
    // Do not re-render the pie chart on search.
  });
});

function renderPieChart(projects) {
  // Aggregate project counts by year from the full dataset
  const yearCounts = projects.reduce((acc, project) => {
    acc[project.year] = (acc[project.year] || 0) + 1;
    return acc;
  }, {});

  const data = Object.entries(yearCounts).map(([year, count]) => ({
    year: year,
    count: count
  }));

  const width = 400;
  const height = 400;
  const radius = Math.min(width, height) / 2;
  const hoverRadius = radius - 10 + 10; // Increase outer radius by 10 on hover

  // Use D3's schemeCategory10 for colors
  const color = d3.scaleOrdinal(d3.schemeCategory10);

  // Clear any existing pie chart elements
  clearPieChart();

  const svg = d3.select('#pie-chart')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', `translate(${width / 2}, ${height / 2})`);

  const pie = d3.pie()
    .value(d => d.count);

  // Define the default arc generator.
  const arcGenerator = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

  // Define a hover arc generator that produces a slightly larger arc.
  const arcHover = d3.arc()
    .outerRadius(hoverRadius)
    .innerRadius(0);

  // Define label generator.
  const label = d3.arc()
    .outerRadius(radius)
    .innerRadius(radius - 80);

  const arcs = svg.selectAll('.arc')
    .data(pie(data))
    .enter().append('g')
    .attr('class', 'arc')
    .attr('tabindex', '0')
    .on('click', (event, d) => {
      filterProjectsByYear(d.data.year);
    })
    .on('keydown', (event, d) => {
      if (event.key === 'Enter' || event.key === ' ') {
        filterProjectsByYear(d.data.year);
      }
    })
    .on('mouseover', function(event, d) {
      // Transition the arc to a larger size
      d3.select(this).select('path')
        .transition()
        .duration(200)
        .attr('d', arcHover);
    })
    .on('mouseout', function(event, d) {
      // Transition back to the default size
      d3.select(this).select('path')
        .transition()
        .duration(200)
        .attr('d', arcGenerator);
    });

  arcs.append('path')
    .attr('d', arcGenerator)
    .attr('fill', d => color(d.data.year));

  arcs.append('text')
    .attr('transform', d => `translate(${label.centroid(d)})`)
    .attr('dy', '0.35em')
    .text(d => d.data.year);

  // Create legend for the pie chart
  renderLegend(data, color);
}

function renderLegend(data, color) {
  // Clear any existing legend content
  d3.select('#legend').selectAll('*').remove();

  const legend = d3.select('#legend')
    .append('ul')
    .style('list-style', 'none')
    .style('padding', '0');

  data.forEach(item => {
    legend.append('li')
      .html(`<span style="display:inline-block;width:12px;height:12px;background:${color(item.year)};margin-right:6px;"></span>${item.year}: ${item.count}`);
  });
}

function clearPieChart() {
  d3.select('#pie-chart').selectAll('*').remove();
  d3.select('#legend').selectAll('*').remove();
}

function filterProjectsByYear(year) {
  const projectsContainer = document.querySelector('.projects');
  const allProjects = window.allProjectsData || [];
  const filteredProjects = allProjects.filter(project => project.year == year);
  renderProjects(filteredProjects, projectsContainer, 'h3');
}
