/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Services', {
    id: {
      type: DataTypes.INTEGER(50).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ''
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ''
    },
    duration: {
      type: "DOUBLE",
      allowNull: true
    },
    price: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    category_id: {
      type: DataTypes.INTEGER(50),
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
    tableName: 'Services'
  });
};
