const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Type = sequelize.define('Type', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  }, {
    timestamps: false,
    tableName: 'types',
  });

  // Many-to-many relationship with Pokemon
  Type.associate = (models) => {
    Type.belongsToMany(models.Pokemon, {
      through: 'pokemon_types',
      foreignKey: 'typeId',
      otherKey: 'pokemonId',
      as: 'pokemons',
    });
  };

  return Type;
};