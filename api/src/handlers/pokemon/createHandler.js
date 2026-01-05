const createPokemon = require('../../controllers/pokemon/create');

const createHandler = async (req, res) => {
  try {
    const pokemonData = req.body;
    console.log('POST /pokemons - Data received:', pokemonData.name);

    // Validate request data
    if (!pokemonData || Object.keys(pokemonData).length === 0) {
      return res.status(400).json({
        error: 'Data required',
        message: 'Pokemon data must be provided in request body'
      });
    }

    const newPokemon = await createPokemon(pokemonData);
    
    res.status(201).json({
      message: 'Pokemon created successfully',
      pokemon: newPokemon
    });

  } catch (error) {
    console.error('Error in POST /pokemons:', error.message);
    
    // Handle validation errors
    if (error.message.includes('Missing required data') || 
        error.message.includes('At least one type') ||
        error.message.includes('already exists')) {
      res.status(400).json({
        error: 'Validation error',
        message: error.message
      });
    } else {
      res.status(500).json({
        error: 'Error creating Pokemon',
        message: error.message
      });
    }
  }
};

module.exports = createHandler;