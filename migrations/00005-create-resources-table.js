'use strict';

module.exports = {
  up: function (queryInterface, DataTypes) {
    return queryInterface.createTable('Resources', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        unique: true
      },
      prettyName: {
        type: DataTypes.STRING,
        unique: true
      },
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
    return queryInterface.dropTable('Resources');
  }
};
