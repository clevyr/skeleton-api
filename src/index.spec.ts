import 'mocha';

import database from './database';
import server from './server';

before(async () => {
  await database.migrate.latest();
  await database.seed.run();
});

export default server.koa.listen();
