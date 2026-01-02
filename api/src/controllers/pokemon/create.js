const { Pokemon, Type } = require('../../db');

const create = async (pokemonData) => {
  try {
    console.log('Creando nuevo Pokemon:', pokemonData?.name);

    // Validaciones básicas
    if (!pokemonData || !pokemonData.name || !pokemonData.image || !pokemonData.hp || 
        !pokemonData.attack || !pokemonData.defense) {
      throw new Error('Faltan datos requeridos: name, image, hp, attack, defense');
    }

    // Validar y normalizar tipos
    if (!pokemonData.types) {
      throw new Error('Debe proporcionar al menos un tipo');
    }
    
    // Asegurar que types sea un array
    let typesArray = pokemonData.types;
    if (!Array.isArray(typesArray)) {
      if (typeof typesArray === 'string') {
        typesArray = [typesArray];
      } else {
        throw new Error('El campo "types" debe ser un array o string');
      }
    }

    if (typesArray.length === 0) {
      throw new Error('Debe proporcionar al menos un tipo');
    }

    // Verificar si el Pokemon ya existe
    const existingPokemon = await Pokemon.findOne({
      where: { name: pokemonData.name }
    });

    if (existingPokemon) {
      throw new Error(`Ya existe un Pokemon con el nombre "${pokemonData.name}"`);
    }

    // Crear el Pokemon
    const newPokemon = await Pokemon.create({
      name: pokemonData.name,
      image: pokemonData.image,
      hp: pokemonData.hp,
      attack: pokemonData.attack,
      defense: pokemonData.defense,
      speed: pokemonData.speed || null,
      height: pokemonData.height || null,
      weight: pokemonData.weight || null,
    });

    // Buscar o crear los tipos
    const typeInstances = await Promise.all(
      typesArray.map(async (typeName) => {
        const [type] = await Type.findOrCreate({
          where: { name: typeName.toLowerCase().trim() }
        });
        return type;
      })
    );

    // Asociar tipos al Pokemon
    await newPokemon.setTypes(typeInstances);

    // Obtener el Pokemon con sus tipos (reload con include)
    const createdPokemon = await Pokemon.findByPk(newPokemon.id, {
      include: {
        model: Type,
        attributes: ['name'],
        through: { attributes: [] }
      }
    });

    console.log(`✅ Pokemon creado: ${createdPokemon.name}`);
    console.log('Tipos asociados:', createdPokemon.types?.length || 0);

    return {
      id: createdPokemon.id,
      name: createdPokemon.name,
      image: createdPokemon.image,
      hp: createdPokemon.hp,
      attack: createdPokemon.attack,
      defense: createdPokemon.defense,
      speed: createdPokemon.speed || 0,
      height: createdPokemon.height || 0,
      weight: createdPokemon.weight || 0,
      types: createdPokemon.types ? createdPokemon.types.map(type => type.name) : [],
      source: 'db'
    };

  } catch (error) {
    console.error('Error creando Pokemon:', error.message);
    throw new Error(`Error al crear Pokemon: ${error.message}`);
  }
};

module.exports = create;