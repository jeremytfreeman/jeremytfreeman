//theming.js

// Fetch theme data from JSON file
export async function fetchThemes() {
  try {
    const response = await fetch("./theme.json"); // Ensure path is correct
    if (!response.ok) throw new Error("Failed to fetch themes JSON");
    const themes = await response.json();
    return themes;
  } catch (error) {
    console.error("Error fetching themes:", error);
    return null; // Return null if there's an error
  }
}

// Function to apply theme to CSS variables
export function applyTheme(theme) {
  for (let [key, value] of Object.entries(theme)) {
    document.documentElement.style.setProperty(key, value);
  }
}

// Function to change and save theme to local storage
export async function changeTheme(themeName) {
  const themes = await fetchThemes();
  if (themes && themes[themeName]) {
    applyTheme(themes[themeName]);
    localStorage.setItem("selectedTheme", themeName); // Save current theme
  } else {
    console.error(`Theme "${themeName}" not found`);
  }
}

// Load saved theme from local storage on initial load
export async function loadSavedTheme() {
  const savedTheme = localStorage.getItem("selectedTheme");
  if (savedTheme) {
    await changeTheme(savedTheme); // Load saved theme if it exists
  }
}

// Event handler to cycle through themes
export async function cycleThemes() {
  const themes = await fetchThemes();
  if (themes) {
    const themeNames = Object.keys(themes);
    let currentIndex = parseInt(localStorage.getItem("currentThemeIndex")) || 0;

    // Apply the next theme in the list
    const nextThemeName = themeNames[currentIndex];
    applyTheme(themes[nextThemeName]);

    // Update the index, cycling back to 0 if it reaches the end
    currentIndex = (currentIndex + 1) % themeNames.length;
    localStorage.setItem("currentThemeIndex", currentIndex);
    localStorage.setItem("selectedTheme", nextThemeName); // Save current theme
  } else {
    console.error("Could not load themes for cycling.");
  }
}

/*
// Switch themes
export function switchTheme() {
  const styleSheet = document.getElementById("themeStylesheet");
  const currentTheme = styleSheet.getAttribute("href");

  // Set the href attribute based on the theme
  if (currentTheme.includes("dark.css")) {
    styleSheet.setAttribute("href", "./css/light.css");
  } else {
    styleSheet.setAttribute("href", "./css/dark.css");
  }

  // Store theme in localStorage
  localStorage.setItem("theme", styleSheet.getAttribute("href"));
}
window.switchTheme = switchTheme;

// Function to load the theme on page load
export function loadTheme() {
  const savedTheme = localStorage.getItem("theme");
  // If a theme was saved, apply it
  if (savedTheme) {
    document.getElementById("themeStylesheet").setAttribute("href", savedTheme);
  } else {
    document
      .getElementById("themeStylesheet")
      .setAttribute("href", "./css/dark.css"); // Apply default theme
  }
}
*/
