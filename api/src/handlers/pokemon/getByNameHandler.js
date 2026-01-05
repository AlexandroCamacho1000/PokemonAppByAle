const getByName = require('../../controllers/pokemon/getByName');

const getByNameHandler = async (req, res) => {
  try {
    const { name } = req.query;
    
    if (!name) {
      return res.status(400).json({ 
        error: 'Name required',
        message: 'Query parameter "name" must be provided'
      });
    }

    console.log(`GET /pokemons/name?name=${name}`);
    
    const result = await getByName(name);
    
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ 
        error: 'Pokemon not found',
        message: `No Pokemon found with name "${name}"`
      });
    }
  } catch (error) {
    console.error(`Error in /pokemons/name:`, error.message);
    
    if (error.message.includes('not found')) {
      res.status(404).json({ 
        error: 'Pokemon not found',
        message: error.message
      });
    } else if (error.message.includes('must be provided')) {
      res.status(400).json({ 
        error: 'Bad request',
        message: error.message
      });
    } else {
      res.status(500).json({ 
        error: 'Error searching Pokemon',
        message: error.message
      });
    }
  }
};

module.exports = getByNameHandler;