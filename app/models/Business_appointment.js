/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Business_appointment', {
    id: {
      type: DataTypes.INTEGER(50).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER(50).UNSIGNED,
      allowNull: true
    },
    business_id: {
      type: DataTypes.INTEGER(50).UNSIGNED,
      allowNull: true
    },
    booked_by: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    booked_for: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    booking_date_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    customer_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    gender: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    customer_contact_number: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    email_address: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    special_instructions: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    booking_status: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    cancellation_reason: {
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
    tableName: 'Business_appointment'
  });
};
