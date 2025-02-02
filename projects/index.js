import { fetchJSON } from './global.js';
import { renderProjects } from './projects.js';

document.addEventListener('DOMContentLoaded', async () => {
  const projectsContainer = document.querySelector('.latest-projects');
  const projects = await fetchJSON('lib/projects.json');
  if (projects) {
    const latestProjects = projects.slice(0, 3); // Get the first 3 projects
    renderProjects(latestProjects, projectsContainer);
  } else {
    projectsContainer.innerHTML = '<p>Failed to load projects.</p>';
  }
});
