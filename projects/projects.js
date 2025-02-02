import { fetchJSON } from './global.js';

function renderProjects(projects, container) {
  container.innerHTML = ''; // Clear any existing content
  projects.forEach((project) => {
    const article = document.createElement('article');
    article.innerHTML = `
      <h2>${project.title}</h2>
      <img src="${project.image}" alt="${project.title}">
      <p>${project.description}</p>
    `;
    container.appendChild(article);
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  const projectsContainer = document.querySelector('.projects');
  const projects = await fetchJSON('lib/projects.json');
  if (projects) {
    renderProjects(projects, projectsContainer);
  } else {
    projectsContainer.innerHTML = '<p>Failed to load projects.</p>';
  }
});

