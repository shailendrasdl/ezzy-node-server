/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Amenities_master', {
    id: {
      type: DataTypes.INTEGER(50).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    active: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    icon_url: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'Amenities_master'
  });
};
