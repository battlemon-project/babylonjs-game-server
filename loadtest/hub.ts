import { Client, Room } from 'colyseus.js';
import { cli, Options } from '@colyseus/loadtest';

async function main(options: Options) {
  const client = new Client(options.endpoint);
  const room: Room = await client.joinOrCreate(options.roomName, {
    token: '123',
  });

  console.log('Joined successfully');

  room.onMessage('*', (type, message) => {
    console.log('onMessage:', type, message);
  });

  room.onStateChange((state) => {
    console.log(room.sessionId, 'new state:', state);
  });

  room.onError((code, message) => {
    console.log(room.sessionId, `Error ${code}: ${message}`);
  });

  room.onLeave((code) => {
    console.log(room.sessionId, 'left');
  });
}

cli(main);
