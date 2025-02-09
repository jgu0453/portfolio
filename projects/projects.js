// projects.js
import { fetchJSON, renderProjects } from '../global.js';

document.addEventListener('DOMContentLoaded', async () => {
    const projectsContainer = document.querySelector('.projects');

    try {
        const projects = await fetchJSON('projects.json');
        if (projects) {
            renderProjects(projects, projectsContainer, 'h3');
        } else {
            console.error('No projects data found.');
        }
    } catch (error) {
        console.error('Failed to load projects:', error);
    }
});
