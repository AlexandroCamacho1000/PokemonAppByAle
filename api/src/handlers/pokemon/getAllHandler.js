const getAll = require('../../controllers/pokemon/getAll');

const getAllHandler = async (req, res) => {
  try {
    console.log('GET /pokemons');
    const pokemons = await getAll();
    res.status(200).json(pokemons);
  } catch (error) {
    console.error('Error en /pokemons:', error.message);
    res.status(500).json({ 
      error: 'Error al obtener Pokemon',
      message: error.message 
    });
  }
};

module.exports = getAllHandler;