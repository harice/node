'use strict';

export default (sequelize, DataTypes) => {

  var UserIdpProfiles = sequelize.define('UserIdpProfiles', {
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
        UserIdpProfiles.hasOne(models.User, { foreignKey: 'userIdpProfileId' });
      }
    }
  });

  return UserIdpProfiles;

};
