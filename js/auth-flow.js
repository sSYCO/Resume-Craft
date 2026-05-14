// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
  const authForm = document.getElementById('auth-form');
  const switchLink = document.getElementById('switch-link');
  const switchMsg = document.getElementById('switch-msg');
  const authTitle = document.getElementById('auth-title');
  const authBtn = document.getElementById('auth-btn');
  const errorMsg = document.getElementById('auth-error');

  let isLogin = true;

  // Switch between Login/Signup
  if(switchLink) {
    switchLink.addEventListener('click', (e) => {
      e.preventDefault();
      isLogin = !isLogin;
      authTitle.textContent = isLogin ? 'Login to ResumeCraft' : 'Create Account';
      authBtn.textContent = isLogin ? 'Login' : 'Signup';
      switchMsg.textContent = isLogin ? "Don't have an account?" : "Already have an account?";
      switchLink.textContent = isLogin ? 'Signup' : 'Login';
      if(errorMsg) errorMsg.textContent = '';
    });
  }

  // Handle Form Submit
  if(authForm) {
    authForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      if(errorMsg) errorMsg.textContent = '';

      try {
        if(isLogin) {
          // LOGIN
          await window.auth.signInWithEmailAndPassword(email, password);
        } else {
          // SIGNUP
          await window.auth.createUserWithEmailAndPassword(email, password);
        }
        // Redirect to builder
        window.location.href = 'builder.html';
      } catch (err) {
        console.error('Auth error:', err);
        if(errorMsg) {
          errorMsg.textContent = err.message;
        } else {
          alert(err.message);
        }
      }
    });
  }

  // Auth State Observer
  window.auth.onAuthStateChanged(user => {
    const currentPath = window.location.pathname;
    
    if(currentPath.includes('builder.html') && !user) {
      // Not logged in, redirect to auth
      window.location.href = 'auth.html';
    }
  });

  // Logout Button
  const logoutBtn = document.getElementById('logout-btn');
  if(logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      window.auth.signOut().then(() => {
        window.location.href = 'index.html';
      });
    });
  }
});