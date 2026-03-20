/**
 * main.js — Orquestador de la aplicación.
 *
 * Conecta las tres capas:
 *   router.js    → detecta cambios de URL
 *   gameEngine.js → lógica de juego
 *   dom.js       → renderizado
 *
 * Este archivo NO contiene lógica de juego ni manipulación directa del DOM.
 * Su único trabajo es responder a eventos y delegar.
 */

import { navigate, getPath } from './router.js';
import { createGame }        from './gameEngine.js';
import {
  showHome,
  showGame,
  renderLoading,
  renderRound,
  renderFeedback,
  renderGameOver,
  renderError,
  updateScore,
} from './dom.js';

// ─── Estado mínimo de la app ──────────────────────────────────────────────────

let engine = null; // instancia activa del gameEngine

// ─── Routing ──────────────────────────────────────────────────────────────────

/**
 * Se ejecuta en cada cambio de URL.
 * Decide qué vista mostrar y, si corresponde, inicia una partida.
 */
async function handleRoute() {
  const path = getPath();

  if (path === '/' || path === '/index.html') {
    showHome();
    return;
  }

  const themeKey = path.replace('/', '');
  await startGame(themeKey);
}

// ─── Ciclo de juego ───────────────────────────────────────────────────────────

/**
 * Inicializa y arranca una partida para el tema dado.
 * Maneja el estado de carga y los errores de red.
 *
 * @param {string} themeKey
 */
async function startGame(themeKey) {
  showGame();
  renderLoading();

  try {
    engine = createGame(themeKey);
    await engine.init();
    updateScore(0);
    showNextRound();
  } catch (err) {
    console.error(err);
    renderError('No se pudieron cargar los personajes.');
  }
}

/**
 * Pide la siguiente ronda al engine y la renderiza.
 * Si no hay más rondas, muestra la pantalla de fin.
 */
function showNextRound() {
  const round = engine.nextRound();

  if (!round) {
    // Esto no debería pasar si isLastRound se maneja bien, pero por seguridad
    const state = engine.getState();
    showEndScreen(state.score);
    return;
  }

  renderRound(round, onAnswer);
}

/**
 * Callback que se pasa a dom.js → se llama cuando el usuario elige una opción.
 *
 * @param {string} selectedId — data-id del botón clickeado
 */
function onAnswer(selectedId) {
  const result = engine.answer(selectedId);
  updateScore(result.score);
  renderFeedback(result, onNext);
}

/**
 * Callback para el botón "Siguiente" del feedback.
 * Avanza a la próxima ronda o termina la partida.
 */
function onNext() {
  const state = engine.getState();

  if (state.isFinished) {
    showEndScreen(state.score);
  } else {
    showNextRound();
  }
}

/**
 * Game over screen
 *
 * @param {number} score
 */
function showEndScreen(score) {
  const state = engine.getState();

  renderGameOver(
    score,
    state.totalRounds,
    () => startGame(state.themeKey),  // Replay: mismo tema
    () => navigate('/'),               // Home: volver al inicio
  );
}

// Events

// Button Play
document.querySelectorAll('.btn-play').forEach(btn => {
  btn.addEventListener('click', () => {
    const theme = btn.dataset.theme;
    if (theme) navigate(`/${theme}`);
  });
});

// Button Back
document.querySelector('#btn-back').addEventListener('click', () => {
  navigate('/');
});

// Navegation between pages
window.addEventListener('popstate', handleRoute);
window.addEventListener('locationchange', handleRoute);