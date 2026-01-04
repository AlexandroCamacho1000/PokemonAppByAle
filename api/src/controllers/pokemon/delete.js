const { Pokemon } = require('../../db');

const deletePokemon = async (id) => {
  try {
    console.log(`🗑️ Eliminando Pokemon ID: ${id}`);
    
    // DEBUG: Ver qué ID recibimos
    console.log(`🔍 Tipo de ID: ${typeof id}, Valor: ${id}`);

    // 1. Buscar Pokemon en DB
    const pokemon = await Pokemon.findByPk(id);

    if (!pokemon) {
      throw new Error(`Pokemon con ID ${id} no encontrado`);
    }

    // 2. ✅ VALIDACIÓN CORRECTA PARA TU MODELO:
    // Tu modelo NO tiene campo 'created', así que usamos UUID check
    const idStr = id.toString();
    const isUUID = idStr.includes('-');
    
    console.log(`📊 ¿Es UUID (tiene guiones)?: ${isUUID}`);
    
    if (!isUUID) {
      throw new Error('Solo se pueden eliminar pokémons creados por usuarios');
    }

    // 3. Eliminar
    await pokemon.destroy();

    console.log(`✅ Pokemon eliminado: ${pokemon.name}`);

    return { 
      success: true,
      message: `Pokemon "${pokemon.name}" eliminado exitosamente`,
      id: id
    };

  } catch (error) {
    console.error(`❌ Error eliminando Pokemon ${id}:`, error.message);
    throw new Error(error.message);
  }
};

module.exports = deletePokemon;