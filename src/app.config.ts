import config from '@colyseus/tools';
import { monitor } from '@colyseus/monitor';
import { Hub } from './rooms/hub';

export default config({
  getId: () => 'Your Colyseus App',
  initializeGameServer: (gameServer) => {
    gameServer.define('hub', Hub);
  },
  initializeExpress: (app) => {
    app.use('/monitor', monitor());
  },
  beforeListen: () => {},
});
