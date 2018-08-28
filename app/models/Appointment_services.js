/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Appointment_services', {
    id: {
      type: DataTypes.INTEGER(50).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    appointment_id: {
      type: DataTypes.INTEGER(50).UNSIGNED,
      allowNull: true
    },
    service_id: {
      type: DataTypes.INTEGER(50).UNSIGNED,
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
    tableName: 'Appointment_services'
  });
};
