/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Service_category', {
    id: {
      type: DataTypes.INTEGER(50).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    category_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    category_gender: {
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
    tableName: 'Service_category'
  });
};
