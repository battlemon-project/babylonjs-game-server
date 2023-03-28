import { ColyseusTestServer, boot } from '@colyseus/testing';

import appConfig from '../../arena.config';
import { HubSchema, Quest } from './hub.schema';

describe('testing your Colyseus app', () => {
  let colyseus: ColyseusTestServer;

  beforeAll(async () => (colyseus = await boot(appConfig)));
  afterAll(async () => colyseus.shutdown());
  beforeEach(async () => await colyseus.cleanup());

  it('private data', async () => {
    const room = await colyseus.createRoom<HubSchema>('hub', {});
    const client1 = await colyseus.connectTo(room);
    const client2 = await colyseus.connectTo(room);

    client1.send('createPlayer', { playerId: 'guest_1' });
    await room.waitForNextMessage();

    client2.send('createPlayer', { playerId: 'guest_2' });
    await room.waitForNextMessage();

    room.state.players.forEach((player, idx) => {
      const questMock = new Quest();
      questMock.activationTimestamp = idx;
      player.personal.quest = questMock;
    });

    await room.waitForNextPatch();

    expect(client2.state.players[0].personal).toBeUndefined();
    const client2Personal = client2.state.players[1].personal;
    expect(client2Personal).not.toBeUndefined();
    expect(client2Personal.quest).not.toBeUndefined();
    expect(client2Personal.quest.activationTimestamp).toBe(1);
  });
});
