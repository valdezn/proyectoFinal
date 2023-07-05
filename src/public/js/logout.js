const logoutButton = document.getElementById('logout');
logoutButton.addEventListener('click', () => {
  fetch('/api/sessions/logout')
    //.then(response => response.json())
    .then(data => {
      // Aquí puedes realizar acciones adicionales después de hacer logout
      window.location.href = '/login'; // Redirige al usuario a la página de login
    })
    .catch(error => {
      console.error('Error al hacer logout:', error);
    });
});