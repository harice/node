'use strict';

export default (sequelize, DataTypes) => {

  var Resource = sequelize.define(
    // Model Name
    'Resource',
    // Define Schema
    {
      name: {
        type: DataTypes.STRING,
        unique: true
      },
      prettyName: {
        type: DataTypes.STRING,
        unique: true
      }
    },

    // Model Extensions
    {
      instanceMethods: {
        sanitizeForResponse: sanitizeForResponse
      }
    }
  );

  return Resource;

};


function sanitizeForResponse() {
  var data = this.get();

  delete data.updatedAt;
  delete data.deletedAt;

  return data;
}
