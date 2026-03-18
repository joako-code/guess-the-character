/**
 * api.js — Fetcher genérico con cache en memoria.
 *
 * Responsabilidad única: hacer requests HTTP y cachear resultados
 * para no repetir llamadas durante la misma sesión.
 *
 * Los themes usan este módulo internamente; el resto de la app
 * nunca importa api.js directamente, solo importa los themes.
 */

const cache = new Map();

/**
 * Hace un GET a `url` y devuelve el JSON parseado.
 * Cachea la respuesta usando la URL como key.
 *
 * @param {string} url
 * @returns {Promise<any>}
 */
export async function fetchJSON(url) {
  if (cache.has(url)) return cache.get(url);

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error ${res.status} fetching ${url}`);

  const data = await res.json();
  cache.set(url, data);
  return data;
}

/**
 * Limpia el cache (útil en tests o si querés forzar un re-fetch).
 */
export function clearCache() {
  cache.clear();
}