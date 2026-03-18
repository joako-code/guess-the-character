/**
 * gameEngine.js — Lógica central del juego.
 *
 * Responsabilidades:
 *   - Cargar y mezclar personajes de un tema
 *   - Generar rondas (1 correcto + 3 distractores)
 *   - Evaluar respuestas
 *   - Mantener score y progreso de la partida
 *
 * Lo que NO hace:
 *   - Tocar el DOM (eso es trabajo de dom.js)
 *   - Saber de dónde vienen los datos (eso es trabajo de los themes)
 *   - Navegar entre rutas (eso es trabajo de router.js)
 *
 * Uso: 
 *   const engine = createGame('pokemon');
 *   await engine.init();
 *
 *   const round = engine.nextRound();
 *   // round = { image, options: [{id, name}], correctId }
 *
 *   const result = engine.answer(selectedId);
 *   // result = { correct: true, correctName: 'Pikachu', score: 1, streak: 1 }
 */

import { getCharacters } from './themes/index.js';

const TOTAL_ROUNDS   = 10; // cuántas rondas dura una partida
const OPTIONS_COUNT  = 4;  // cuántas opciones se muestran por ronda

/**
 * Crea una nueva instancia del juego para el tema dado.
 * El estado es completamente privado — solo se accede
 * a través de los métodos públicos.
 *
 * @param {string} themeKey — key del tema (ej: 'pokemon')
 * @returns {Game}
 */
export function createGame(themeKey) {
  // ─── Estado privado ───────────────────────────────────────────────────────
  let characters   = [];   // todos los personajes del tema, normalizados
  let queue        = [];   // personajes pendientes de aparecer como respuesta correcta
  let currentRound = null; // ronda activa { image, options, correctId }
  let roundIndex   = 0;
  let score        = 0;
  let streak       = 0;

  // ─── Métodos públicos ─────────────────────────────────────────────────────

  /**
   * Carga los personajes del tema y prepara la cola de rondas.
   * Debe llamarse una vez antes de usar nextRound().
   */
  async function init() {
    characters = await getCharacters(themeKey);

    if (characters.length < OPTIONS_COUNT) {
      throw new Error(`El tema "${themeKey}" no tiene suficientes personajes (mínimo ${OPTIONS_COUNT}).`);
    }

    // Mezclamos y tomamos los primeros TOTAL_ROUNDS como "correctos"
    queue = shuffle([...characters]).slice(0, TOTAL_ROUNDS);
    roundIndex = 0;
    score      = 0;
    streak     = 0;
  }

  /**
   * Genera y devuelve la siguiente ronda.
   * Si ya se jugaron todas las rondas, devuelve null.
   *
   * @returns {Round|null}
   *   Round = {
   *     image:     string,         // URL de la imagen a mostrar
   *     options:   {id, name}[],   // 4 opciones barajadas
   *     correctId: number|string,  // id de la respuesta correcta
   *     current:   number,         // número de ronda actual (1-based)
   *     total:     number,         // total de rondas
   *   }
   */
  function nextRound() {
    if (roundIndex >= queue.length) return null;

    const correct     = queue[roundIndex];
    const distractors = getDistractors(correct, characters, OPTIONS_COUNT - 1);
    const options     = shuffle([correct, ...distractors]).map(c => ({ id: c.id, name: c.name }));

    currentRound = {
      image:     correct.image,
      options,
      correctId: correct.id,
      current:   roundIndex + 1,
      total:     queue.length,
    };

    roundIndex++;
    return currentRound;
  }

  /**
   * Evalúa la respuesta del jugador.
   *
   * @param {number|string} selectedId — id del personaje elegido
   * @returns {AnswerResult}
   *   AnswerResult = {
   *     correct:     boolean,
   *     correctId:   number|string,
   *     correctName: string,
   *     score:       number,
   *     streak:      number,
   *     isLastRound: boolean,
   *   }
   */
  function answer(selectedId) {
    if (!currentRound) throw new Error('Llamá nextRound() antes de answer().');

    const isCorrect = String(selectedId) === String(currentRound.correctId);
    const correctChar = characters.find(c => String(c.id) === String(currentRound.correctId));

    if (isCorrect) {
      score++;
      streak++;
    } else {
      streak = 0;
    }

    return {
      correct:     isCorrect,
      correctId:   currentRound.correctId,
      correctName: correctChar.name,
      score,
      streak,
      isLastRound: roundIndex >= queue.length,
    };
  }

  /**
   * Devuelve un snapshot del estado actual (solo lectura).
   * Útil para renderizar la UI sin exponer el estado interno.
   */
  function getState() {
    return {
      themeKey,
      score,
      streak,
      roundIndex,
      totalRounds: queue.length,
      isFinished:  roundIndex >= queue.length,
    };
  }

  return { init, nextRound, answer, getState };
}

// ─── Helpers privados ─────────────────────────────────────────────────────────

/**
 * Fisher-Yates shuffle — mezcla un array sin mutar el original.
 */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Elige `count` distractores aleatorios distintos al personaje correcto.
 */
function getDistractors(correct, allCharacters, count) {
  const pool = allCharacters.filter(c => c.id !== correct.id);
  return shuffle(pool).slice(0, count);
}