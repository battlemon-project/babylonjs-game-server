import Arena from '@colyseus/arena';
import { monitor } from '@colyseus/monitor';

import { Hub } from './rooms/hub/hub';

export default Arena({
  getId: () => 'Your Colyseus App',
  initializeGameServer: (gameServer) => {
    gameServer.define('hub', Hub);
  },
  initializeExpress: (app) => {
    app.get('/', (req, res) => {
      res.send("It's time to kick ass and chew bubblegum!");
    });

    app.use('/colyseus', monitor());
  },

  beforeListen: () => {},
});
