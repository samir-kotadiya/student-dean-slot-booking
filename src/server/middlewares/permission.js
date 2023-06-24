// middleware for doing role-based permissions
export default (roles = []) => {
  // roles param can be a single role string (e.g. Role.User or 'User') 
  // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return [
    // authorize based on user role
    (request, response, next) => {
      if (roles.length && !roles.includes(request.user.role)) {
        // user's role is not authorized
        return response.status(403).send({
          statusCode: 403,
          type: 'error',
          message: 'Forbidden'
        }); // user is forbidden
      }

      // authentication and authorization successful
      next();
    }
  ];
};