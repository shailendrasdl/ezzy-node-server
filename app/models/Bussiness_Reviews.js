/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Bussiness_Reviews', {
    id: {
      type: DataTypes.INTEGER(50).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    business_id: {
      type: DataTypes.INTEGER(50).UNSIGNED,
      allowNull: true,
      references: {
        model: 'Business',
        key: 'id'
      }
    },
    user_id: {
      type: DataTypes.INTEGER(50).UNSIGNED,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'user_id'
      }
    },
    maintainance_rating: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    cleanliness_rating: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    service_rating: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    staff_rating: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    pricing_rating: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    avg_rating: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    review: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    visible: {
      type: DataTypes.INTEGER(11),
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
    tableName: 'Bussiness_Reviews'
  });
};
