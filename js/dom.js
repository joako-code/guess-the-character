/**
 * dom.js — Capa de presentación.
 *
 * Responsabilidad única: recibir datos y pintar el DOM.
 * No sabe nada de lógica de juego ni de dónde vienen los datos.
 *
 * Funciones exportadas:
 *   showHome()
 *   showGame()
 *   renderLoading()
 *   renderRound(round, onAnswer)
 *   renderFeedback(result, onNext)
 *   renderGameOver(score, total, onReplay, onHome)
 *   renderError(message)
 *   updateScore(score)
 */

// ─── Refs al DOM ──────────────────────────────────────────────────────────────

const $homeView   = document.getElementById('view-home');
const $gameView   = document.getElementById('view-game');
const $gameContent = document.getElementById('game-content');
const $scoreInfo  = document.getElementById('info');

// ─── Vistas ───────────────────────────────────────────────────────────────────

export function showHome() {
  $homeView.style.display = 'block';
  $gameView.style.display = 'none';
}

export function showGame() {
  $homeView.style.display = 'none';
  $gameView.style.display = 'block';
}

// ─── Score ────────────────────────────────────────────────────────────────────

export function updateScore(score) {
  $scoreInfo.textContent = `Score: ${score}`;
}

// ─── Estados del juego ────────────────────────────────────────────────────────

/**
 * Muestra un spinner mientras se cargan los personajes.
 */
export function renderLoading() {
  $gameContent.innerHTML = `
    <div class="loading-state">
      <p aria-live="polite">Cargando personajes…</p>
    </div>
  `;
}

/**
 * Renderiza una ronda: imagen del personaje + 4 botones de opciones.
 *
 * @param {Round}    round    — objeto devuelto por engine.nextRound()
 * @param {Function} onAnswer — callback(selectedId) al hacer click
 */
export function renderRound(round, onAnswer) {
  const { image, options, current, total } = round;

  $gameContent.innerHTML = `
    <div class="round-header">
      <span class="round-counter">Ronda ${current} / ${total}</span>
    </div>

    <div class="character-card">
      <img
        class="character-img"
        src="${image}"
        alt="¿Quién es este personaje?"
        draggable="false"
      />
    </div>

    <div class="options-grid">
      ${options.map(opt => `
        <button class="option-btn" data-id="${opt.id}">
          ${opt.name}
        </button>
      `).join('')}
    </div>
  `;

  // Delegamos el evento en el contenedor — un solo listener para los 4 botones
  $gameContent.querySelector('.options-grid').addEventListener('click', (e) => {
    const btn = e.target.closest('.option-btn');
    if (!btn) return;

    // Bloqueamos nuevos clicks apenas se elige
    $gameContent.querySelectorAll('.option-btn').forEach(b => b.disabled = true);

    onAnswer(btn.dataset.id);
  });
}

/**
 * Muestra el resultado de la respuesta sobre los botones ya renderizados.
 * Marca verde el correcto y rojo el elegido si fue incorrecto.
 *
 * @param {AnswerResult} result   — objeto devuelto por engine.answer()
 * @param {Function}     onNext  — callback al hacer click en "Siguiente"
 */
export function renderFeedback(result, onNext) {
  const { correct, correctId, correctName, score, streak } = result;

  // Colorear botones
  $gameContent.querySelectorAll('.option-btn').forEach(btn => {
    if (btn.dataset.id == correctId) {
      btn.classList.add('correct');
    } else if (!correct && btn.classList.contains('chosen')) {
      btn.classList.add('incorrect');
    }
  });

  // Marcar el botón que fue clickeado como "chosen" 
  // (lo hacemos antes del feedback — ver nota en renderRound)
  // Aquí solo necesitamos marcar el correcto visualmente
  $gameContent.querySelectorAll('.option-btn').forEach(btn => {
    if (btn.disabled && btn.dataset.id != correctId) {
      btn.classList.add('incorrect');
    }
  });
  // Revertimos: solo el correcto es verde, los demás apagados
  $gameContent.querySelectorAll('.option-btn:not(.correct)').forEach(btn => {
    btn.classList.remove('incorrect');
  });

  const feedbackHTML = `
    <div class="feedback ${correct ? 'feedback--correct' : 'feedback--wrong'}">
      <p class="feedback-text">
        ${correct
          ? `✓ ¡Correcto! Es <strong>${correctName}</strong>`
          : `✗ Era <strong>${correctName}</strong>`
        }
      </p>
      ${streak >= 2 ? `<p class="streak-badge">🔥 Racha ×${streak}</p>` : ''}
      <p class="score-live">Puntaje: ${score}</p>
      <button class="btn-next">
        ${result.isLastRound ? 'Ver resultado final →' : 'Siguiente →'}
      </button>
    </div>
  `;

  $gameContent.insertAdjacentHTML('beforeend', feedbackHTML);
  $gameContent.querySelector('.btn-next').addEventListener('click', onNext);
}

/**
 * Pantalla de fin de partida.
 *
 * @param {number}   score     — puntos conseguidos
 * @param {number}   total     — total de rondas
 * @param {Function} onReplay  — callback para jugar de nuevo mismo tema
 * @param {Function} onHome    — callback para volver al inicio
 */
export function renderGameOver(score, total, onReplay, onHome) {
  const pct     = Math.round((score / total) * 100);
  const medal   = pct === 100 ? '🏆' : pct >= 70 ? '🥈' : pct >= 40 ? '🥉' : '💀';
  const message = pct === 100 ? '¡Perfecto!'
                : pct >= 70   ? '¡Muy bien!'
                : pct >= 40   ? 'Podés mejorar'
                :               'A practicar más…';

  $gameContent.innerHTML = `
    <div class="gameover">
      <div class="gameover-medal">${medal}</div>
      <h2 class="gameover-title">${message}</h2>
      <p class="gameover-score">${score} / ${total} correctas</p>
      <div class="gameover-actions">
        <button id="btn-replay">Jugar de nuevo</button>
        <button id="btn-home" class="outline secondary">Cambiar tema</button>
      </div>
    </div>
  `;

  document.getElementById('btn-replay').addEventListener('click', onReplay);
  document.getElementById('btn-home').addEventListener('click', onHome);
}

/**
 * Muestra un mensaje de error dentro del área de juego.
 *
 * @param {string} message
 */
export function renderError(message) {
  $gameContent.innerHTML = `
    <div class="error-state">
      <p>⚠️ ${message}</p>
      <p><small>Revisá tu conexión e intentá de nuevo.</small></p>
    </div>
  `;
}