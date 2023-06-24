import { Sequelize } from 'sequelize';
import moment from 'moment';
import config from '../config';
import logger from '../utils/logger';

class DeanService {
  static async getPendingSessions(user, data) {
    try {
      const limit = data.limit || config.pagination.limit;
      const offset = (!data.page || data.page === '1') ? 0 : Math.floor((data.page - 1) * limit);

      const where = {
        deanId: user.id,
        status: 'pending',
        bookedAt: {
          [Sequelize.Op.gte]: moment().toDate()
        }
      };
      const totalSessions = await global.db.session.count({ where });
      const sessions = await global.db.session.findAll({
        attributes: ['id', 'name', 'status', 'bookedAt'],
        include: [{ model: global.db.user, attributes: ['id', 'name'], as: 'student', required: true }],
        where,
        offset,
        limit,
        raw: true
      });

      return {
        sessions: sessions.map(b => { return { ...b, bookedAt: moment(b.bookedAt).format('ddd, lll') } }),
        page: data.page,
        totalRecords: totalSessions,
        totalPages: Math.ceil(totalSessions / limit)
      };
    } catch (e) {
      logger.error(`[DeanService.getPendingSessions] ${e}`);
      throw e;
    }
  }
}

export default DeanService;