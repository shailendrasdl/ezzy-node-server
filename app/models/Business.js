/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Business', {
    id: {
      type: DataTypes.INTEGER(50).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    business_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ''
    },
    contact_number: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    email_address: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    alternate_contact_number: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    owner_id: {
      type: DataTypes.INTEGER(50).UNSIGNED,
      allowNull: true
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    city_id: {
      type: DataTypes.INTEGER(50).UNSIGNED,
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
    postal_code: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    profile_picture_url: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    business_type: {
      type: DataTypes.INTEGER(50).UNSIGNED,
      allowNull: true,
      references: {
        model: 'Business_type',
        key: 'id'
      }
    },
    website: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    avg_rating: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    avg_wait_time: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    avg_price: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    referred_by: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    is_active: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: '1'
    },
    created_by: {
      type: DataTypes.INTEGER(50),
      allowNull: true
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'Business'
  });
};
