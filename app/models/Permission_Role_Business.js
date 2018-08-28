/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Permission_Role_Business', {
    id: {
      type: DataTypes.INTEGER(50).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    permission_id: {
      type: DataTypes.INTEGER(50).UNSIGNED,
      allowNull: true,
      references: {
        model: 'Permissions_master',
        key: 'id'
      }
    },
    role_id: {
      type: DataTypes.INTEGER(50).UNSIGNED,
      allowNull: true,
      references: {
        model: 'Roles_master',
        key: 'id'
      }
    },
    business_id: {
      type: DataTypes.INTEGER(50).UNSIGNED,
      allowNull: true,
      references: {
        model: 'Business',
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
    tableName: 'Permission_Role_Business'
  });
};
