const { Pokemon, Type } = require('../../db');

const update = async (id, updateData) => {
  try {
    console.log(`🔄 Actualizando Pokemon ID: ${id}`);

    // 1. Buscar Pokemon en DB
    const pokemon = await Pokemon.findByPk(id);

    if (!pokemon) {
      throw new Error(`Pokemon con ID ${id} no encontrado`);
    }

    // 2. ✅ VERIFICAR SI FUE CREADO POR USUARIO (igual que en DELETE)
    // Como tu modelo no tiene campo 'created', verifica por UUID
    const idStr = id.toString();
    const isUUID = idStr.includes('-');
    
    if (!isUUID) {
      throw new Error('Solo se pueden actualizar pokémons creados por usuarios');
    }

    // 3. Actualizar campos básicos
    const allowedFields = ['name', 'image', 'hp', 'attack', 'defense', 'speed', 'height', 'weight'];
    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        pokemon[field] = updateData[field];
      }
    });

    await pokemon.save();

    // 4. Actualizar tipos si se proporcionan
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

    // 5. Obtener tipos actualizados
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
    console.error(`❌ Error actualizando Pokemon ${id}:`, error.message);
    throw new Error(error.message); // Propaga mensaje original
  }
};

module.exports = update;