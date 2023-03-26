import { Schema, ArraySchema, type } from '@colyseus/schema';

export class Item extends Schema {
  @type('string') type: string;
  @type('string') flavour: string;
}

export class Property extends Schema {
  @type('string') type: string;
  @type('string') flavour: string;
}

export class Player extends Schema {
  @type('string') id: string;
  @type('string') clientSessionId: string;
  @type([Item]) items: Array<Item>;
  @type([Property]) properties: Array<Property>;
}

export class HubSchema extends Schema {
  @type([Player]) players = new ArraySchema<Player>();
}
