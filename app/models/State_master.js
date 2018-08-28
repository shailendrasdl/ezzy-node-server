/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('State_master', {
    id: {
      type: DataTypes.INTEGER(50).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    state_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ''
    },
    state_code: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    country_id: {
      type: DataTypes.INTEGER(50).UNSIGNED,
      allowNull: false,
      references: {
        model: 'Country_master',
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
    tableName: 'State_master'
  });
};
