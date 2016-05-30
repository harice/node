'use strict';

export default (sequelize, DataTypes) => {

  var Role = sequelize.define(
    // Model Name
    'Role',

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

  // Hooks
  // -

  return Role;

};

// Validation Functions
// -

// Instance Methods

function sanitizeForResponse() {
  var data = this.get();

  delete data.updatedAt;
  delete data.deletedAt;

  return data;
}

// Hook Handlers
// -

// Private Methods
// -
