require('dotenv').config();
const { Sequelize } = require('sequelize');
const { DB_USER, DB_PASSWORD, DB_HOST, NODE_ENV } = process.env;

// Database connection configuration
const sequelize = new Sequelize(
  `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/pokemon_db_tvfo`,
  {
    logging: false,
    native: false,
    dialectOptions: {
      ssl: NODE_ENV === 'production' ? {
        require: true,
        rejectUnauthorized: false
      } : false
    }
  }
);

// Import model definitions
const Pokemon = require('./models/Pokemon')(sequelize);
const Type = require('./models/Type')(sequelize);

Pokemon.belongsToMany(Type, { 
  through: 'pokemon_types',    
  as: 'types'                 
});

Type.belongsToMany(Pokemon, { 
  through: 'pokemon_types',
  as: 'pokemons'              
});

module.exports = {
  conn: sequelize,
  Pokemon,
  Type,
};