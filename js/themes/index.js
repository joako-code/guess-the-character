/**
 * themes/index.js — Registro central de temas.
 *
 * Para agregar un nuevo tema:
 *   1. Creás js/themes/mi-tema.js siguiendo el mismo contrato.
 *   2. Lo importás y agregas al objeto THEMES abajo.
 *   3. Listo. El engine y la UI lo van a detectar automaticamente.
 *
 * La key del objeto debe coincidir con el `data-theme` del botón en el HTML
 */

import pokemon     from './pokemon.js';
import dragonBall  from './dragon-ball.js';
import mortalKombat from './mortal-kombat.js';

export const THEMES = {
  'pokemon':       pokemon,
  'dragon-ball':   dragonBall,
  'mortal-kombat': mortalKombat,
};

/**
 * Devuelve un theme por su key.
 * Lanza un error claro si la key no existe.
 *
 * @param {string} key
 * @returns {Theme}
 */
export function getTheme(key) {
  const theme = THEMES[key];
  if (!theme) throw new Error(`Theme "${key}" no encontrado. Themes disponibles: ${Object.keys(THEMES).join(', ')}`);
  return theme;
}

/**
 * Devuelve los personajes normalizados para un tema dado.
 * Este es el método que va a usar el gameEngine.
 *
 * @param {string} themeKey
 * @returns {Promise<Character[]>}
 */
export async function getCharacters(themeKey) {
  const theme = getTheme(themeKey);
  const rawData = await theme.fetch();
  return rawData.map(theme.normalize);
}