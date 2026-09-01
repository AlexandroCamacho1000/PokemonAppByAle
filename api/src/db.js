require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env.local') });
const { Sequelize } = require('sequelize');
const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, DATABASE_URL, DATABASE_URL_UNPOOLED, NODE_ENV } = process.env;

// Database connection configuration - professional: DATABASE_URL first (Neon), fallback local vars
let sequelize;
if (DATABASE_URL) {
  sequelize = new Sequelize(DATABASE_URL, {
    logging: false,
    native: false,
    dialect: 'postgres',
    dialectOptions: {
      ssl: { require: true, rejectUnauthorized: false },
      channelBinding: 'require',
    },
  });
} else if (DATABASE_URL_UNPOOLED) {
  sequelize = new Sequelize(DATABASE_URL_UNPOOLED, {
    logging: false,
    native: false,
    dialect: 'postgres',
    dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
  });
} else {
  const dbName = DB_NAME || 'pokemon_db_tvfo';
  sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${dbName}`, {
    logging: false,
    native: false,
    dialectOptions: {
      ssl: NODE_ENV === 'production' ? { require: true, rejectUnauthorized: false } : false,
    },
  });
}

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