/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Business_Service', {
    id: {
      type: DataTypes.INTEGER(50).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    business_id: {
      type: DataTypes.INTEGER(50),
      allowNull: true
    },
    service_id: {
      type: DataTypes.INTEGER(50),
      allowNull: true
    },
    price: {
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
    tableName: 'Business_Service'
  });
};
