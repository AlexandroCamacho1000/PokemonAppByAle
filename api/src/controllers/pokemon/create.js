const { Pokemon, Type } = require('../../db');

const create = async (pokemonData) => {
  try {
    // Input validation - check required fields
    if (!pokemonData?.name || !pokemonData?.image || !pokemonData?.hp || 
        !pokemonData?.attack || !pokemonData?.defense) {
      throw new Error('Missing required data: name, image, hp, attack, defense');
    }

    // Normalize types input - accept array or string
    let typesArray = [];
    if (pokemonData.types) {
      typesArray = Array.isArray(pokemonData.types) 
        ? pokemonData.types 
        : [pokemonData.types];
    }
    
    if (typesArray.length === 0) {
      throw new Error('At least one type must be provided');
    }

    // Check for duplicate Pokemon name
    const existingPokemon = await Pokemon.findOne({
      where: { name: pokemonData.name }
    });

    if (existingPokemon) {
      throw new Error(`Pokemon "${pokemonData.name}" already exists`);
    }

    // Create Pokemon record
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

    // Find or create each type
    const typeInstances = await Promise.all(
      typesArray.map(async (typeName) => {
        const [type] = await Type.findOrCreate({
          where: { name: typeName.toLowerCase().trim() }
        });
        return type;
      })
    );

    // Associate types with Pokemon (many-to-many)
    await newPokemon.setTypes(typeInstances);

  
    const createdPokemon = await Pokemon.findByPk(newPokemon.id, {
      include: {
        model: Type,
        as: 'types',  
        attributes: ['name'],
        through: { attributes: [] }
      }
    });

    // Format response to match API schema
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
    console.error('Create Pokemon error:', error.message);
    throw error;
  }
};

module.exports = create;