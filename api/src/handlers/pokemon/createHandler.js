const createPokemon = require('../../controllers/pokemon/create');

const createHandler = async (req, res) => {
  try {
    const pokemonData = req.body;
    console.log('POST /pokemons - Datos recibidos:', pokemonData.name);

    // Validar que hay datos
    if (!pokemonData || Object.keys(pokemonData).length === 0) {
      return res.status(400).json({
        error: 'Datos requeridos',
        message: 'Debe enviar los datos del Pokemon en el body'
      });
    }

    const newPokemon = await createPokemon(pokemonData);
    
    res.status(201).json({
      message: '✅ Pokemon creado exitosamente',
      pokemon: newPokemon
    });

  } catch (error) {
    console.error('Error en POST /pokemons:', error.message);
    
    if (error.message.includes('Faltan datos') || 
        error.message.includes('Debe proporcionar') ||
        error.message.includes('Ya existe')) {
      res.status(400).json({
        error: 'Error de validación',
        message: error.message
      });
    } else {
      res.status(500).json({
        error: 'Error al crear Pokemon',
        message: error.message
      });
    }
  }
};

module.exports = createHandler;