import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import config from '../config';

export default class Encryption {
  static generateToken(payload) {
    return jwt.sign(payload, config.jwtSecret);
  }

  static verifyPassword(password, encryptedPassword, salt) {
    console.log(password, encryptedPassword, salt)
    return encryptedPassword === bcrypt.hashSync(password, salt).substring(29);
  }

  // Get password hash with salt
  static getEncryptedPasswordWithSalt(password) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return {
      password: hash.substring(29),
      salt
    };
  }
}
