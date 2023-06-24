import studentController from '../controllers/student';

export default (router, express) => {
  const route = express.Router();

  router.use('/students', route);

  route.get('/sessions', studentController.getSessions);
  route.post('/sessions', studentController.bookSession);
};