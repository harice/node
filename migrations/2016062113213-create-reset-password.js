'use strict';

module.exports = {
  up: function (queryInterface, DataTypes) {
    return queryInterface.createTable('ResetPasswordRequests', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      createdAt: {
        type: DataTypes.DATE
      },
      updatedAt: {
        type: DataTypes.DATE
      },
      deletedAt: {
        type: DataTypes.DATE
      },
      userId: DataTypes.INTEGER,
      token: DataTypes.TEXT,
      expiredAt: DataTypes.DATE
    })
  },

  down: function (queryInterface) {
    return queryInterface.dropTable('ResetPasswordRequests');
  }
};
