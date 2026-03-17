const homeView = document.getElementById('view-home');
const gameView = document.getElementById('view-game');
const gameContent = document.getElementById('game-content');

export function showView(path) {
    if (path === '/' || path === '/index.html') {
        homeView.style.display = 'block';
        gameView.style.display = 'none';
    } else {
        homeView.style.display = 'none';
        gameView.style.display = 'block';
        
        // Limpiamos el slug de la URL para mostrar el nombre bonito
        const themeName = path.replace('/', '').replace('-', ' ');
        gameContent.innerHTML = `<h2>Jugando a: ${themeName.toUpperCase()}</h2>`;
    }
}