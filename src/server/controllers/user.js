import userService from '../services/user';
import { UserSchema, LoginSchema } from '../validations/user';
import utils from '../utils/utils';

export default class StudentController {

  static async register(request, response) {
    try {
      const validation = UserSchema.validate(request.body);

      if (validation.error) {
        const e = validation.error.details.map((obj) => {
          return obj.message;
        });
        return utils.sendValidationError(response, e);
      }

      // call add user service to add user
      const result = await userService.register(request.body);
      return utils.sendSuccessResponse(response, result);
    } catch (err) {
      console.log(err)
      return utils.sendInternalError(response, err);
    }
  }

  static async login(request, response) {
    try {
      const validation = LoginSchema.validate(request.body);
      if (validation.error) {
        const e = validation.error.details.map((obj) => {
          return obj.message;
        });
        return utils.sendValidationError(response, e);
      }

      // call user service to get token
      const result = await userService.login(request.body);
      return utils.sendSuccessResponse(response, result);
    } catch (err) {
      return utils.sendInternalError(response, err);
    }
  }
}