/* eslint-disable no-restricted-syntax */

export default class Util {
  static sendSuccessResponse(response, data) {
    let json = {};
    if (data.status !== undefined && data.status !== true && data.message !== undefined) {
      json = {
        statusCode: 400,
        type: 'success',
        action: 'Failed',
        message: data.message || 'Failed'
      };
    } else {
      json = {
        statusCode: 200,
        type: 'success',
        message: 'OK',
        data
      };
    }

    response.status(json.statusCode).send(json);
  }

  static sendValidationError(response, error) {
    response.status(400).send({
      statusCode: 400,
      type: 'error',
      message: error || 'Incomplete Data'
    });
  }

  static sendInternalError(response, error) {
    response.status(500).send({
      statusCode: 500,
      type: 'error',
      message: error.message || 'Internal Server Error'
    });
  }

  static sendUnauthenticationResponse(response, message) {
    response.status(401).send({
      statusCode: 401,
      type: 'error',
      message: message || 'Authentication Required'
    });
  }

  static generateOTP() {
    // Declare a digits variable  
    // which stores all digits 
    let digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 4; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
  }
  
  static slugify(text) {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/[^\w\-]+/g, '') // Remove all non-word chars
      .replace(/\-\-+/g, '-') // Replace multiple - with single -
      .replace(/^-+/, '') // Trim - from start of text
      .replace(/-+$/, ''); // Trim - from end of text
  }

  static isValidUUID(uuid) {
    const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
    return regexExp.test(uuid);
  }
}