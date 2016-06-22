'use strict';

module.exports = {
  up: function (queryInterface, DataTypes) {
    return queryInterface.addColumn('Users','birthdate',DataTypes.DATE)
    .then(() => {
      return queryInterface.addColumn('Users','aboutMe',DataTypes.STRING)
    })
    .then(() => {
      return queryInterface.addColumn('Users','facebookId',DataTypes.STRING)
    })
    .then(() => {
      return queryInterface.addColumn('Users','googleId',DataTypes.STRING)
    })
  },

  down: function (queryInterface) {
    return queryInterface.removeColumn('Users','birthdate')
    .then(() => {
      return queryInterface.removeColumn('Users','aboutMe')
    })
    .then(() => {
      return queryInterface.removeColumn('Users','facebookId')
    })
    .then(() => {
      return queryInterface.removeColumn('Users','googleId')
    })
  }
};
