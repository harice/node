'use strict';

export default (sequelize, DataTypes) => {

  var ResetPassword = sequelize.define(
    // Model Name
    'ResetPasswordRequest',

    // Define Schema
    {
      userId: DataTypes.INTEGER,
      token: DataTypes.STRING,
      expiredAt: DataTypes.DATE
    }
  );

  return ResetPassword;

};
