// Function to fetch JSON data
async function fetchJSON(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Could not fetch JSON from ${url}: ${error}`);
    return null;
  }
}

// Function to render projects
function renderProjects(projects, container) {
  container.innerHTML = ''; // Clear existing content
  projects.forEach((project) => {
    const article = document.createElement('article');
    article.innerHTML = `
      <h3>${project.title}</h3>
      <img src="${project.image}" alt="${project.title}">
      <p>${project.description}</p>
    `;
    container.appendChild(article);
  });
}

// Event listener to load the latest projects on DOMContentLoaded
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
