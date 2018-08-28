/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('City_areas', {
    id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    area_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    area_code: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    pincode: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    city_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    area_lat: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    area_long: {
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
    tableName: 'City_areas'
  });
};
