const { Pokemon, Type } = require('../../db');

const create = async (pokemonData) => {
  try {
    console.log('Creating new Pokemon:', pokemonData?.name);

    // Basic validations
    if (!pokemonData || !pokemonData.name || !pokemonData.image || !pokemonData.hp || 
        !pokemonData.attack || !pokemonData.defense) {
      throw new Error('Missing required data: name, image, hp, attack, defense');
    }

    // Validate and normalize types
    if (!pokemonData.types) {
      throw new Error('At least one type must be provided');
    }
    
    let typesArray = pokemonData.types;
    if (!Array.isArray(typesArray)) {
      if (typeof typesArray === 'string') {
        typesArray = [typesArray];
      } else {
        throw new Error('The "types" field must be an array or string');
      }
    }

    if (typesArray.length === 0) {
      throw new Error('At least one type must be provided');
    }

    // Check if Pokemon already exists
    const existingPokemon = await Pokemon.findOne({
      where: { name: pokemonData.name }
    });

    if (existingPokemon) {
      throw new Error(`A Pokemon with name "${pokemonData.name}" already exists`);
    }

    // Create Pokemon
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

    // Find or create types
    const typeInstances = await Promise.all(
      typesArray.map(async (typeName) => {
        const [type] = await Type.findOrCreate({
          where: { name: typeName.toLowerCase().trim() }
        });
        return type;
      })
    );

    // Associate types with Pokemon
    await newPokemon.setTypes(typeInstances);

    // Get Pokemon with types (reload with include)
    const createdPokemon = await Pokemon.findByPk(newPokemon.id, {
      include: {
        model: Type,
        attributes: ['name'],
        through: { attributes: [] }
      }
    });

    console.log(`Pokemon created: ${createdPokemon.name}`);
    console.log('Associated types:', createdPokemon.types?.length || 0);

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
    console.error('Error creating Pokemon:', error.message);
    throw new Error(`Error creating Pokemon: ${error.message}`);
  }
};

module.exports = create;