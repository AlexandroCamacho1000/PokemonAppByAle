const { Pokemon, Type } = require('../../db');

const update = async (id, updateData) => {
  try {
    console.log(`Updating Pokemon ID: ${id}`);

    const pokemon = await Pokemon.findByPk(id);

    if (!pokemon) {
      throw new Error(`Pokemon with ID ${id} not found`);
    }

    // Only user-created Pokemon (UUID format) can be updated
    const idStr = id.toString();
    const isUUID = idStr.includes('-');
    
    if (!isUUID) {
      throw new Error('Only user-created Pokemon can be updated');
    }

    // Update basic fields
    const allowedFields = ['name', 'image', 'hp', 'attack', 'defense', 'speed', 'height', 'weight'];
    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        pokemon[field] = updateData[field];
      }
    });

    await pokemon.save();

    // Update types if provided
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

    // Get updated types
    const assignedTypes = await pokemon.getTypes();
    const typesNames = assignedTypes.map(t => t.name);

    console.log(`Pokemon updated: ${pokemon.name}`);
    console.log(`Updated types: ${typesNames.join(', ')}`);

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
    console.error(`Error updating Pokemon ${id}:`, error.message);
    throw new Error(error.message);
  }
};

module.exports = update;