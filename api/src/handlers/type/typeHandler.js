// src/handlers/type/typeHandler.js
const getTypes = require('../../controllers/type/getTypes');

const typeHandler = async (req, res) => {
  try {
    console.log('📍 GET /types');
    const types = await getTypes();
    res.status(200).json(types);
  } catch (error) {
    console.error('❌ Error en /types:', error.message);
    res.status(500).json({ 
      error: 'Error al obtener tipos de Pokémon',
      message: error.message 
    });
  }
};

module.exports = typeHandler;