const axios = require('axios');

const db = require('../../db');
const Type = db.Type;

const getTypes = async () => {
  try {
    console.log('Fetching Pokemon types...');

    // Check if types already exist in database
    const dbTypes = await Type.findAll();

    if (dbTypes.length > 0) {
      console.log(dbTypes.length + ' types found in database');
      return dbTypes.map(type => ({
        id: type.id,
        name: type.name
      }));
    }

    // If no types in database, fetch from API
    console.log('Fetching types from PokeAPI...');
    const response = await axios.get('https://pokeapi.co/api/v2/type');
    const apiTypes = response.data.results;

    // Save types to database
    const typesToCreate = apiTypes.map(type => ({
      name: type.name
    }));

    const createdTypes = await Type.bulkCreate(typesToCreate);

    console.log(createdTypes.length + ' types saved to database');

    return createdTypes.map(type => ({
      id: type.id,
      name: type.name
    }));

  } catch (error) {
    console.error('Error fetching types:', error.message);
    throw new Error('Error fetching types: ' + error.message);
  }
};

module.exports = getTypes;