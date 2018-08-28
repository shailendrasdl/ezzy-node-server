/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Country_master', {
    id: {
      type: DataTypes.INTEGER(50).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    country_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ''
    },
    country_code: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    default_phone_code: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    default_currency: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'Country_master'
  });
};
