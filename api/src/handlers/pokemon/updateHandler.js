const updatePokemon = require('../../controllers/pokemon/update');

const updateHandler = async (req, res) => {
  const { id } = req.params;
  
  try {
    console.log(`🔄 PUT /pokemons/${id}`);
    console.log('📦 Datos recibidos:', req.body);

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Datos requeridos',
        message: 'Debe enviar los campos a actualizar'
      });
    }

    const updatedPokemon = await updatePokemon(id, req.body);
    
    res.status(200).json({
      success: true,
      message: '✅ Pokemon actualizado exitosamente',
      pokemon: updatedPokemon
    });

  } catch (error) {
    console.error(`❌ Error en PUT /pokemons/${id}:`, error.message);
    
    // ✅ MANEJO ESPECÍFICO DE ERRORES
    if (error.message.includes('no encontrado')) {
      res.status(404).json({
        success: false,
        error: 'Pokemon no encontrado',
        message: error.message
      });
    } else if (error.message.includes('Solo se pueden actualizar')) {
      // ✅ ESTE ES EL QUE FALTABA
      res.status(403).json({
        success: false,
        error: 'No autorizado',
        message: error.message
      });
    } else if (error.message.includes('No hay campos válidos')) {
      res.status(400).json({
        success: false,
        error: 'Error de validación',
        message: error.message
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Error al actualizar Pokemon',
        message: error.message
      });
    }
  }
};

module.exports = updateHandler;