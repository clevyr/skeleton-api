import server from './server';

(async () => {
  try {
    await server.start();

  } catch (error) {
    console.error(error);
  }
})();
