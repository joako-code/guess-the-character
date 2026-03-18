/**
 * themes/dragon-ball.js
 *
 * API usada: https://dragonball-api.com/
 * Documentación: https://web.dragonball-api.com/documentation
 *
 * Endpoints:
 *   GET /api/characters?limit=58  → todos los personajes
 */

import { fetchJSON } from '../api.js';

const BASE = 'https://dragonball-api.com';

async function fetchDragonBallCharacters() {
  const data = await fetchJSON(`${BASE}/api/characters?limit=58`);
  // La API devuelve { items: [...], meta: {...} }
  return data.items;
}

function normalize(raw) {
  return {
    id: raw.id,
    name: raw.name,
    image: raw.image,
  };
}

export default {
  name: 'Dragon Ball',
  fetch: fetchDragonBallCharacters,
  normalize,
};