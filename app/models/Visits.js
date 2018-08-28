/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Visits', {
    id: {
      type: DataTypes.INTEGER(50).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    entity_type: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    entity_id: {
      type: DataTypes.INTEGER(50).UNSIGNED,
      allowNull: true
    },
    user_id: {
      type: DataTypes.INTEGER(50).UNSIGNED,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'user_id'
      }
    },
    count: {
      type: DataTypes.INTEGER(50),
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
    tableName: 'Visits'
  });
};
