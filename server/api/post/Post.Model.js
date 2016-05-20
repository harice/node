'use strict';

import AppConfig from '../../config';

export default (sequelize, DataTypes) => {

  var Post = sequelize.define(
    // Model Name
    'Post',

    // Define Schema
    {
      UserId: DataTypes.INTEGER,
      title: DataTypes.STRING,
      description: DataTypes.STRING,
      imageUrl: DataTypes.STRING,
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

  return Post;

};

// Validation Functions
// -

// Instance Methods

function sanitizeForResponse() {
  var data = this.get();

  data.imageUrl = AppConfig.get('/media/cloudfront') + data.imageUrl;

  delete data.updatedAt;
  delete data.deletedAt;

  return data;
}

// Hook Handlers
// -

// Private Methods
// -
