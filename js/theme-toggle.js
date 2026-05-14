// js/theme-toggle.js
document.addEventListener('DOMContentLoaded', () => {
  const themeBtn = document.getElementById('theme-toggle');
  if (!themeBtn) return;

  let isDark = false;

  themeBtn.addEventListener('click', () => {
    isDark = !isDark;
    
    // Toggle theme attribute
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    
    // Toggle icon using innerHTML (Font Awesome)
    themeBtn.innerHTML = isDark 
      ? '<i class="fa-regular fa-sun"></i>'   // ☀️ Light mode ke liye
      : '<i class="fa-regular fa-moon"></i>';  // 🌙 Dark mode ke liye
  });
});