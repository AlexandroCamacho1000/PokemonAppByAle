const { Pokemon } = require('../../db');

const deletePokemon = async (id) => {
  try {
    console.log(`Eliminando Pokemon ID: ${id}`);

    // 1. Buscar Pokemon en DB
    const pokemon = await Pokemon.findByPk(id);

    if (!pokemon) {
      throw new Error(`Pokemon con ID ${id} no encontrado en la base de datos`);
    }

    // 2. Guardar nombre para mensaje
    const pokemonName = pokemon.name;

    // 3. Eliminar
    await pokemon.destroy();

    console.log(`✅ Pokemon eliminado: ${pokemonName}`);

    return { 
      message: `Pokemon "${pokemonName}" eliminado exitosamente`,
      id: id
    };

  } catch (error) {
    console.error(`Error eliminando Pokemon ${id}:`, error.message);
    throw new Error(`Error al eliminar Pokemon: ${error.message}`);
  }
};

module.exports = deletePokemon;