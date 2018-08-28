/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Service_Booking_Services', {
    id: {
      type: DataTypes.INTEGER(50).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    service_booking_id: {
      type: DataTypes.INTEGER(50).UNSIGNED,
      allowNull: true,
      references: {
        model: 'Service_Booking',
        key: 'id'
      }
    },
    service_id: {
      type: DataTypes.INTEGER(50).UNSIGNED,
      allowNull: true,
      references: {
        model: 'Services',
        key: 'id'
      }
    },
    price: {
      type: DataTypes.INTEGER(50),
      allowNull: true
    },
    quantity: {
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
    tableName: 'Service_Booking_Services'
  });
};
