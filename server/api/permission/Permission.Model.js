'use strict';

export default (sequelize, DataTypes) => {

  var Permission = sequelize.define(
    // Model Name
    'Permission',

    // Define Schema
    {
      RoleId: {
        type: DataTypes.INTEGER
      },
      ResourceId: {
        type: DataTypes.INTEGER
      },
      ActionId: {
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

  return Permission;

};


function sanitizeForResponse() {
  var data = this.get();

  if (data.Role) data.Role.sanitizeForResponse();
  if (data.Resource) data.Resource.sanitizeForResponse();
  if (data.Action) data.Action.sanitizeForResponse();

  delete data.updatedAt;
  delete data.deletedAt;

  return data;
}
