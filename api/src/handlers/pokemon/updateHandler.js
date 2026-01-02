const updatePokemon = require('../../controllers/pokemon/update');

const updateHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    console.log(`PUT /pokemons/${id}`, updateData);

    if (!updateData || Object.keys(updateData).length === 0) {
      return res.status(400).json({
        error: 'Datos requeridos',
        message: 'Debe enviar los campos a actualizar en el body'
      });
    }

    const updatedPokemon = await updatePokemon(id, updateData);
    
    res.status(200).json({
      message: '✅ Pokemon actualizado exitosamente',
      pokemon: updatedPokemon
    });

  } catch (error) {
    console.error(`Error en PUT /pokemons/${req.params.id}:`, error.message);
    
    if (error.message.includes('no encontrado')) {
      res.status(404).json({
        error: 'Pokemon no encontrado',
        message: error.message
      });
    } else if (error.message.includes('No hay campos válidos')) {
      res.status(400).json({
        error: 'Error de validación',
        message: error.message
      });
    } else {
      res.status(500).json({
        error: 'Error al actualizar Pokemon',
        message: error.message
      });
    }
  }
};

module.exports = updateHandler;