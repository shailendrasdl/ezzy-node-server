/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Users', {
    user_id: {
      type: DataTypes.INTEGER(50).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    first_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: ''
    },
    last_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    mobile_number: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    otp: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    mobile_verified: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    email_address: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    email_verified: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    email_verification_link: {
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
    address_lat: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    address_long: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    facebook_token: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    google_token: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    twitter_token: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    session_token: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    firebase_token: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    anniversary_date: {
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
    referral_code: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    status: {
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
    tableName: 'Users'
  });
};
