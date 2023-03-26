import assert from 'assert';
import { ColyseusTestServer, boot } from '@colyseus/testing';

import appConfig from '../../arena.config';
import { HubSchema } from './hub.schema';

describe('testing your Colyseus app', () => {
  let colyseus: ColyseusTestServer;

  beforeAll(async () => (colyseus = await boot(appConfig)));
  afterAll(async () => colyseus.shutdown());
  beforeEach(async () => await colyseus.cleanup());

  it('connecting into a room', async () => {
    const room = await colyseus.createRoom<HubSchema>('hub', {});
    const client1 = await colyseus.connectTo(room);

    assert.strictEqual(client1.sessionId, room.clients[0].sessionId);

    await room.waitForNextPatch();
    assert.deepStrictEqual({ players: [] }, client1.state.toJSON());
  });
});
