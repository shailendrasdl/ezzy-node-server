/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('User_Services', {
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
    service_id: {
      type: DataTypes.INTEGER(50).UNSIGNED,
      allowNull: true,
      references: {
        model: 'Services',
        key: 'id'
      }
    },
    quantity: {
      type: DataTypes.INTEGER(50),
      allowNull: true
    },
    price: {
      type: DataTypes.INTEGER(50),
      allowNull: true
    },
    total_duration: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    booking_id: {
      type: DataTypes.INTEGER(50).UNSIGNED,
      allowNull: true,
      references: {
        model: 'Service_Booking',
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
    tableName: 'User_Services'
  });
};
