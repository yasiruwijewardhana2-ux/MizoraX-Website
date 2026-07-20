document.addEventListener('DOMContentLoaded', async () => {
  const loginScreen = document.getElementById('admin-login-screen');
  const appScreen = document.getElementById('admin-app');

  // Init Data Layer
  await movieService.init();
  SettingsService.init();

  if (Auth.isAdmin()) {
    loginScreen.classList.add('hidden');
    appScreen.classList.remove('hidden');
    initDashboard();
  } else {
    loginScreen.classList.remove('hidden');
    appScreen.classList.add('hidden');
  }

  // Login handler
  document.getElementById('login-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const u = document.getElementById('username').value;
    const p = document.getElementById('password').value;
    if (Auth.login(u, p)) {
      window.location.reload();
    } else {
      alert('ACCESS DENIED: Invalid credentials.');
    }
  });

  // Logout handler
  document.getElementById('logout-btn')?.addEventListener('click', () => {
    Auth.logout();
  });
});

// SPA Routing & Initialization
function initDashboard() {
  // Setup Navigation
  const navLinks = document.querySelectorAll('.nav-link');
  const views = document.querySelectorAll('.admin-view');
  const topbarTitle = document.getElementById('topbar-title');
  const sidebarLogo = document.getElementById('sidebar-logo');

  // Inject dynamic logo based on settings
  const settings = SettingsService.getSettings();
  if(sidebarLogo) {
      sidebarLogo.innerHTML = `${settings.logoText1}<span class="text-cyber-blue">${settings.logoText2}</span>`;
  }

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      // Update links
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      
      // Update title
      topbarTitle.innerText = link.innerText.trim();

      // Switch view
      const targetId = link.getAttribute('data-target');
      views.forEach(v => {
        if(v.id === targetId) {
            v.classList.add('active');
        } else {
            v.classList.remove('active');
        }
      });

      // Execute view specific logic
      if(targetId === 'view-dashboard') renderDashboardStats();
      if(targetId === 'view-movies') renderMoviesTable();
      if(targetId === 'view-homepage') renderHomepageManager();
      if(targetId === 'view-settings') loadSettingsForm();

      // Close sidebar on mobile
      if(window.innerWidth <= 1024) {
          document.getElementById('sidebar').classList.remove('open');
      }
    });
  });

  // Initial renders
  renderDashboardStats();
  renderMoviesTable();
  renderHomepageManager();
  loadSettingsForm();
  setupMovieForm();
  setupSettingsForm();
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
}

// ==========================================
// DASHBOARD VIEW
// ==========================================
function renderDashboardStats() {
    const all = movieService.getAll();
    document.getElementById('stat-total').innerText = all.length;
    document.getElementById('stat-anime').innerText = all.filter(m => m.category === 'Anime').length;
    document.getElementById('stat-series').innerText = all.filter(m => m.category === 'TV Series').length;
    document.getElementById('stat-cartoons').innerText = all.filter(m => m.category === 'Cartoons').length;
    
    // Movies stat (if element exists)
    const moviesStat = document.getElementById('stat-movies');
    if(moviesStat) moviesStat.innerText = all.filter(m => m.category === 'Movies').length;
}

// ==========================================
// MOVIES VIEW
// ==========================================
function renderMoviesTable() {
  const tbody = document.getElementById('movies-tbody');
  if(!tbody) return;
  tbody.innerHTML = '';
  
  // Sort reverse to show newest first
  movieService.getAll().slice().reverse().forEach(m => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <div class="font-display font-bold text-gray-200">${m.title}</div>
        <div class="text-xs text-gray-500 mt-1">${m.genre || ''}</div>
      </td>
      <td>
        <span class="px-2 py-1 text-[10px] rounded border uppercase font-bold tracking-wider ${
          m.category === 'Anime' ? 'text-cyber-purple border-cyber-purple bg-cyber-purple bg-opacity-20' : 
          m.category === 'Movies' ? 'text-green-400 border-green-500 bg-green-500 bg-opacity-20' : 
          m.category === 'Cartoons' ? 'text-cyber-blue border-cyber-blue bg-cyber-blue bg-opacity-20' : 
          'text-pink-400 border-pink-500 bg-pink-500 bg-opacity-20'
        }">${m.category}</span>
      </td>
      <td class="font-mono text-gray-400">${m.year}</td>
      <td class="text-right whitespace-nowrap">
        <button onclick="editMovie(${m.id})" class="text-cyber-blue mr-3 hover:text-white font-bold text-xs uppercase tracking-widest transition">Edit</button>
        <button onclick="deleteMovie(${m.id})" class="text-red-500 hover:text-red-400 font-bold text-xs uppercase tracking-widest transition">Del</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function setupMovieForm() {
    document.getElementById('movie-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('movie-id').value;
      const movie = {
        id: id ? parseInt(id) : null,
        title: document.getElementById('movie-title').value,
        category: document.getElementById('movie-category').value,
        type: document.getElementById('movie-type').value,
        genre: document.getElementById('movie-genre').value,
        duration: document.getElementById('movie-duration').value,
        quality: '4K HDR',
        poster: document.getElementById('movie-poster').value,
        banner: document.getElementById('movie-banner').value,
        description: document.getElementById('movie-desc').value,
        year: document.getElementById('movie-year').value,
        rating: document.getElementById('movie-rating').value,
        trailerUrl: document.getElementById('movie-trailer').value,
        streamUrl: document.getElementById('movie-stream').value,
        // Preserve featured/trending state if editing
        featured: false,
        trending: false
      };

      if(id) {
          const existing = movieService.getById(id);
          if(existing) {
              movie.featured = existing.featured;
              movie.trending = existing.trending;
          }
      }

      movieService.saveMovie(movie);
      
      const form = document.getElementById('movie-form');
      form.reset();
      document.getElementById('movie-id').value = '';
      
      // Feedback
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.innerHTML = 'RECORD SAVED';
      btn.classList.add('bg-green-500', 'border-green-500', 'text-white');
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.classList.remove('bg-green-500', 'border-green-500', 'text-white');
      }, 1500);

      renderMoviesTable();
      renderDashboardStats();
      renderHomepageManager();
    });
}

window.editMovie = (id) => {
  const m = movieService.getById(id);
  if(m) {
    document.getElementById('movie-id').value = m.id;
    document.getElementById('movie-title').value = m.title;
    document.getElementById('movie-category').value = m.category;
    document.getElementById('movie-type').value = m.type || 'Movie';
    document.getElementById('movie-genre').value = m.genre || '';
    document.getElementById('movie-duration').value = m.duration || '';
    document.getElementById('movie-poster').value = m.poster;
    document.getElementById('movie-banner').value = m.banner;
    document.getElementById('movie-desc').value = m.description;
    document.getElementById('movie-year').value = m.year;
    document.getElementById('movie-rating').value = m.rating;
    document.getElementById('movie-trailer').value = m.trailerUrl || '';
    document.getElementById('movie-stream').value = m.streamUrl || '';
  }
}

window.deleteMovie = (id) => {
  if(confirm("CRITICAL WARNING: Purge this record from the database?")) {
    movieService.deleteMovie(id);
    renderMoviesTable();
    renderDashboardStats();
    renderHomepageManager();
  }
}


// ==========================================
// HOMEPAGE MANAGER (FLAGS)
// ==========================================
function renderHomepageManager() {
    const fContainer = document.getElementById('featured-checkboxes');
    const tContainer = document.getElementById('trending-checkboxes');
    if(!fContainer || !tContainer) return;
    
    fContainer.innerHTML = '';
    tContainer.innerHTML = '';

    movieService.getAll().forEach(m => {
        // Featured Checkbox
        const fl = document.createElement('label');
        fl.className = 'flex items-center space-x-3 cursor-pointer group';
        fl.innerHTML = `
            <input type="checkbox" class="accent-cyber-blue w-4 h-4" onchange="toggleFlag(${m.id}, 'featured', this.checked)" ${m.featured ? 'checked' : ''}>
            <span class="text-sm text-gray-300 group-hover:text-white truncate max-w-xs">${m.title}</span>
        `;
        fContainer.appendChild(fl);

        // Trending Checkbox
        const tl = document.createElement('label');
        tl.className = 'flex items-center space-x-3 cursor-pointer group';
        tl.innerHTML = `
            <input type="checkbox" class="accent-cyber-purple w-4 h-4" onchange="toggleFlag(${m.id}, 'trending', this.checked)" ${m.trending ? 'checked' : ''}>
            <span class="text-sm text-gray-300 group-hover:text-white truncate max-w-xs">${m.title}</span>
        `;
        tContainer.appendChild(tl);
    });
}

window.toggleFlag = (id, flag, state) => {
    const movie = movieService.getById(id);
    if(movie) {
        movie[flag] = state;
        movieService.saveMovie(movie);
    }
}

// ==========================================
// SETTINGS VIEW
// ==========================================
function loadSettingsForm() {
    const s = SettingsService.getSettings();
    document.getElementById('set-title').value = s.siteTitle;
    document.getElementById('set-logo1').value = s.logoText1;
    document.getElementById('set-logo2').value = s.logoText2;
    document.getElementById('set-hero').value = s.heroSubtitle;
    document.getElementById('set-about').value = s.aboutText;
    document.getElementById('set-credits').value = s.footerCredits;
}

function setupSettingsForm() {
    document.getElementById('settings-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const newSettings = {
            siteTitle: document.getElementById('set-title').value,
            logoText1: document.getElementById('set-logo1').value,
            logoText2: document.getElementById('set-logo2').value,
            heroSubtitle: document.getElementById('set-hero').value,
            aboutText: document.getElementById('set-about').value,
            footerCredits: document.getElementById('set-credits').value
        };
        
        SettingsService.updateSettings(newSettings);
        
        // Instant visual update on sidebar
        const sidebarLogo = document.getElementById('sidebar-logo');
        if(sidebarLogo) {
            sidebarLogo.innerHTML = `${newSettings.logoText1}<span class="text-cyber-blue">${newSettings.logoText2}</span>`;
        }

        const btn = e.target.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.innerHTML = 'SETTINGS COMMITTED';
        btn.classList.add('bg-green-500', 'border-green-500', 'text-white');
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.classList.remove('bg-green-500', 'border-green-500', 'text-white');
        }, 1500);
    });
}

// ==========================================
// DATA RESET UTILITY
// ==========================================
window.resetMizoraXData = () => {
    if(confirm("This will reset all movie data to defaults. Continue?")) {
        localStorage.removeItem('mizorax_movies');
        localStorage.removeItem('mizorax_settings');
        window.location.reload();
    }
}
