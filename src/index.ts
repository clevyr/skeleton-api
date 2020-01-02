import server from './server';
import logger from './utils/logger';

(async () => {
  try {
    await server.start();

  } catch (error) {
    logger.error(error);
  }
})();
