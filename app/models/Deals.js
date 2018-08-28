/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Deals', {
    id: {
      type: DataTypes.INTEGER(50).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    deal_title: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    deal_description: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    business_id: {
      type: DataTypes.INTEGER(50).UNSIGNED,
      allowNull: true
    },
    created_by: {
      type: DataTypes.INTEGER(50),
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
    image_url: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    deal_type: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    valid_for: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    not_valid_for: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    valid_on: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    actual_price: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    percentage_off: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    net_price: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    other_details: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    min_person: {
      type: DataTypes.INTEGER(50),
      allowNull: true
    },
    max_person: {
      type: DataTypes.INTEGER(50),
      allowNull: true
    },
    max_purchase_quatity_per_person: {
      type: DataTypes.INTEGER(50),
      allowNull: true
    },
    total_number_of_deals: {
      type: DataTypes.INTEGER(50),
      allowNull: true
    },
    is_active: {
      type: DataTypes.INTEGER(1),
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
    tableName: 'Deals'
  });
};
