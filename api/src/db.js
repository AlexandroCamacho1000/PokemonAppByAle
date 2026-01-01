// src/db.js
require('dotenv').config();
const { Sequelize } = require('sequelize');
const { DB_USER, DB_PASSWORD, DB_HOST } = process.env;

// 1. Conexión a PostgreSQL
const sequelize = new Sequelize(
  `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/pokemon`,
  {
    logging: false,
    native: false,
  }
);

// 2. Importar modelos manualmente (más control)
const Pokemon = require('./models/Pokemon')(sequelize);
const Type = require('./models/Type')(sequelize);

// 3. Definir relaciones
Pokemon.belongsToMany(Type, { through: 'PokemonType' });
Type.belongsToMany(Pokemon, { through: 'PokemonType' });

// 4. Exportar
module.exports = {
  conn: sequelize,
  Pokemon,
  Type,
};