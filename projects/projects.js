import { fetchJSON, renderProjects } from '../global.js';

document.addEventListener('DOMContentLoaded', async () => {
  const projectsContainer = document.querySelector('.projects');
  const projects = await fetchJSON('../lib/projects.json');
  if (projects) {
    renderProjects(projects, projectsContainer);
  } else {
    projectsContainer.innerHTML = '<p>Failed to load projects.</p>';
  }
});
