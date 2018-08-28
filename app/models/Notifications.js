/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Notifications', {
    id: {
      type: DataTypes.INTEGER(50).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    sent_to: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    group_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    firebase_token: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    notification_text: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    payload: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    notificaiton_type: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    visible: {
      type: DataTypes.INTEGER(1),
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
    tableName: 'Notifications'
  });
};
