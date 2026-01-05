const updatePokemon = require('../../controllers/pokemon/update');

const updateHandler = async (req, res) => {
  const { id } = req.params;
  
  try {
    console.log(`PUT /pokemons/${id}`);
    console.log('Data received:', req.body);

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Data required',
        message: 'Fields to update must be provided'
      });
    }

    const updatedPokemon = await updatePokemon(id, req.body);
    
    res.status(200).json({
      success: true,
      message: 'Pokemon updated successfully',
      pokemon: updatedPokemon
    });

  } catch (error) {
    console.error(`Error in PUT /pokemons/${id}:`, error.message);
    
    // Handle specific error cases
    if (error.message.includes('not found')) {
      res.status(404).json({
        success: false,
        error: 'Pokemon not found',
        message: error.message
      });
    } else if (error.message.includes('Only user-created Pokemon')) {
      res.status(403).json({
        success: false,
        error: 'Unauthorized',
        message: error.message
      });
    } else if (error.message.includes('No hay campos válidos')) {
      res.status(400).json({
        success: false,
        error: 'Validation error',
        message: error.message
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Error updating Pokemon',
        message: error.message
      });
    }
  }
};

module.exports = updateHandler;