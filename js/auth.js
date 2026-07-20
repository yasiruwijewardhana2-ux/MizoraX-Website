const Auth = {
  login(username, password) {
    if (username === 'mizorax' && password === 'mizoraxadmins@2026') {
      localStorage.setItem('mizorax_admin', 'true');
      return true;
    }
    return false;
  },
  
  logout() {
    localStorage.removeItem('mizorax_admin');
    window.location.href = 'index.html';
  },
  
  isAdmin() {
    return localStorage.getItem('mizorax_admin') === 'true';
  },

  checkAdmin() {
    if (!this.isAdmin()) {
      window.location.href = 'index.html';
    }
  }
};
