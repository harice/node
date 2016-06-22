'use strict';

module.exports = {
  up: function (queryInterface, DataTypes) {
    return queryInterface.createTable('Cards', {
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
      creditCardNumber: DataTypes.STRING,
      creditCardExpiration: DataTypes.STRING,
      creditCardCvv: DataTypes.STRING,
      creditCardType: DataTypes.STRING,
      creditCardName: DataTypes.STRING
    })
  },

  down: function (queryInterface) {
    return queryInterface.dropTable('Cards');
  }
};
