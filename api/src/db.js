require('dotenv').config();
const { Sequelize } = require('sequelize');
const { DB_USER, DB_PASSWORD, DB_HOST } = process.env;

// Database connection
const sequelize = new Sequelize(
  `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/pokemon`,
  {
    logging: false,
    native: false,
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