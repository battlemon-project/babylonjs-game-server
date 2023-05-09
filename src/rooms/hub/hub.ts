import { Room, Client } from 'colyseus';
import { Item, HubSchema, Player, Property } from './hub.schema';
import axios from 'axios';
import { IncomingMessage } from 'http';

//TODO: needs modification
export class Hub extends Room<HubSchema> {
  onCreate(options: any) {
    this.setState(new HubSchema());

    this.onMessage('createPlayer', (client, message) => {
      //TODO: change guest initialization condition
      if (message.playerId.includes('guest_')) {
        const data: any = {
          id: message.playerId,
          items: [],
          properties: [
            { type: 'exo_top', flavour: 'ExoTop_Snowwhite' },
            { type: 'exo_bot', flavour: 'ExoBot_Snowwhite' },
            { type: 'feet', flavour: 'Feet_Snowwhite' },
            { type: 'eyes', flavour: 'Eyes_Blue' },
            { type: 'hands', flavour: 'Hands_Snowwhite' },
            { type: 'head', flavour: 'Head_Fresh_Lemon' },
            { type: 'teeth', flavour: 'Teeth_Hollywood' },
          ],
        };

        this.pushData(data, client.sessionId);
      } else {
        //TODO: playerId is not trusted
        axios
          .get('https://promo.battlemon.com/api/lemon/' + message.playerId)
          .then((result) => {
            this.pushData(result.data, client.sessionId);
          })
          .catch((error) => {
            if (error.response) {
              client.send('errorIdPlayer', error.response.status);
            }
          });
      }
    });

    this.onMessage('syncPlayer', (client, message) => {
      this.broadcast('syncPlayer', message, { except: client });
    });
  }

  onAuth(client: Client, options: any) {
    //TODO: verify token
    return true; //TEMP skip verification
  }

  onJoin(client: Client, options: any) {
    //TODO: add player to scheme
    console.log(client.sessionId, 'joined!');
  }

  onLeave(client: Client, consented: boolean) {
    const playerIndex = this.state.players.findIndex(
      (player) => player.clientSessionId === client.sessionId
    );
    if (playerIndex != -1) {
      this.state.players.splice(playerIndex, 1);
    }

    console.log(client.sessionId, 'left!');
  }

  onDispose() {
    console.log('room', this.roomId, 'disposing...');
  }

  pushData(data: any, sessionId: string) {
    let player: Player = new Player();
    player.id = data.id;
    player.clientSessionId = sessionId;
    player.items = [];
    player.properties = [];

    data.items.forEach((item: any) => {
      let newItem = new Item();
      newItem.type = item.type;
      newItem.flavour = item.flavour;
      player.items.push(newItem);
    });

    data.properties.forEach((property: any) => {
      let newProperty = new Property();
      newProperty.type = property.type;
      newProperty.flavour = property.flavour;
      player.properties.push(newProperty);
    });

    this.state.players.push(player);
  }
}
