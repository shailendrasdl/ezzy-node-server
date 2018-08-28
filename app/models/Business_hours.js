/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Business_hours', {
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
    day: {
      type: DataTypes.INTEGER(50),
      allowNull: true
    },
    closed: {
      type: DataTypes.INTEGER(10),
      allowNull: true
    },
    open_time: {
      type: DataTypes.TIME,
      allowNull: true
    },
    close_time: {
      type: DataTypes.TIME,
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
    tableName: 'Business_hours'
  });
};
