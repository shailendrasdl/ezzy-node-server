/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Service_Booking', {
    id: {
      type: DataTypes.INTEGER(50).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    booked_for: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    booked_by: {
      type: DataTypes.INTEGER(50).UNSIGNED,
      allowNull: true
    },
    contact_number: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    gender: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    booking_date_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    transaction_id: {
      type: DataTypes.INTEGER(50).UNSIGNED,
      allowNull: true
    },
    special_instructions: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    order_status: {
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
    tableName: 'Service_Booking'
  });
};
