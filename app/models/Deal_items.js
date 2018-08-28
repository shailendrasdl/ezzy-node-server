/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Deal_items', {
    id: {
      type: DataTypes.INTEGER(50).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    item_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    actual_price: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    discounted_price: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    deal_item_type: {
      type: DataTypes.INTEGER(50),
      allowNull: true
    },
    max_quantity: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    max_purchase_quantity_per_customer: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    min_no_of_person_valid_for: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    max_no_of_person_valid_for: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    validity_details: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    valid_for: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    terms_and_conditions: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    not_valid_for: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    is_active: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    end_date: {
      type: DataTypes.DATE,
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
    tableName: 'Deal_items'
  });
};
