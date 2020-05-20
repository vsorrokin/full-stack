const { SchemaDirectiveVisitor } = require("apollo-server-express");
const { defaultFieldResolver } = require('graphql');

const passportJWT = require("passport-jwt");

const usersController = require('../controllers/users');

class AuthDirective extends SchemaDirectiveVisitor {
  visitObject(type) {
    this.ensureFieldsWrapped(type);
    type._requiredAuthRole = this.args.requires;
  }
  // Visitor methods for nested types like fields and arguments
  // also receive a details object that provides information about
  // the parent and grandparent types.
  visitFieldDefinition(field, details) {
    this.ensureFieldsWrapped(details.objectType);
    field._requiredAuthRole = this.args.requires;
  }

  async getUserId(headers) {
    let userInfoFromToken;

    try {
      userInfoFromToken = await new Promise(function(resolve, reject) {
        new passportJWT.Strategy({
            jwtFromRequest: () => (headers.Authorization || headers.authorization || '').replace('Bearer ', ''),
            secretOrKey: GSECRET.jwtSecret
          },
          function (jwtPayload, cb) {
            resolve(jwtPayload);
          }
        ).authenticate();
      });
    } catch (e) {

    }

    if (!userInfoFromToken || !userInfoFromToken.id) return;


    let user;

    try {
      user = await usersController.findOneById(userInfoFromToken.id);
    } catch (e) {

    }

    return user && user.id ? user.id : null;
  }

  ensureFieldsWrapped(objectType) {
    const self = this;

    // Mark the GraphQLObjectType object to avoid re-wrapping:
    if (objectType._authFieldsWrapped) return;
    objectType._authFieldsWrapped = true;

    const fields = objectType.getFields();

    Object.keys(fields).forEach(fieldName => {
      const field = fields[fieldName];

      const { resolve = defaultFieldResolver } = field;

      field.resolve = async function (...args) {
        // Get the required Role from the field first, falling back
        // to the objectType if no Role is required by the field:
        const requiredRole =
          field._requiredAuthRole ||
          objectType._requiredAuthRole;

        if (!requiredRole) {
          return resolve.apply(this, args);
        }

        const context = args[2];

        const userId = await self.getUserId(context.req.headers);

        if (!userId) {
          throw new Error("not authorized");
        }

        return resolve.apply(this, args);
      };
    });
  }
}

module.exports = {
  auth: AuthDirective
};
