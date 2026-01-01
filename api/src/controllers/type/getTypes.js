const axios = require('axios');

// Importación CORRECTA desde db.js
const db = require('../../db');  // Solo 2 niveles, no 3
const Type = db.Type;

const getTypes = async () => {
  try {
    console.log('Obteniendo tipos de Pokemon...');

    // 1. Primero verificar si ya existen en la base de datos
    const dbTypes = await Type.findAll();

    if (dbTypes.length > 0) {
      console.log(dbTypes.length + ' tipos encontrados en DB');
      return dbTypes.map(type => ({
        id: type.id,
        name: type.name
      }));
    }

    // 2. Si no hay en DB, obtener de la API
    console.log('Obteniendo tipos de PokeAPI...');
    const response = await axios.get('https://pokeapi.co/api/v2/type');
    const apiTypes = response.data.results;

    // 3. Guardar en la base de datos
    const typesToCreate = apiTypes.map(type => ({
      name: type.name
    }));

    const createdTypes = await Type.bulkCreate(typesToCreate);

    console.log(createdTypes.length + ' tipos guardados en DB');

    return createdTypes.map(type => ({
      id: type.id,
      name: type.name
    }));

  } catch (error) {
    console.error('Error obteniendo tipos:', error.message);
    throw new Error('Error al obtener tipos: ' + error.message);
  }
};

module.exports = getTypes;