/**
 * themes/pokemon.js
 *
 * Contrato que todo theme debe cumplir:
 *   name     {string}           — nombre legible del tema
 *   fetch()  {Promise<Character[]>} — trae los personajes crudos
 *   normalize(raw) {Character}  — convierte la respuesta de la API
 *                                   al formato común { id, name, image }
 *
 * Character:
 *   id    {string|number}
 *   name  {string}        — capitalizado
 *   image {string}        — URL de imagen
 */

import { fetchJSON } from '../api.js';

const TOTAL_POKEMON = 151; // 1ra generación — fácil de cambiar

async function fetchRandomPokemon(count = 20) {
  // Generamos IDs únicos al azar dentro del rango
  const ids = getRandomIds(1, TOTAL_POKEMON, count);

  const results = await Promise.all(
    ids.map(id => fetchJSON(`https://pokeapi.co/api/v2/pokemon/${id}`))
  );

  return results;
}

function normalize(raw) {
  return {
    id: raw.id,
    name: capitalize(raw.name),
    image:
      raw.sprites.other['official-artwork'].front_default ||
      raw.sprites.front_default,
  };
}

export default {
  name: 'Pokemon',
  fetch: fetchRandomPokemon,
  normalize,
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getRandomIds(min, max, count) {
  const ids = new Set();
  while (ids.size < count) {
    ids.add(Math.floor(Math.random() * (max - min + 1)) + min);
  }
  return [...ids];
}