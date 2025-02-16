// projects.js
import { fetchJSON, renderProjects } from '../global.js';

document.addEventListener('DOMContentLoaded', async () => {
    const projectsContainer = document.querySelector('.projects');
    const searchInput = document.getElementById('search-input');
    const legendContainer = document.getElementById('legend');
    let projects = [];

    try {
        projects = await fetchJSON('./lib/projects.json');
        if (projects) {
            renderProjects(projects, projectsContainer, 'h3');
            renderPieChart(projects);
        } else {
            console.error('No projects data found.');
        }
    } catch (error) {
        console.error('Failed to load projects:', error);
    }

    // Search functionality
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        const filteredProjects = projects.filter(project =>
            project.title.toLowerCase().includes(query) ||
            project.description.toLowerCase().includes(query) ||
            project.year.toString().includes(query)
        );
        renderProjects(filteredProjects, projectsContainer, 'h3');
        renderPieChart(filteredProjects);
    });
});

// Function to render a pie chart with D3.js
function renderPieChart(projects) {
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

    const color = d3.scaleOrdinal(d3.schemeCategory10);
    
    // Clear previous SVG and legend
    d3.select("#pie-chart").html('');
    legendContainer.innerHTML = '';

    const svg = d3.select("#pie-chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const pie = d3.pie().value(d => d.count);
    const arc = d3.arc().outerRadius(radius - 10).innerRadius(0);

    const arcs = svg.selectAll(".arc")
        .data(pie(data))
        .enter().append("g")
        .attr("class", "arc");

    arcs.append("path")
        .attr("d", arc)
        .style("fill", d => color(d.data.year))
        .on("click", (event, d) => {
            const filteredProjects = projects.filter(project => project.year.toString() === d.data.year);
            renderProjects(filteredProjects, document.querySelector('.projects'), 'h3');
            highlightLegendItem(d.data.year);
        });

    // Add legend
    data.forEach(d => {
        const li = document.createElement("li");
        li.style.color = color(d.year);
        li.textContent = `${d.year}: ${d.count} project(s)`;
        li.setAttribute("data-year", d.year);
        li.style.cursor = "pointer";
        li.addEventListener("click", () => {
            const filteredProjects = projects.filter(project => project.year.toString() === d.year);
            renderProjects(filteredProjects, document.querySelector('.projects'), 'h3');
            highlightLegendItem(d.year);
        });
        legendContainer.appendChild(li);
    });

    function highlightLegendItem(year) {
        document.querySelectorAll("#legend li").forEach(li => {
            li.style.fontWeight = li.getAttribute("data-year") === year ? "bold" : "normal";
        });
    }
}
