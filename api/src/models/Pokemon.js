const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Pokemon = sequelize.define('Pokemon', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    hp: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    attack: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    defense: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    speed: DataTypes.INTEGER,
    height: DataTypes.INTEGER,
    weight: DataTypes.INTEGER,
  }, {
    timestamps: false,
    tableName: 'pokemons',
  });

  // Many-to-many relationship with Type
  Pokemon.associate = (models) => {
    Pokemon.belongsToMany(models.Type, {
      through: 'pokemon_types',
      foreignKey: 'pokemonId',
      otherKey: 'typeId',
      as: 'types',
    });
  };

  return Pokemon;
};