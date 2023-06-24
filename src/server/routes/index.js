import fs from 'fs';
import path from 'path';

// guaranteed to get dependencies
export default async (express) => {
  const router = express.Router();

  // get all routes
  let routes = fs.readdirSync(path.join('src', 'server', 'routes')).filter((file) => {
    return (file.indexOf('.') !== 0) && (file !== 'public.js') && (file !== 'index.js') && (file.slice(-3) === '.js');
  });

  // loading routes
  for (let i in routes) {
    let file = routes[i];
    //let obj = await import(path.resolve('src', 'server', 'routes', file));
    let obj = await import('./' + file);
    obj.default(router, express);
  }

  return router;
};