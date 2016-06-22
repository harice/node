'use strict';

module.exports = {
  up: function (queryInterface, DataTypes) {
    return queryInterface.createTable('AppConfigurations', {
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
      appName: DataTypes.STRING,
      appOwnerName: DataTypes.STRING,
      appTermsConditionsUrl: DataTypes.STRING,
      appCompanyName: DataTypes.STRING,
      appBundleId: DataTypes.STRING,
      appForceUpdate: DataTypes.STRING,
      appPermission: DataTypes.STRING,
      appEmailAddress: DataTypes.STRING,
      apiVersion: DataTypes.STRING,
      apiSocketPort: DataTypes.STRING,
      apiUrl: DataTypes.STRING
    })
  },

  down: function (queryInterface) {
    return queryInterface.dropTable('AppConfigurations');
  }
};
