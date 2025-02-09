document.addEventListener("DOMContentLoaded", async () => {
  const projectsContainer = document.querySelector(".projects");

  try {
    const response = await fetch("projects.json");
    const projects = await response.json();

    projects.forEach(project => {
      const projectElement = document.createElement("div");
      projectElement.classList.add("project");
      projectElement.innerHTML = `
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <a href="${project.link}" target="_blank">View Project</a>
      `;
      projectsContainer.appendChild(projectElement);
    });
  } catch (error) {
    console.error("Failed to load projects:", error);
  }
});
