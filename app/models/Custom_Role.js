/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Custom_Role', {
    id: {
      type: DataTypes.INTEGER(50).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    role_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ''
    },
    business_id: {
      type: DataTypes.INTEGER(50).UNSIGNED,
      allowNull: false,
      references: {
        model: 'Business',
        key: 'id'
      }
    },
    active: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: '1'
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
    tableName: 'Custom_Role'
  });
};
