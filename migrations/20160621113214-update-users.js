'use strict';

module.exports = {
  up: function (queryInterface, DataTypes) {
    return queryInterface.addColumn('Users','phoneNumber',DataTypes.STRING)
    .then(() => {
      return queryInterface.addColumn('Users','gender',DataTypes.STRING)
    })
    .then(() => {
      return queryInterface.addColumn('Users','company',DataTypes.STRING)
    })
    .then(() => {
      return queryInterface.addColumn('Users','address1',DataTypes.STRING)
    })
    .then(() => {
      return queryInterface.addColumn('Users','address2',DataTypes.STRING)
    })
    .then(() => {
      return queryInterface.addColumn('Users','city',DataTypes.STRING)
    })
    .then(() => {
      return queryInterface.addColumn('Users','state',DataTypes.STRING)
    })
    .then(() => {
      return queryInterface.addColumn('Users','country',DataTypes.STRING)
    })
    .then(() => {
      return queryInterface.addColumn('Users','zipcode',DataTypes.STRING)
    })
  },

  down: function (queryInterface) {
    return queryInterface.removeColumn('Users','phoneNumber')
    .then(() => {
      return queryInterface.removeColumn('Users','gender')
    })
    .then(() => {
      return queryInterface.removeColumn('Users','company')
    })
    .then(() => {
      return queryInterface.removeColumn('Users','address1')
    })
    .then(() => {
      return queryInterface.removeColumn('Users','address2')
    })
    .then(() => {
      return queryInterface.removeColumn('Users','city')
    })
    .then(() => {
      return queryInterface.removeColumn('Users','state')
    })
    .then(() => {
      return queryInterface.removeColumn('Users','country')
    })
    .then(() => {
      return queryInterface.removeColumn('Users','zipcode')
    })
  }
};
