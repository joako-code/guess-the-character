/**
 * themes/mortal-kombat.js
 *
 * No existe una API pública oficial para Mortal Kombat.
 * Usamos un dataset estático con los personajes más reconocidos.
 *
 * Si en el futuro aparece una API o querés usar una fuente externa,
 * solo cambiás la función `fetchMKCharacters` — el contrato no cambia.
 *
 * Imágenes: PNGs oficiales de la wiki de Mortal Kombat (dominio público / fair use).
 */

const CHARACTERS = [
  { id: 1,  name: 'Scorpion',      image: 'https://www.mortalkombat.com/sites/default/files/styles/card_character/public/2021-07/Scorpion.png' },
  { id: 2,  name: 'Sub-Zero',      image: 'https://www.mortalkombat.com/sites/default/files/styles/card_character/public/2021-07/SubZero.png' },
  { id: 3,  name: 'Raiden',        image: 'https://www.mortalkombat.com/sites/default/files/styles/card_character/public/2021-07/Raiden.png' },
  { id: 4,  name: 'Liu Kang',      image: 'https://www.mortalkombat.com/sites/default/files/styles/card_character/public/2021-07/LiuKang.png' },
  { id: 5,  name: 'Kitana',        image: 'https://www.mortalkombat.com/sites/default/files/styles/card_character/public/2021-07/Kitana.png' },
  { id: 6,  name: 'Sonya Blade',   image: 'https://www.mortalkombat.com/sites/default/files/styles/card_character/public/2021-07/SonyaBlade.png' },
  { id: 7,  name: 'Johnny Cage',   image: 'https://www.mortalkombat.com/sites/default/files/styles/card_character/public/2021-07/JohnnyCage.png' },
  { id: 8,  name: 'Shang Tsung',   image: 'https://www.mortalkombat.com/sites/default/files/styles/card_character/public/2021-07/ShangTsung.png' },
  { id: 9,  name: 'Kano',          image: 'https://www.mortalkombat.com/sites/default/files/styles/card_character/public/2021-07/Kano.png' },
  { id: 10, name: 'Kung Lao',      image: 'https://www.mortalkombat.com/sites/default/files/styles/card_character/public/2021-07/KungLao.png' },
  { id: 11, name: 'Mileena',       image: 'https://www.mortalkombat.com/sites/default/files/styles/card_character/public/2021-07/Mileena.png' },
  { id: 12, name: 'Baraka',        image: 'https://www.mortalkombat.com/sites/default/files/styles/card_character/public/2021-07/Baraka.png' },
  { id: 13, name: 'Jax Briggs',    image: 'https://www.mortalkombat.com/sites/default/files/styles/card_character/public/2021-07/JaxBriggs.png' },
  { id: 14, name: 'Reptile',       image: 'https://www.mortalkombat.com/sites/default/files/styles/card_character/public/2021-07/Reptile.png' },
  { id: 15, name: 'Shao Kahn',     image: 'https://www.mortalkombat.com/sites/default/files/styles/card_character/public/2021-07/ShaoKahn.png' },
  { id: 16, name: 'Geras',         image: 'https://www.mortalkombat.com/sites/default/files/styles/card_character/public/2021-07/Geras.png' },
  { id: 17, name: 'Cassie Cage',   image: 'https://www.mortalkombat.com/sites/default/files/styles/card_character/public/2021-07/CassieCage.png' },
  { id: 18, name: 'D\'Vorah',      image: 'https://www.mortalkombat.com/sites/default/files/styles/card_character/public/2021-07/DVorah.png' },
  { id: 19, name: 'Erron Black',   image: 'https://www.mortalkombat.com/sites/default/files/styles/card_character/public/2021-07/ErronBlack.png' },
  { id: 20, name: 'Noob Saibot',   image: 'https://www.mortalkombat.com/sites/default/files/styles/card_character/public/2021-07/NoobSaibot.png' },
];

async function fetchMKCharacters() {
  // Dataset estático — simula la misma interfaz async que los otros temas
  return CHARACTERS;
}

function normalize(raw) {
  return {
    id: raw.id,
    name: raw.name,
    image: raw.image,
  };
}

export default {
  name: 'Mortal Kombat',
  fetch: fetchMKCharacters,
  normalize,
};