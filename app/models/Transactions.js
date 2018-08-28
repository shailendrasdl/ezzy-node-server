/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Transactions', {
    id: {
      type: DataTypes.INTEGER(50).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    bank_transaction_id: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    amount: {
      type: DataTypes.INTEGER(50),
      allowNull: true
    },
    balance: {
      type: DataTypes.INTEGER(50),
      allowNull: true
    },
    discount: {
      type: DataTypes.INTEGER(50),
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
    coupon_code: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    transaction_mode: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    transaction_status: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    business_id: {
      type: DataTypes.INTEGER(50).UNSIGNED,
      allowNull: true,
      references: {
        model: 'Business',
        key: 'id'
      }
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
    tableName: 'Transactions'
  });
};
