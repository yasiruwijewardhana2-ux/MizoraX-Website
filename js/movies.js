class MovieService {
  constructor() {
    this.movies = [];
  }

  async init() {
    try {
      const stored = localStorage.getItem('mizorax_movies');
      if (stored) {
        this.movies = JSON.parse(stored);
      } else {
        this.movies = this.generateExpandedData();
        localStorage.setItem('mizorax_movies', JSON.stringify(this.movies));
      }
    } catch (e) {
      console.error("Failed to load movies", e);
      this.movies = this.generateExpandedData();
    }
  }

  getAll() { return this.movies; }
  
  getByCategory(cat) {
    return this.movies.filter(m => m.category.toLowerCase() === cat.toLowerCase());
  }
  
  getFeatured() {
    return this.movies.filter(m => m.featured);
  }
  
  getTrending() {
    return this.movies.filter(m => m.trending);
  }

  getById(id) {
    return this.movies.find(m => m.id == id);
  }

  saveMovie(movie) {
    if (movie.id) {
      const idx = this.movies.findIndex(m => m.id == movie.id);
      if (idx !== -1) {
        this.movies[idx] = movie;
      } else {
        this.movies.push(movie);
      }
    } else {
      movie.id = Date.now();
      this.movies.push(movie);
    }
    this._save();
  }

  _save() {
    localStorage.setItem('mizorax_movies', JSON.stringify(this.movies));
  }

  deleteMovie(id) {
    this.movies = this.movies.filter(m => m.id != id);
    this._save();
  }

  getRecentMovies() {
    let history = JSON.parse(localStorage.getItem('mizorax_history') || '[]');
    if (history.length > 0) {
      return history.map(id => this.getById(id)).filter(m => m !== undefined);
    }
    return this.getAll().slice().reverse().slice(0, 5);
  }

  addToHistory(id) {
    let history = JSON.parse(localStorage.getItem('mizorax_history') || '[]');
    history = history.filter(item => item != id);
    history.unshift(id);
    if (history.length > 10) history.pop();
    localStorage.setItem('mizorax_history', JSON.stringify(history));
  }

  generateExpandedData() {
    const data = [
      // === ANIME ===
      {
        id: 1, title: "Cyberpunk: Edgerunners", category: "Anime", type: "Series",
        genre: "Sci-Fi, Action, Cyberpunk", duration: "24m/ep", quality: "4K HDR",
        poster: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=500&q=80",
        banner: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=1920&q=80",
        description: "A street kid tries to survive in a technology and body modification-obsessed city of the future. Loaded with adrenaline-pumping action and breathtaking animation.",
        year: 2022, rating: 9.8, featured: true, trending: true,
        trailerUrl: "https://www.youtube.com/embed/Jtqw-8sF6-M", streamUrl: "#"
      },
      {
        id: 2, title: "Ghost in the Shell", category: "Anime", type: "Movie",
        genre: "Cyberpunk, Sci-Fi, Thriller", duration: "82m", quality: "HD",
        poster: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=500&q=80",
        banner: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=1920&q=80",
        description: "A cyborg policewoman and her partner hunt a mysterious and powerful hacker called the Puppet Master in a futuristic world where the line between human and machine has blurred.",
        year: 1995, rating: 9.2, featured: true, trending: false,
        trailerUrl: "", streamUrl: "#"
      },
      {
        id: 3, title: "Attack on Titan: Final", category: "Anime", type: "Series",
        genre: "Action, Dark Fantasy, Drama", duration: "24m/ep", quality: "4K",
        poster: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&q=80",
        banner: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1920&q=80",
        description: "Humanity fights for survival against giant humanoid Titans that have brought civilization to the brink of extinction.",
        year: 2023, rating: 9.7, featured: true, trending: true,
        trailerUrl: "", streamUrl: "#"
      },
      {
        id: 4, title: "Demon Slayer: Infinity Castle", category: "Anime", type: "Movie",
        genre: "Action, Supernatural, Adventure", duration: "2h 05m", quality: "4K HDR",
        poster: "https://images.unsplash.com/photo-1614583225154-5fcdda07019e?w=500&q=80",
        banner: "https://images.unsplash.com/photo-1614583225154-5fcdda07019e?w=1920&q=80",
        description: "Tanjiro and the Hashira face their ultimate battle inside the terrifying Infinity Castle against the Demon King.",
        year: 2025, rating: 9.6, featured: false, trending: true,
        trailerUrl: "", streamUrl: "#"
      },

      // === MOVIES (Hollywood/English) ===
      {
        id: 5, title: "Blade Runner 2049", category: "Movies", type: "Movie",
        genre: "Sci-Fi, Drama, Neo-Noir", duration: "2h 44m", quality: "4K HDR",
        poster: "https://images.unsplash.com/photo-1534996858221-380b92700493?w=500&q=80",
        banner: "https://images.unsplash.com/photo-1534996858221-380b92700493?w=1920&q=80",
        description: "A young blade runner's discovery of a long-buried secret leads him to track down former blade runner Rick Deckard, who's been missing for thirty years.",
        year: 2017, rating: 9.4, featured: true, trending: true,
        trailerUrl: "", streamUrl: "#"
      },
      {
        id: 6, title: "Interstellar", category: "Movies", type: "Movie",
        genre: "Sci-Fi, Adventure, Drama", duration: "2h 49m", quality: "4K HDR",
        poster: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=500&q=80",
        banner: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1920&q=80",
        description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival as Earth becomes uninhabitable.",
        year: 2014, rating: 9.5, featured: true, trending: true,
        trailerUrl: "", streamUrl: "#"
      },
      {
        id: 7, title: "The Dark Knight", category: "Movies", type: "Movie",
        genre: "Action, Crime, Thriller", duration: "2h 32m", quality: "4K",
        poster: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=500&q=80",
        banner: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=1920&q=80",
        description: "When the menace known as the Joker wreaks havoc on the people of Gotham, Batman must accept one of the greatest tests of his ability to fight injustice.",
        year: 2008, rating: 9.6, featured: false, trending: true,
        trailerUrl: "", streamUrl: "#"
      },
      {
        id: 8, title: "Dune: Part Two", category: "Movies", type: "Movie",
        genre: "Sci-Fi, Adventure, Epic", duration: "2h 46m", quality: "4K HDR",
        poster: "https://images.unsplash.com/photo-1547700055-b61cacebd395?w=500&q=80",
        banner: "https://images.unsplash.com/photo-1547700055-b61cacebd395?w=1920&q=80",
        description: "Paul Atreides unites with the Fremen to seek revenge against the conspirators who destroyed his family, facing a choice between the love of his life and the fate of the universe.",
        year: 2024, rating: 9.3, featured: false, trending: true,
        trailerUrl: "", streamUrl: "#"
      },

      // === CARTOONS ===
      {
        id: 9, title: "Arcane", category: "Cartoons", type: "Series",
        genre: "Action, Adventure, Steampunk", duration: "40m/ep", quality: "4K HDR",
        poster: "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?w=500&q=80",
        banner: "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?w=1920&q=80",
        description: "Set in utopian Piltover and the oppressed underground of Zaun, the story follows the origins of two iconic League champions and the power that will tear them apart.",
        year: 2021, rating: 9.5, featured: true, trending: true,
        trailerUrl: "", streamUrl: "#"
      },
      {
        id: 10, title: "Spider-Verse: Beyond", category: "Cartoons", type: "Movie",
        genre: "Animation, Action, Sci-Fi", duration: "2h 20m", quality: "4K HDR",
        poster: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=500&q=80",
        banner: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=1920&q=80",
        description: "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.",
        year: 2024, rating: 9.6, featured: false, trending: true,
        trailerUrl: "", streamUrl: "#"
      },

      // === TV SERIES ===
      {
        id: 11, title: "Stranger Things", category: "TV Series", type: "Series",
        genre: "Sci-Fi, Horror, Drama", duration: "50m/ep", quality: "4K HDR",
        poster: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=500&q=80",
        banner: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=1920&q=80",
        description: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces, and one very strange little girl.",
        year: 2016, rating: 9.0, featured: false, trending: true,
        trailerUrl: "", streamUrl: "#"
      },
      {
        id: 12, title: "The Last of Us", category: "TV Series", type: "Series",
        genre: "Drama, Action, Post-Apocalyptic", duration: "55m/ep", quality: "4K HDR",
        poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&q=80",
        banner: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1920&q=80",
        description: "After a global pandemic destroys civilization, a hardened survivor takes charge of a 14-year-old girl who may be humanity's last hope.",
        year: 2023, rating: 9.3, featured: false, trending: true,
        trailerUrl: "", streamUrl: "#"
      }
    ];

    // Generate additional entries per category for testing pagination
    const templates = [
      { cat: "Anime", genres: ["Action, Fantasy", "Mecha, Sci-Fi", "Supernatural, Adventure", "Romance, Drama"] },
      { cat: "Movies", genres: ["Action, Thriller", "Sci-Fi, Drama", "Fantasy, Adventure", "Crime, Mystery"] },
      { cat: "TV Series", genres: ["Drama, Thriller", "Sci-Fi, Mystery", "Horror, Suspense", "Comedy, Drama"] },
      { cat: "Cartoons", genres: ["Animation, Adventure", "Comedy, Family", "Action, Sci-Fi", "Fantasy, Musical"] }
    ];

    for (let i = 13; i <= 40; i++) {
      const tpl = templates[(i - 13) % templates.length];
      const genre = tpl.genres[Math.floor(Math.random() * tpl.genres.length)];
      data.push({
        id: i,
        title: `${tpl.cat} Collection ${i}`,
        category: tpl.cat,
        type: i % 3 === 0 ? "Movie" : "Series",
        genre: genre,
        duration: i % 3 === 0 ? `${90 + Math.floor(Math.random() * 60)}m` : `${20 + Math.floor(Math.random() * 30)}m/ep`,
        quality: i % 2 === 0 ? "4K HDR" : "HD",
        poster: `https://picsum.photos/seed/mx${i}/500/750`,
        banner: `https://picsum.photos/seed/mx${i}/1920/1080`,
        description: `A premium ${tpl.cat.toLowerCase()} experience featuring exceptional storytelling, stunning visuals, and unforgettable characters. Stream now exclusively on MizoraX.`,
        year: 2018 + (i % 8),
        rating: (7.5 + (Math.random() * 2.5)).toFixed(1),
        featured: false,
        trending: i % 5 === 0,
        trailerUrl: "",
        streamUrl: "#"
      });
    }

    return data;
  }
}

const movieService = new MovieService();

// ==============================================
// Global Settings Service
// ==============================================
const SettingsService = {
  settings: {
    siteTitle: "MizoraX",
    logoText1: "Mizora",
    logoText2: "X",
    heroSubtitle: "PREMIUM STREAMING PLATFORM",
    aboutText: "MizoraX is a premium streaming platform delivering the best in anime, movies, and global entertainment.",
    footerCredits: "MizoraX &copy; 2026. Developed by: Yasiru R. Wijewardhana &amp; Dilshan Mudalige"
  },
  
  init() {
    const stored = localStorage.getItem('mizorax_settings');
    if (stored) {
      this.settings = { ...this.settings, ...JSON.parse(stored) };
    } else {
      this._save();
    }
  },
  
  _save() {
    localStorage.setItem('mizorax_settings', JSON.stringify(this.settings));
  },

  getSettings() {
    return this.settings;
  },
  
  updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    this._save();
  }
};

SettingsService.init();
