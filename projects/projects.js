// projects.js
import { fetchJSON, renderProjects } from '../global.js';

document.addEventListener('DOMContentLoaded', async () => {
  const projectsContainer = document.querySelector('.projects');
  const searchInput = document.getElementById('search-input');
  let allProjects = [];

  try {
    allProjects = await fetchJSON('./lib/projects.json');
    if (allProjects) {
      // Always render projects list from the (possibly filtered) data
      renderProjects(allProjects, projectsContainer, 'h3');
      // Render the pie chart once, using the full dataset.
      renderPieChart(allProjects);
    } else {
      console.error('No projects data found.');
    }
  } catch (error) {
    console.error('Failed to load projects:', error);
  }

  // Search functionality: only filter the projects list.
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    const filteredProjects = allProjects.filter(project =>
      project.title.toLowerCase().includes(query) ||
      project.description.toLowerCase().includes(query) ||
      project.year.toString().includes(query)
    );
    renderProjects(filteredProjects, projectsContainer, 'h3');
    // Do not re-render pie chart on search.
  });
});

function renderPieChart(projects) {
  // Aggregate project counts by year
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

  // Use D3's schemeCategory10 for colors
  const color = d3.scaleOrdinal(d3.schemeCategory10);

  // Clear any existing pie chart
  clearPieChart();

  const svg = d3.select('#pie-chart')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', `translate(${width / 2}, ${height / 2})`);

  const pie = d3.pie()
    .value(d => d.count);

  const path = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

  const label = d3.arc()
    .outerRadius(radius)
    .innerRadius(radius - 80);

  const arc = svg.selectAll('.arc')
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
    .on('mouseover', function() {
      // Highlight the wedge on hover
      d3.select(this).select('path')
        .attr('stroke', 'black')
        .attr('stroke-width', 2);
    })
    .on('mouseout', function() {
      // Remove the highlight on mouse out
      d3.select(this).select('path')
        .attr('stroke', null)
        .attr('stroke-width', null);
    });

  arc.append('path')
    .attr('d', path)
    .attr('fill', d => color(d.data.year));

  arc.append('text')
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
  // Fetch all projects again (from a cached global variable or refetch if needed)
  // Here, we assume the full data is still stored in allProjects.
  // Since allProjects is declared in DOMContentLoaded, we can attach it to window for ease.
  const allProjects = window.allProjectsData || [];
  const filteredProjects = allProjects.filter(project => project.year == year);
  renderProjects(filteredProjects, projectsContainer, 'h3');
}

// Store the fetched projects in a global variable for filtering
// This is set once the DOM is loaded.
document.addEventListener('DOMContentLoaded', async () => {
  const projectsData = await fetchJSON('./lib/projects.json');
  if (projectsData) {
    window.allProjectsData = projectsData;
  }
});
