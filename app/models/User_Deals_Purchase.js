/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('User_Deals_Purchase', {
    id: {
      type: DataTypes.INTEGER(50).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER(50).UNSIGNED,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'user_id'
      }
    },
    deal_id: {
      type: DataTypes.INTEGER(50).UNSIGNED,
      allowNull: true,
      references: {
        model: 'Deals',
        key: 'id'
      }
    },
    price: {
      type: DataTypes.INTEGER(50),
      allowNull: true
    },
    transaction_id: {
      type: DataTypes.INTEGER(50).UNSIGNED,
      allowNull: true,
      references: {
        model: 'Transactions',
        key: 'id'
      }
    },
    deal_status: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    deal_code: {
      type: DataTypes.STRING(50),
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
    tableName: 'User_Deals_Purchase'
  });
};
