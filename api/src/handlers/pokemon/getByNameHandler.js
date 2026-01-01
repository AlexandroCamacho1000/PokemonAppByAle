const getByName = require('../../controllers/pokemon/getByName');

const getByNameHandler = async (req, res) => {
  try {
    const { name } = req.query;
    
    if (!name) {
      return res.status(400).json({ 
        error: 'Nombre requerido',
        message: 'Debe proporcionar un parámetro "name" en la consulta'
      });
    }

    console.log(`GET /pokemons/name?name=${name}`);
    
    const result = await getByName(name);
    
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ 
        error: 'Pokemon no encontrado',
        message: `No se encontró un Pokemon con el nombre "${name}"`
      });
    }
  } catch (error) {
    console.error(`Error en /pokemons/name:`, error.message);
    
    if (error.message.includes('no encontrado')) {
      res.status(404).json({ 
        error: 'Pokemon no encontrado',
        message: error.message
      });
    } else if (error.message.includes('Debe proporcionar')) {
      res.status(400).json({ 
        error: 'Solicitud incorrecta',
        message: error.message
      });
    } else {
      res.status(500).json({ 
        error: 'Error al buscar Pokemon',
        message: error.message
      });
    }
  }
};

module.exports = getByNameHandler;