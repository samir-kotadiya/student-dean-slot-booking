import deanService from '../services/dean';
import utils from '../utils/utils';

export default class DeanController {
  

  static async getPendingSessions(request, response) {
    try {
      // call dean service to get sessions
      console.log(request.user)
      const result = await deanService.getPendingSessions(request.user, request.query);
      return utils.sendSuccessResponse(response, result);
    } catch (err) {
      return utils.sendInternalError(response, err);
    }
  }
}