/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Logger', {
    id: {
      type: DataTypes.INTEGER(50).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    service_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    request_parameters: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    header_parameters: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    service_method: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    service_user: {
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
    tableName: 'Logger'
  });
};
