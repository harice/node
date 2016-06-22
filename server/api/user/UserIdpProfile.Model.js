'use strict';

export default (sequelize, DataTypes) => {

  var UserIdpProfile = sequelize.define('UserIdpProfile', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    profileId: {
      type: DataTypes.STRING
    },
    provider: {
      type: DataTypes.STRING
    }
  }, {
    classMethods: {
      associate: function(models) {
        UserIdpProfile.hasOne(models.User, { foreignKey: 'userIdpProfileId' });
      }
    }
  });

  return UserIdpProfile;

};
