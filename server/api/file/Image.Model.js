'use strict';

export default (sequelize, DataTypes) => {

  var Image = sequelize.define(
    // Model Name
    'Image',

    // Define Schema
    {
      url: DataTypes.STRING,
      dimensionHeight: DataTypes.STRING,
      dimensionWidth: DataTypes.STRING,
      filesize: DataTypes.STRING,
      filetype: DataTypes.STRING,
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

  return Image;

};

// Validation Functions
// -

// Instance Methods

function sanitizeForResponse() {
  var data = this.get();

  return data;
}

// Hook Handlers
// -

// Private Methods
// -
