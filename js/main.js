import { navigate, getPath } from './router.js';
import { showView } from './dom.js';

// 1. Escuchar clics en los botones de "Jugar"
document.querySelectorAll('[data-theme]').forEach(button => {
    button.addEventListener('click', () => {
        const theme = button.getAttribute('data-theme');
        navigate(`/${theme}`);
    });
});

// 2. Escuchar el botón de volver
document.getElementById('btn-back').addEventListener('click', () => {
    navigate('/');
});

// 3. Reaccionar a cambios de ruta (flechas navegador y navegación interna)
window.addEventListener('locationchange', () => showView(getPath()));
window.addEventListener('popstate', () => showView(getPath()));

// 4. Carga inicial
showView(getPath());