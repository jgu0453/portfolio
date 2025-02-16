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
