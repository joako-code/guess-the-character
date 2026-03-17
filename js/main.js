import { navigate, getPath } from './router.js';
import { showView } from './dom.js';

// Alias para objetos globales
const $btnPlay = document.querySelectorAll(".btn-play");
const $btnBack = document.querySelectorAll("#btn-back");
const $win = window;

// Función de actualización de vista
const update = () => showView(getPath());

$btnPlay.forEach((btn)=>{
    btn.addEventListener("click",()=>{
        const themeBtn  = btn.dataset.theme
        if(themeBtn) return navigate(`/${themeBtn}`)
    })
})

$btnBack.forEach((btn)=>{
    btn.addEventListener("click",()=>{
        navigate('/')
    })
})

/* --- 2. Sincronización de Navegación --- */
$win.addEventListener('popstate', update);
$win.addEventListener('locationchange', update);

/* --- 3. Inicialización --- */
update();