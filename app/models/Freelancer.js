/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Freelancer', {
    id: {
      type: DataTypes.INTEGER(50).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    full_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: ''
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ''
    },
    mobile_number: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: ''
    },
    otp: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    mobile_verified: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    email_address: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    email_verified: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    date_of_birth: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    city_id: {
      type: DataTypes.INTEGER(50).UNSIGNED,
      allowNull: true,
      references: {
        model: 'City_master',
        key: 'id'
      }
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    postal_code: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    session_token: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    gender: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    profile_picture_url: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    active: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: '0'
    },
    last_known_lat: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    last_known_long: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    date_of_joining: {
      type: DataTypes.DATE,
      allowNull: true
    },
    firebase_token: {
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
    tableName: 'Freelancer'
  });
};
