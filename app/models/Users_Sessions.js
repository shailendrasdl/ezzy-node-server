/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Users_Sessions', {
    id: {
      type: DataTypes.INTEGER(50).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    session_token: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    user_id: {
      type: DataTypes.INTEGER(50),
      allowNull: true
    },
    device_id: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    last_known_lat: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    last_known_long: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    current_screen: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    active: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    login_source: {
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
    tableName: 'Users_Sessions'
  });
};
