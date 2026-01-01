const axios = require('axios');
const { Pokemon, Type } = require('../../db');

const getById = async (id) => {
  try {
    console.log(`Buscando Pokemon con ID: ${id}`);

    // Intentar buscar en la base de datos primero (si es UUID)
    if (id.includes('-')) { // UUID tiene guiones
      const dbPokemon = await Pokemon.findByPk(id, {
        include: {
          model: Type,
          attributes: ['name'],
          through: { attributes: [] }
        }
      });

      if (dbPokemon) {
        console.log(`Pokemon encontrado en DB: ${dbPokemon.name}`);
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

    // Si no está en DB o no es UUID, buscar en la API
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

      console.log(`Pokemon encontrado en API: ${apiPokemon.name}`);
      return apiPokemon;

    } catch (apiError) {
      // Si no encuentra en API, verificar si es número y buscar en DB
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
      
      throw new Error(`Pokemon con ID ${id} no encontrado`);
    }

  } catch (error) {
    console.error(`Error buscando Pokemon ID ${id}:`, error.message);
    throw new Error(`Error al buscar Pokemon: ${error.message}`);
  }
};

module.exports = getById;