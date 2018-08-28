/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Discount_Coupons', {
    id: {
      type: DataTypes.INTEGER(50).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    coupon_code: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ''
    },
    discount_percent: {
      type: DataTypes.INTEGER(50),
      allowNull: true
    },
    valid_for: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    valid_from: {
      type: DataTypes.DATE,
      allowNull: true
    },
    valid_upto: {
      type: DataTypes.DATE,
      allowNull: true
    },
    remaining_coupon: {
      type: DataTypes.INTEGER(50),
      allowNull: true
    },
    total_limit: {
      type: DataTypes.INTEGER(50),
      allowNull: true
    },
    not_valid_on: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    created_by: {
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
    tableName: 'Discount_Coupons'
  });
};
