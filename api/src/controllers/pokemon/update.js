const { Pokemon, Type } = require('../../db');

const update = async (id, updateData) => {
  try {
    console.log(`Actualizando Pokemon ID: ${id}`);

    // 1. Buscar Pokemon en DB
    const pokemon = await Pokemon.findByPk(id);

    if (!pokemon) {
      throw new Error(`Pokemon con ID ${id} no encontrado en la base de datos`);
    }

    // 2. Actualizar campos básicos
    const allowedFields = ['name', 'image', 'hp', 'attack', 'defense', 'speed', 'height', 'weight'];
    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        pokemon[field] = updateData[field];
      }
    });

    await pokemon.save();

    // 3. Actualizar tipos si se proporcionan
    if (updateData.types && Array.isArray(updateData.types)) {
      const typeInstances = await Promise.all(
        updateData.types.map(async (typeName) => {
          const [type] = await Type.findOrCreate({
            where: { name: typeName.toLowerCase().trim() }
          });
          return type;
        })
      );
      
      await pokemon.setTypes(typeInstances);
    }

    // 4. Obtener tipos actualizados
    const assignedTypes = await pokemon.getTypes();
    const typesNames = assignedTypes.map(t => t.name);

    console.log(`✅ Pokemon actualizado: ${pokemon.name}`);
    console.log(`✅ Tipos actualizados: ${typesNames.join(', ')}`);

    return {
      id: pokemon.id,
      name: pokemon.name,
      image: pokemon.image,
      hp: pokemon.hp,
      attack: pokemon.attack,
      defense: pokemon.defense,
      speed: pokemon.speed || 0,
      height: pokemon.height || 0,
      weight: pokemon.weight || 0,
      types: typesNames,
      source: 'db'
    };

  } catch (error) {
    console.error(`Error actualizando Pokemon ${id}:`, error.message);
    throw new Error(`Error al actualizar Pokemon: ${error.message}`);
  }
};

module.exports = update;