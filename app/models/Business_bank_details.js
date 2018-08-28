/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Business_bank_details', {
    id: {
      type: DataTypes.INTEGER(50).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    bank_name: {
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
    ifsc_code: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    account_number: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    branch_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    account_holder_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    pan_card_number: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    account_type: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    gst_number: {
      type: DataTypes.STRING(255),
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
    tableName: 'Business_bank_details'
  });
};
