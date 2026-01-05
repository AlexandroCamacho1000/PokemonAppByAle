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
        error: 'Pokemon not found',
        message: `No Pokemon found with ID ${id}`
      });
    }
  } catch (error) {
    console.error(`Error in /pokemons/${req.params.id}:`, error.message);
    
    if (error.message.includes('not found')) {
      res.status(404).json({ 
        error: 'Pokemon not found',
        message: error.message
      });
    } else {
      res.status(500).json({ 
        error: 'Error searching Pokemon',
        message: error.message
      });
    }
  }
};

module.exports = getByIdHandler;