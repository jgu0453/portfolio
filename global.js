// Log a message to indicate the script is running
console.log('IT’S ALIVE!');

// Utility function to select multiple DOM elements
function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// Highlight the current page link in the navigation menu
function highlightCurrentPage() {
  const navLinks = $$('nav a');
  const currentPage = window.location.pathname;

  navLinks.forEach(link => {
    const linkPath = new URL(link.href).pathname;
    if (linkPath === currentPage) {
      link.classList.add('current');
    }
  });
}

// Automatically generate the navigation menu
function createNavMenu() {
  const navItems = [
    { name: 'Home', link: 'index.html' },
    { name: 'Projects', link: 'projects/index.html' },
    { name: 'Contact', link: 'contact/index.html' },
    { name: 'CV', link: 'CV/index.html' },
    { name: 'GitHub', link: 'https://github.com/jgu0453', external: true }
  ];

  const nav = document.createElement('nav');
  navItems.forEach(item => {
    const a = document.createElement('a');
    a.textContent = item.name;
    a.href = item.link;
    if (item.external) {
      a.target = '_blank';
    }
    nav.appendChild(a);
    nav.appendChild(document.createTextNode(' | '));
  });
  nav.lastChild.remove();
  document.body.insertBefore(nav, document.body.firstChild);
}

// Dark mode toggle functionality
function setupDarkModeToggle() {
  const themeToggle = document.getElementById('theme-toggle');

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
  }

  themeToggle.addEventListener('change', () => {
    if (themeToggle.checked) {
      setTheme('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      setTheme('light');
      localStorage.setItem('theme', 'light');
    }
  });

  // Load the saved theme from localStorage
  const savedTheme = localStorage.getItem('theme') || 'light';
  setTheme(savedTheme);
  themeToggle.checked = savedTheme === 'dark';
}

// Run all the functions on page load
document.addEventListener('DOMContentLoaded', () => {
  createNavMenu();
  highlightCurrentPage();
  setupDarkModeToggle();
});
