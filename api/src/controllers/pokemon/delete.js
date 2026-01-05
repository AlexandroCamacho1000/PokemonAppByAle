const { Pokemon } = require('../../db');

const deletePokemon = async (id) => {
  try {
    console.log(`Deleting Pokemon ID: ${id}`);

    const pokemon = await Pokemon.findByPk(id);

    if (!pokemon) {
      throw new Error(`Pokemon with ID ${id} not found`);
    }

    // Only user-created Pokemon (UUID format) can be deleted
    const idStr = id.toString();
    const isUUID = idStr.includes('-');
    
    if (!isUUID) {
      throw new Error('Only user-created Pokemon can be deleted');
    }

    await pokemon.destroy();

    console.log(`Pokemon deleted: ${pokemon.name}`);

    return { 
      success: true,
      message: `Pokemon "${pokemon.name}" deleted successfully`,
      id: id
    };

  } catch (error) {
    console.error(`Error deleting Pokemon ${id}:`, error.message);
    throw new Error(error.message);
  }
};

module.exports = deletePokemon;