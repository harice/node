'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('Users', 'userIdpProfileId', {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: {
        model: 'UserIdpProfiles',
        key: 'id'
      },
      onUpdate: 'cascade',
      onDelete: 'restrict'
    });
  },

  down: function (queryInterface) {
    return queryInterface.removeColumn('Users', 'userIdpProfileId');
  }
};
