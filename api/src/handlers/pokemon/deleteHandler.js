const deletePokemon = require('../../controllers/pokemon/delete');

const deleteHandler = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log(`DELETE /pokemons/${id}`);

    const result = await deletePokemon(id);
    
    res.status(200).json(result);

  } catch (error) {
    console.error(`Error in DELETE /pokemons/${req.params.id}:`, error.message);
    
    if (error.message.includes('not found')) {
      res.status(404).json({
        error: 'Pokemon not found',
        message: error.message
      });
    } else {
      res.status(500).json({
        error: 'Error deleting Pokemon',
        message: error.message
      });
    }
  }
};

module.exports = deleteHandler;