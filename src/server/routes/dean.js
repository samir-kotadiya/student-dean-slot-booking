import deanController from '../controllers/dean';

export default (router, express) => {
  const route = express.Router();

  router.use('/deans', route);
  
  route.get('/sessions/pending', deanController.getPendingSessions);
};