import Promise from 'bluebird';
import Boom from 'boom';
import _ from 'lodash';

export function addUserRole(models, userId, roleId) {
  return new Promise(function(resolve, reject) {
    const { User } = models;
    const { Role } = models;
    const { UserRole } = models;

    UserRole.belongsTo(User, { as: 'User' });
    UserRole.belongsTo(Role, { as: 'Role' });

    User.findOne({
      where: {
        id: userId
      }
    })
    .then(user => {
      if (!user) throw Boom.notFound('No user found.');

      return Role.findOne({
        where: {
          id: roleId
        }
      });
    })
    .then(role => {
      if (!role) throw Boom.notFound('No role found.');

      return UserRole.findOne({
        where: {
          UserId: userId,
          RoleId: roleId
        }
      });
    })
    .then(userRole => {
      if (userRole) throw Boom.conflict('User has role already.');

      const ur = UserRole.build({
        UserId: userId,
        RoleId: roleId
      },
      {
        include: [
          {
            model: User,
            as: 'User',
            required: false
          },
          {
            model: Role,
            as: 'Role',
            required: false
          }
        ]
      });

      return ur.save();
    })
    .then(savedUserRole => {
      return savedUserRole.reload();
    })
    .then(userRole => {
      resolve(userRole.sanitizeForResponse());
    })
    .catch(function(err) {
      reject(err);
    });
  });
}

export function removeUserRole(models, userId, roleId) {
  return new Promise(function(resolve, reject) {
    const { UserRole } = models;

    UserRole.findOne({
      where: {
        UserId: userId,
        RoleId: roleId
      }
    })
    .then(userRole => {
      if (!userRole) throw Boom.notFound('No user role found.');

      return userRole.destroy();
    })
    .then(resultUserRole => {
      resolve({ removedAt: resultUserRole.deletedAt });
    })
    .catch(function(err) {
      reject(err);
    });
  });
}

export function hasUserRole(models, userId, roleId) {
  return new Promise(function(resolve, reject) {
    const { UserRole } = models;

    UserRole.findOne({
      where: {
        UserId: userId,
        RoleId: roleId
      }
    })
    .then(userRole => {
      resolve({ hasRole: !!userRole });
    })
    .catch(function(err) {
      reject(err);
    });
  });
}

export function getUserRoles(models, userId) {
  return new Promise(function(resolve, reject) {
    const { User } = models;
    const { Role } = models;
    const { UserRole } = models;

    User.belongsToMany(Role, { through: UserRole, as: 'Roles' });

    User.findOne({
      where: {
        id: userId
      },
      include: [
        {
          model: Role,
          as: 'Roles',
          required: false,
          attributes: { exclude: ['updatedAt', 'deletedAt'] },
          through: {
            attributes: []
          }
        }
      ]
    })
    .then(user => {
      if (!user) throw Boom.notFound('No user found.');

      if (!user.Roles) throw Boom.notFound('No role found.');

      resolve(user.sanitizeForResponse());
    })
    .catch(function(err) {
      reject(err);
    });
  });
}

/**
 * Checks if a User is allowed an Action to a Resource.
 * @param {object} models
 * @param {number} userId
 * @param {number} resourceId
 * @param {number} actionId
 */
export function isUserAllowed(models, userId, resourceId, actionId) {
  return new Promise(function(resolve, reject) {
    const { Permission } = models;
    const { UserRole } = models;
    const { Role } = models;

    const sanitizeForResponse = function(n) {
      return n.sanitizeForResponse();
    };

    UserRole.belongsTo(Role, { as: 'Role' });

    Permission.findAll({
      where: {
        ResourceId: resourceId,
        ActionId: actionId
      },
      attributes: [ 'id', 'RoleId' ]
    })
    .then(permissions => {
      let i, roleIds = [];

      for (i = 0; i < permissions.length; i ++) roleIds.push(permissions[i].RoleId);

      if (roleIds.length < 1) resolve({ isAllowed: false });

      return UserRole.findAll({
        where: {
          UserId: userId,
          RoleId: {
            $in: roleIds
          }
        },
        include: [
         {
           model: Role,
           as: 'Role',
           required: true
         }
        ]
      });
    })
    .then(userRoleResult => {
      userRoleResult = _.map(userRoleResult, sanitizeForResponse);
      resolve({
        isAllowed: !!userRoleResult.length,
        UserRoles: userRoleResult
      });
    })
    .catch(function(err) {
      reject(err);
    });
  });
}
