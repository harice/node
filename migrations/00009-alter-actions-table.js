'use strict';

module.exports = {
  up: function (queryInterface, DataTypes) {
    return queryInterface.changeColumn('Actions',
      'name',
      {
        type: DataTypes.STRING(32),
        unique: true
      }
    );
  },

  down: function (queryInterface) {
    return queryInterface.sequelize.query(
      'ALTER TABLE "Actions" DROP CONSTRAINT name_unique_idx;')
    .then(function() {
      return queryInterface.removeIndex('Actions', 'name_unique_idx');
    });
  }
};
