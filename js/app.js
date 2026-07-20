document.addEventListener('DOMContentLoaded', async () => {
  // Mobile Menu
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // Remove loading overlay
  setTimeout(() => {
    const loader = document.getElementById('loading-overlay');
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => loader.remove(), 600);
    }
  }, 1000);

  // Navbar Scroll Effect
  const navbar = document.getElementById('main-nav');
  if(navbar) {
    window.addEventListener('scroll', () => {
      if(window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // Initialize movies service and settings
  if (!window.location.pathname.includes('admin.html')) {
    await movieService.init();
    SettingsService.init();
    
    applyGlobalSettings();

    if (window.initPage) {
      window.initPage();
    }

    // Initialize scroll reveal for sections
    initScrollReveal();
  }
});

function applyGlobalSettings() {
    const s = SettingsService.getSettings();
    
    // Page Title
    document.title = s.siteTitle;
    
    // Navbar Logo
    const navLogo = document.getElementById('nav-logo');
    if(navLogo) {
        navLogo.innerHTML = `${s.logoText1}<span class="text-cyber-blue neon-text-blue">${s.logoText2}</span>`;
    }

    // Footer Logo
    const footerLogo = document.getElementById('footer-logo');
    if(footerLogo) {
        footerLogo.innerHTML = `${s.logoText1}<span class="text-cyber-blue">${s.logoText2}</span>`;
    }

    // Hero Subtitle (only on index)
    const heroSubtitle = document.getElementById('hero-subtitle-global');
    if(heroSubtitle) heroSubtitle.innerText = s.heroSubtitle;

    // Footer About & Credits
    const footerAbout = document.getElementById('footer-about');
    if(footerAbout) footerAbout.innerText = s.aboutText;
    
    const footerCredits = document.getElementById('footer-credits');
    if(footerCredits) footerCredits.innerHTML = s.footerCredits;
}

// ===================================================
// PREMIUM MOVIE CARD — Enhanced Design
// ===================================================
function createMovieCard(movie) {
  const qualityBadge = movie.quality === '4K HDR' 
    ? '<span class="quality-badge">4K HDR</span>' 
    : movie.quality === '4K' 
    ? '<span class="quality-badge">4K</span>' 
    : '<span class="quality-badge" style="border-color: rgba(148,163,184,0.3); color: #94a3b8; background: rgba(148,163,184,0.1);">HD</span>';

  return `
    <div class="movie-card premium-glass rounded-xl overflow-hidden relative group cursor-pointer h-[220px] sm:h-[280px] md:h-[340px]" onclick="window.location.href='movie-details.html?id=${movie.id}'">
      <img src="${movie.poster}" alt="${movie.title}" loading="lazy" class="w-full h-full object-cover opacity-80 group-hover:opacity-100">
      
      <!-- Top Badges -->
      <div class="absolute top-2 left-2 right-2 flex justify-between z-20 pointer-events-none">
          <div class="flex items-center gap-1.5">
            ${qualityBadge}
            <div class="bg-black bg-opacity-70 backdrop-blur px-2 py-1 rounded border border-cyber-border flex items-center">
               <span class="text-[9px] font-bold text-gray-300 tracking-widest">${movie.duration || 'TBA'}</span>
            </div>
          </div>
          <div class="bg-black bg-opacity-70 backdrop-blur px-2 py-1 rounded border border-cyber-border flex items-center">
             <svg class="w-3 h-3 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
             <span class="text-xs font-bold text-white">${movie.rating}</span>
          </div>
      </div>

      <!-- Hover Overlay Content -->
      <div class="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-90 transition duration-500 z-10 pointer-events-none group-hover:opacity-100"></div>
      
      <div class="hover-content absolute inset-0 flex flex-col justify-center items-center z-20 p-4">
          <div class="w-14 h-14 rounded-full btn-neon-blue flex items-center justify-center mb-4 transform scale-90 group-hover:scale-100 transition duration-300 play-btn-pulse">
             <svg class="w-6 h-6 ml-1 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4l12 6-12 6z"></path></svg>
          </div>
          <p class="text-[10px] text-gray-400 font-mono tracking-widest mb-3 uppercase">${movie.genre || movie.category}</p>
          <button class="px-5 py-1.5 text-xs font-display border border-white rounded-full bg-white bg-opacity-10 hover:bg-opacity-30 transition font-bold tracking-widest backdrop-blur-sm">DETAILS</button>
      </div>

      <!-- Base Content (Always visible at bottom) -->
      <div class="absolute bottom-0 w-full p-3 sm:p-4 z-20 transition duration-500 group-hover:opacity-0">
        <h3 class="text-xs sm:text-sm md:text-base font-bold font-display text-white truncate drop-shadow-lg">${movie.title}</h3>
        <div class="flex justify-between items-center mt-2">
          <span class="text-[10px] text-gray-300 font-bold bg-black bg-opacity-50 px-1.5 rounded">${movie.year}</span>
          <span class="text-[8px] sm:text-[9px] px-1.5 py-0.5 rounded border ${getCategoryColors(movie.category)} uppercase tracking-wider font-bold backdrop-blur-md">
            ${movie.category}
          </span>
        </div>
      </div>
      
      <!-- Border Glow -->
      <div class="absolute inset-0 border border-transparent group-hover:border-cyber-blue rounded-xl transition duration-500 pointer-events-none z-30"></div>
    </div>
  `;
}

function getCategoryColors(category) {
    if (category === 'Anime') return 'bg-cyber-purple bg-opacity-20 text-cyber-purple border-cyber-purple';
    if (category === 'Cartoons') return 'bg-cyber-blue bg-opacity-20 text-cyber-blue border-cyber-blue';
    if (category === 'Movies') return 'bg-green-500 bg-opacity-20 text-green-400 border-green-500';
    if (category === 'TV Series') return 'bg-pink-500 bg-opacity-20 text-pink-400 border-pink-500';
    return 'bg-gray-500 bg-opacity-20 text-gray-400 border-gray-500';
}

// ===================================================
// SCROLL REVEAL — Intersection Observer
// ===================================================
function initScrollReveal() {
  const sections = document.querySelectorAll('main > section, main > .mt-32');
  
  if (sections.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  sections.forEach((section, index) => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(40px)';
    section.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(section);
  });
}
