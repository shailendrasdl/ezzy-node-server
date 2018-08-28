/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('City_master', {
    id: {
      type: DataTypes.INTEGER(50).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    city_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ''
    },
    city_code: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    state_id: {
      type: DataTypes.INTEGER(50).UNSIGNED,
      allowNull: false,
      references: {
        model: 'State_master',
        key: 'id'
      }
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
    tableName: 'City_master'
  });
};
