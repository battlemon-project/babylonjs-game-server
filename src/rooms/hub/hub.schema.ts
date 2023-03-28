import { Schema, ArraySchema, type, filter } from '@colyseus/schema';
import { Client } from 'colyseus';

export class Item extends Schema {
  @type('string') type: string;
  @type('string') flavour: string;
}

export class Property extends Schema {
  @type('string') type: string;
  @type('string') flavour: string;
}

export class Quest extends Schema {
  @type('number') activationTimestamp: number;
}

export class Personal extends Schema {
  @type(Quest) quest: Quest = null;
}

export class Player extends Schema {
  @type('string') id: string;
  @type('string') clientSessionId: string;
  @type([Item]) items: Array<Item>;
  @type([Property]) properties: Array<Property>;
  @filter(function (this: Player, client: Client) {
    return this.clientSessionId == client.sessionId;
  })
  @type(Personal)
  personal: Personal = new Personal();
}

export class HubSchema extends Schema {
  @type([Player]) players = new ArraySchema<Player>();
}
