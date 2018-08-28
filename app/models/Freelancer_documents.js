/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Freelancer_documents', {
    id: {
      type: DataTypes.INTEGER(50).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    freelancer_id: {
      type: DataTypes.INTEGER(50),
      allowNull: true
    },
    document_type: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    document_url: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    document_verified: {
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
    tableName: 'Freelancer_documents'
  });
};
