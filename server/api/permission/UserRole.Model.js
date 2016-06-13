'use strict';

export default (sequelize, DataTypes) => {

  var UserRole = sequelize.define(
    // Model Name
    'UserRole',
    // Define Schema
    {
      UserId: {
        type: DataTypes.INTEGER
      },
      RoleId: {
        type: DataTypes.INTEGER
      }
    },

    // Model Extensions
    {
      instanceMethods: {
        sanitizeForResponse: sanitizeForResponse
      }
    }
  );

  return UserRole;

};


function sanitizeForResponse() {
  var data = this.get();

  if (data.User) data.User.sanitizeForResponse();
  if (data.Role) data.Role.sanitizeForResponse();

  delete data.updatedAt;
  delete data.deletedAt;

  return data;
}
