const { Router } = require('express');
const router = Router();

// RUTAS DE POKÉMON (comentadas temporalmente hasta crear los handlers)
// const getAllHandler = require('../handlers/pokemon/getAllHandler');
// const getByIdHandler = require('../handlers/pokemon/getByIdHandler');
// const getByNameHandler = require('../handlers/pokemon/getByNameHandler');
// const createHandler = require('../handlers/pokemon/createHandler');

// RUTA DE TIPOS (comentada temporalmente)
// const typeHandler = require('../handlers/type/typeHandler');

// RUTA DE PRUEBA
router.get('/test', (req, res) => {
  res.status(200).json({ 
    message: '✅ Servidor funcionando',
    endpoints: {
      test: 'GET /test',
      // Agregaremos los demás cuando estén listos
    }
  });
});

// RUTAS COMENTADAS (activar una por una)
// router.get('/pokemons', getAllHandler);
// router.get('/pokemons/:id', getByIdHandler);
// router.get('/pokemons/name', getByNameHandler);
// router.post('/pokemons', createHandler);
// router.get('/types', typeHandler);

module.exports = router;