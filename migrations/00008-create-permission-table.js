'use strict';

module.exports = {
  up: function (queryInterface, DataTypes) {

    return queryInterface.createTable('Permissions', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      RoleId: DataTypes.INTEGER,
      ResourceId: DataTypes.INTEGER,
      ActionId: DataTypes.INTEGER,
      createdAt: {
        type: DataTypes.DATE
      },
      updatedAt: {
        type: DataTypes.DATE
      },
      deletedAt: {
        type: DataTypes.DATE
      }
    })
  },

  down: function (queryInterface) {

    return queryInterface.dropTable('Permissions');
  }
};
