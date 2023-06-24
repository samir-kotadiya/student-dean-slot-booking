import userController from '../controllers/user';

export default (router, express) => {
  const route = express.Router();

  router.use('/users', route);

  route.post('/login', userController.login);
  route.post('/register', userController.register);
};