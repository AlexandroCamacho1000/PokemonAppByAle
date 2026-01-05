require('dotenv').config();
const { Sequelize } = require('sequelize');
const { DB_USER, DB_PASSWORD, DB_HOST, NODE_ENV } = process.env;

// Database connection - CAMBIA pokemon POR pokemon_db_tvfo
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

// Import models
const Pokemon = require('./models/Pokemon')(sequelize);
const Type = require('./models/Type')(sequelize);

// Define model relationships
Pokemon.belongsToMany(Type, { through: 'PokemonType' });
Type.belongsToMany(Pokemon, { through: 'PokemonType' });

module.exports = {
  conn: sequelize,
  Pokemon,
  Type,
};