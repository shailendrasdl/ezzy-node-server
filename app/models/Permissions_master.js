/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Permissions_master', {
    id: {
      type: DataTypes.INTEGER(50).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    module_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ''
    },
    module_code: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    active: {
      type: DataTypes.INTEGER(1),
      allowNull: false
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
    tableName: 'Permissions_master'
  });
};
