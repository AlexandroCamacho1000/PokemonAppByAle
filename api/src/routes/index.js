const { Router } = require('express');
const router = Router();

// Pokemon route handlers
const getAllHandler = require('../handlers/pokemon/getAllHandler');
const getByIdHandler = require('../handlers/pokemon/getByIdHandler');
const getByNameHandler = require('../handlers/pokemon/getByNameHandler');
const createHandler = require('../handlers/pokemon/createHandler');
const updateHandler = require('../handlers/pokemon/updateHandler');
const deleteHandler = require('../handlers/pokemon/deleteHandler');

// Type route handler
const typeHandler = require('../handlers/type/typeHandler');

// Test route
router.get('/test', (req, res) => {
  res.status(200).json({ 
    message: 'Server operational',
    endpoints: {
      test: 'GET /test',
      getAllPokemons: 'GET /pokemons',
      getPokemonById: 'GET /pokemons/:id',
      searchPokemonByName: 'GET /pokemons/name',
      createPokemon: 'POST /pokemons',
      updatePokemon: 'PUT /pokemons/:id',
      deletePokemon: 'DELETE /pokemons/:id',
      getTypes: 'GET /types'
    }
  });
});

// Pokemon routes
router.get('/pokemons', getAllHandler);
router.get('/pokemons/name', getByNameHandler);
router.get('/pokemons/:id', getByIdHandler);
router.post('/pokemons', createHandler);
router.put('/pokemons/:id', updateHandler);
router.delete('/pokemons/:id', deleteHandler);

// Type route
router.get('/types', typeHandler);

module.exports = router;