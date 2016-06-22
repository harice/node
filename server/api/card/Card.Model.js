'use strict';

export default (sequelize, DataTypes) => {

  var Card = sequelize.define(
    // Model Name
    'Card',

    // Define Schema
    {
      userId: DataTypes.STRING,
      creditCardNumber: DataTypes.STRING,
      creditCardExpiration: DataTypes.STRING,
      creditCardCvv: DataTypes.STRING,
      creditCardType: DataTypes.STRING,
      creditCardName: DataTypes.STRING
    }
  );

  return Card;

};
