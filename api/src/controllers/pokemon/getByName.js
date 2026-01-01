const axios = require('axios');
const { Pokemon, Type } = require('../../db');
const { Op } = require('sequelize');

const getByName = async (name) => {
  try {
    if (!name || name.trim() === '') {
      throw new Error('Debe proporcionar un nombre para buscar');
    }

    const searchName = name.toLowerCase().trim();
    console.log(`Buscando Pokemon por nombre: "${searchName}"`);

    // 1. Buscar en la base de datos
    const dbPokemon = await Pokemon.findOne({
      where: {
        name: {
          [Op.iLike]: `%${searchName}%` // Búsqueda case-insensitive
        }
      },
      include: {
        model: Type,
        attributes: ['name'],
        through: { attributes: [] }
      }
    });

    // 2. Buscar en la API
    let apiPokemon = null;
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${searchName}`);
      const data = response.data;
      
      apiPokemon = {
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
    } catch (apiError) {
      console.log(`Pokemon "${searchName}" no encontrado en API`);
    }

    // 3. Formatear resultado de DB si existe
    let formattedDbPokemon = null;
    if (dbPokemon) {
      formattedDbPokemon = {
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
      console.log(`Pokemon encontrado en DB: ${formattedDbPokemon.name}`);
    }

    // 4. Retornar resultados
    const results = [];
    if (apiPokemon) results.push(apiPokemon);
    if (formattedDbPokemon) results.push(formattedDbPokemon);

    if (results.length === 0) {
      throw new Error(`No se encontró ningún Pokemon con el nombre "${name}"`);
    }

    // Si buscó por nombre exacto, retornar solo el primero
    if (searchName === apiPokemon?.name.toLowerCase() || searchName === formattedDbPokemon?.name.toLowerCase()) {
      return results[0];
    }

    return results;

  } catch (error) {
    console.error(`Error buscando Pokemon por nombre "${name}":`, error.message);
    throw new Error(`Error al buscar Pokemon: ${error.message}`);
  }
};

module.exports = getByName;