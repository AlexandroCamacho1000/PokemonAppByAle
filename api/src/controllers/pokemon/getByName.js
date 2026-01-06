const axios = require('axios');
const { Pokemon, Type } = require('../../db');
const { Op } = require('sequelize');

const getByName = async (name) => {
  try {
    if (!name || name.trim() === '') {
      throw new Error('Search name must be provided');
    }

    const searchName = name.toLowerCase().trim();
    console.log(`Searching Pokemon by name: "${searchName}"`);

    // 1. Search in database 
    const dbPokemon = await Pokemon.findOne({
      where: {
        name: {
          [Op.iLike]: `%${searchName}%`
        }
      },
      include: {
        model: Type,
        as: 'types',  
        attributes: ['name'],
        through: { attributes: [] }
      }
    });

    // 2. Search in API
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
      
      console.log(`Pokemon found in API: ${apiPokemon.name}`);
    } catch (apiError) {
      console.log(`Pokemon "${searchName}" not found in API`);
    }

    // 3. Format database result if exists
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
      console.log(`Pokemon found in database: ${formattedDbPokemon.name}`);
    }

    // 4. Return results
    const results = [];
    if (apiPokemon) results.push(apiPokemon);
    if (formattedDbPokemon) results.push(formattedDbPokemon);

    if (results.length === 0) {
      throw new Error(`No Pokemon found with name "${name}"`);
    }

    // If exact name match, return only the first result
    const exactMatch = results.find(p => 
      p.name.toLowerCase() === searchName
    );
    
    return exactMatch || results;

  } catch (error) {
    console.error(`Error searching Pokemon by name "${name}":`, error.message);
    throw new Error(`Error searching Pokemon: ${error.message}`);
  }
};

module.exports = getByName;