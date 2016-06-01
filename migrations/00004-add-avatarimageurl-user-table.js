'use strict';

module.exports = {
  up: function (queryInterface, DataTypes) {
    return queryInterface.addColumn(
      'Users',
      'avatarImageUrl',
      {
        type: DataTypes.STRING,
        after: "password"
      }
    )
  },

  down: function (queryInterface) {
    return queryInterface.removeColumn('Users', 'avatarImageUrl')
  }
};
