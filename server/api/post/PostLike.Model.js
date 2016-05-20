'use strict';

export default (sequelize, DataTypes) => {

  var PostLike = sequelize.define(
    // Model Name
    'PostLike',

    // Define Schema
    {
      UserId: DataTypes.INTEGER,
      PostId: DataTypes.INTEGER
    },

    // Model Extensions
    {
      instanceMethods: {
        sanitizeForResponse: sanitizeForResponse
      }
    }
  );

  // Hooks
  // -

  return PostLike;

};

// Validation Functions
// -

// Instance Methods

function sanitizeForResponse() {
  var data = this.get();

  delete data.id;
  delete data.PostId;
  delete data.updatedAt;
  delete data.deletedAt;

  return data;
}

// Hook Handlers
// -

// Private Methods
// -
