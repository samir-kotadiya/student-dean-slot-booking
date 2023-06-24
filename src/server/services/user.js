import jwt from 'jsonwebtoken';
import config from '../config';
import logger from '../utils/logger';
import encryption from '../utils/encryption';
import utils from '../utils/utils';

class UserService {

  /**
   * create/register new user
   * @param {*} data // contain request data email, password etc
   */
  static async register(data) {
    try {
      // check duplicate exist or not by email
      const exist = await global.db.user.findOne({
        attributes: ['id'],
        where: {
          email: data.email
        },
        raw: true
      });

      if (exist) {
        logger.info(`[UserService.register] user with given email is already register ${JSON.stringify(data)}`);
        return {
          status: false,
          message: 'email is already register'
        };
      }

      if (data.password != data.confirmPassword) {
        logger.info(`[UserService.register] password not match ${JSON.stringify(data)}`);
        return {
          status: false,
          message: 'password not match'
        };
      }
      const user = Object.assign({}, data); // create new use object from request data

      // allow only one dean per university
      if (data.role === 'dean') {
        const dean = await global.db.user.findOne({
          attributes: ['name', 'id'],
          where: { role: 'dean', universityId: data.universityId },
          raw: true
        });
        if (dean) {
          return {
            status: false,
            message: 'only one dean is allowed per university'
          };
        }
      }

      // generate password
      const encryptedPassword = encryption.getEncryptedPasswordWithSalt(data.password);
      user.password = encryptedPassword.password;
      user.salt = encryptedPassword.salt;

      const createdUser = await global.db.user.create(user);

      const verifyObj = {
        userId: createdUser.dataValues.id,
        requestId: user.salt,
        otp: utils.generateOTP()
      };
      logger.info(`[UserService.register] register success ${JSON.stringify(data)}`);

      return {
        status: true,
        requestId: verifyObj.requestId,
        otp: user.otp
      };
    } catch (e) {
      logger.error(`[UserService.register] ${e}`);
      throw e;
    }
  }


  static async login(data) {
    try {
      // check user exist or not by university id
      const user = await global.db.user.findOne({
        where: {
          universityId: data.universityId,
          role: data.role
        },
        raw: true
      });

      if (!user) {
        logger.info(`[UserService.login] ${JSON.stringify(data)}`);
        return {
          status: false,
          message: 'user not exits'
        };
      }

      if (!encryption.verifyPassword(data.password, user.password, user.salt)) {
        logger.info(`[UserService.login] invalid password ${JSON.stringify(data)}`);
        return {
          status: false,
          message: 'invalid password'
        };
      }

      const payload = {
        id: user.id
      };

      const token = jwt.sign(payload, config.jwtSecret);

      return {
        status: true,
        token
      };
    } catch (e) {
      logger.error(`[UserService.login] ${e}`);
      throw e;
    }
  }
}

export default UserService;