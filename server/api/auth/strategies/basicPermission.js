/**
 * This is a SAMPLE strategy that checks if a User is allowed to access an API.
 * Here, it is expected that the path is the Resource name and the method is the
 * mapped HTTP verb to an Action.
 * Currently, the mapping of HTTP verbs to Actions is not yet implemented.
 */

'use strict';

export default (decoded, request, callback) => {
  const { permission } = request.server.plugins.common;
  const { User } = request.models;
  const path = request.route.path;
  const method = request.route.method;

  let u;

  if (decoded.id) {
    User.findById(decoded.id)
    .then(user => {
      u = user;

      if (user) {
        return permission.isUserAllowed(request.models, decoded.id, path, method);
      } else {
        return [false];
      }
    })
    .then(result => {
      if (result && result.isAllowed) return [true, u];
      else return [false];
    })
    .asCallback(callback, {spread: true});
  } else {
    return callback(null, false);
  }
}
