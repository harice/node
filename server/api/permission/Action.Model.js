'use strict';

export default (sequelize, DataTypes) => {

  var Action = sequelize.define(
    // Model Name
    'Action',

    // Define Schema
    {
      name: DataTypes.STRING
    },
    // Model Extensions
    {
      instanceMethods: {
        sanitizeForResponse: sanitizeForResponse
      }
    }

  );

  return Action;

};

function sanitizeForResponse() {
  var data = this.get();

  delete data.createdAt;
  delete data.updatedAt;
  delete data.deletedAt;

  return data;
}
