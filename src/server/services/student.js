import moment from 'moment';
import { Sequelize } from 'sequelize';
import logger from '../utils/logger';

class StudentService {

  static async getFreeSession(user) {
    // Calculate the next Thursday and Friday at 10 AM
    const currentDate = moment();
    let nextThursday = currentDate.clone().isoWeekday(4).startOf('day');
    let nextFriday = currentDate.clone().isoWeekday(5).startOf('day');

    // Generate the list of free sessions
    const sessions = [];
    for (let i = 0; sessions.length <= 5; i++) {
      // Increment the date to the next week
      nextThursday = nextThursday.add(1, 'week');
      nextFriday = nextFriday.add(1, 'week');

      //check if already booked for thursday
      const isTBooked = await global.db.session.findOne({
        attributes: ['id', 'bookedAt'],
        where: {
          universityId: user.universityId,
          deanId: user.dean.id,
          bookedAt: Sequelize.where(Sequelize.fn('date', Sequelize.col('bookedAt')), '=', nextThursday.format('YYYY-MM-DD'))
        }
      });
      if (!isTBooked) {
        sessions.push({
          date: nextThursday.format('dddd, ll'),
          time: '10:00 AM'
        });
      }

      //check if already booked for firday
      const isFBooked = await global.db.session.findOne({
        attributes: ['id', 'bookedAt'],
        where: {
          universityId: user.universityId,
          deanId: user.dean.id,
          bookedAt: Sequelize.where(Sequelize.fn('date', Sequelize.col('bookedAt')), '=', nextFriday.format('YYYY-MM-DD'))
        }
      });
      if (!isFBooked) {
        sessions.push({
          date: nextFriday.format('dddd, ll'),
          time: '10:00 AM'
        });
      }
    }

    return sessions;
  }

  static async getSessions(user) {
    try {
      console.log(user)
      // check if dean is exist in session
      if (!user.dean) {
        return {
          return: false,
          message: 'No dean available for your university'
        }
      }

      // track booked sessions
      const bookedSessions = await global.db.session.findAll({
        attributes: ['id', 'name', 'status', 'bookedAt'],
        include: [{ model: global.db.user, attributes: ['id', 'name'], as: 'dean', required: true }],
        where: { userId: user.id, universityId: user.universityId },
        raw: true,
      });

      const availableSessions = await this.getFreeSession(user);

      return {
        status: true,
        bookedSessions: bookedSessions.map(b => { return { ...b, bookedAt: moment(b.bookedAt).format('ddd, lll') } }),
        availableSessions
      };
    } catch (e) {
      logger.error(`[StudentService.getSessions] ${e}`);
      throw e;
    }
  }

  static async bookSession(user, data) {
    try {
      // check if the given is feature date
      if (!moment(data.bookedAt, 'YYYY-MM-DD hh:mm:ss').isAfter(moment())){
        return {
          status: false,
          message: 'past date provided'
        }
      }
      
      // check if the given date is thursday and friday 
      if (!(moment(data.bookedAt, 'YYYY-MM-DD hh:mm:ss').weekday(4) || moment(data.bookedAt, 'YYYY-MM-DD hh:mm:ss').weekday(5))) {
        return {
          status: false,
          message: 'invalid slot'
        }
      }

      //check if already booked for firday
      const isBooked = await global.db.session.findOne({
        attributes: ['id', 'bookedAt'],
        where: {
          universityId: user.universityId,
          deanId: user.dean.id,
          bookedAt: Sequelize.where(Sequelize.fn('date', Sequelize.col('bookedAt')), '=', moment(data.bookedAt, 'YYYY-MM-DD hh:mm:ss').format('YYYY-MM-DD'))
        }
      });
      if (isBooked) {
        return {
          status: false,
          message: 'already booked'
        }
      }

      // book session      
      const bookedSession = await global.db.session.create({ ...data, universityId: user.universityId, userId: user.id, deanId: user.dean.id });

      return {
        status: true,
        id: bookedSession.id
      };
    } catch (e) {
      logger.error(`[StudentService.bookSession] ${e}`);
      throw e;
    }
  }
}

export default StudentService;