const axios = require('axios');
const { Pokemon, Type } = require('../../db');

const getAll = async () => {
  try {
    console.log('Fetching all Pokemon...');

    // 1. Fetch from API (40 Pokemon)
    const apiResponse = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=40');
    
    const apiPokemons = await Promise.all(
      apiResponse.data.results.map(async (pokemon) => {
        try {
          const detail = await axios.get(pokemon.url);
          const data = detail.data;
          
          return {
            id: data.id,
            name: data.name,
            image: data.sprites.other['official-artwork']?.front_default || data.sprites.front_default,
            hp: data.stats.find(s => s.stat.name === 'hp')?.base_stat || 0,
            attack: data.stats.find(s => s.stat.name === 'attack')?.base_stat || 0,
            defense: data.stats.find(s => s.stat.name === 'defense')?.base_stat || 0,
            speed: data.stats.find(s => s.stat.name === 'speed')?.base_stat || 0,
            height: data.height || 0,
            weight: data.weight || 0,
            types: data.types ? data.types.map(t => t.type.name) : [],
            source: 'api'
          };
        } catch (error) {
          console.error(`Error fetching ${pokemon.name}:`, error.message);
          return null;
        }
      })
    );

    // Filter out null values
    const validApiPokemons = apiPokemons.filter(p => p !== null);

    // 2. Fetch from database
    const dbPokemons = await Pokemon.findAll({
      include: {
        model: Type,
        attributes: ['name'],
        through: { attributes: [] }
      }
    });

    const formattedDbPokemons = dbPokemons.map(pokemon => ({
      id: pokemon.id,
      name: pokemon.name,
      image: pokemon.image,
      hp: pokemon.hp,
      attack: pokemon.attack,
      defense: pokemon.defense,
      speed: pokemon.speed || 0,
      height: pokemon.height || 0,
      weight: pokemon.weight || 0,
      types: pokemon.types ? pokemon.types.map(type => type.name) : [],
      source: 'db'
    }));

    // 3. Combine results
    const allPokemons = [...validApiPokemons, ...formattedDbPokemons];

    console.log(`Total: ${allPokemons.length} Pokemon (API: ${validApiPokemons.length}, DB: ${formattedDbPokemons.length})`);

    return allPokemons;

  } catch (error) {
    console.error('Error in getAll:', error.message);
    throw new Error('Error fetching Pokemon: ' + error.message);
  }
};

module.exports = getAll;