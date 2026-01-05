const axios = require('axios');
const { Pokemon, Type } = require('../../db');

const getById = async (id) => {
  try {
    console.log(`Searching for Pokemon with ID: ${id}`);

    // Try database first if ID is UUID format
    if (id.includes('-')) {
      const dbPokemon = await Pokemon.findByPk(id, {
        include: {
          model: Type,
          attributes: ['name'],
          through: { attributes: [] }
        }
      });

      if (dbPokemon) {
        console.log(`Pokemon found in database: ${dbPokemon.name}`);
        return {
          id: dbPokemon.id,
          name: dbPokemon.name,
          image: dbPokemon.image,
          hp: dbPokemon.hp,
          attack: dbPokemon.attack,
          defense: dbPokemon.defense,
          speed: dbPokemon.speed || 0,
          height: dbPokemon.height || 0,
          weight: dbPokemon.weight || 0,
          types: dbPokemon.types ? dbPokemon.types.map(type => type.name) : [],
          source: 'db'
        };
      }
    }

    // If not in database or not UUID, try API
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const data = response.data;

      const apiPokemon = {
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

      console.log(`Pokemon found in API: ${apiPokemon.name}`);
      return apiPokemon;

    } catch (apiError) {
      // If not found in API and ID is numeric, check database
      const numericId = parseInt(id);
      if (!isNaN(numericId)) {
        const dbPokemon = await Pokemon.findByPk(id, {
          include: Type
        });
        
        if (dbPokemon) {
          return {
            id: dbPokemon.id,
            name: dbPokemon.name,
            image: dbPokemon.image,
            hp: dbPokemon.hp,
            attack: dbPokemon.attack,
            defense: dbPokemon.defense,
            speed: dbPokemon.speed || 0,
            height: dbPokemon.height || 0,
            weight: dbPokemon.weight || 0,
            types: dbPokemon.types ? dbPokemon.types.map(type => type.name) : [],
            source: 'db'
          };
        }
      }
      
      throw new Error(`Pokemon with ID ${id} not found`);
    }

  } catch (error) {
    console.error(`Error searching for Pokemon ID ${id}:`, error.message);
    throw new Error(`Error searching Pokemon: ${error.message}`);
  }
};

module.exports = getById;