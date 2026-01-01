const getById = require('../../controllers/pokemon/getById');

const getByIdHandler = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`GET /pokemons/${id}`);
    
    const pokemon = await getById(id);
    
    if (pokemon) {
      res.status(200).json(pokemon);
    } else {
      res.status(404).json({ 
        error: 'Pokemon no encontrado',
        message: `No se encontró un Pokemon con ID ${id}`
      });
    }
  } catch (error) {
    console.error(`Error en /pokemons/${req.params.id}:`, error.message);
    
    if (error.message.includes('no encontrado')) {
      res.status(404).json({ 
        error: 'Pokemon no encontrado',
        message: error.message
      });
    } else {
      res.status(500).json({ 
        error: 'Error al buscar Pokemon',
        message: error.message
      });
    }
  }
};

module.exports = getByIdHandler;