import { Room, Client } from "colyseus"
import { Item, MyRoomState, Player, Property } from './schema/MyRoomState'
import { ArraySchema } from "@colyseus/schema";
import axios from 'axios'

export class MyRoom extends Room<MyRoomState> {
  onCreate (options: any) {
    this.setState(new MyRoomState());
    
    this.onMessage('createPlayer', (client, message) => {
      axios.get('https://promo.battlemon.com/api/lemon/' + message.playerId)
        .then(result => {
          const data = result.data
          
          let player: Player = new Player()
          player.id = data.id
          player.clientSessionId = client.sessionId
          player.items = []
          player.properties = []
  
          data.items.forEach((item: any) => {
            let newItem = new Item()
            newItem.type = item.type
            newItem.flavour = item.flavour
            player.items.push(newItem)
          })
  
          data.properties.forEach((property: any) => {
            let newProperty = new Property()
            newProperty.type = property.type
            newProperty.flavour = property.flavour
            player.properties.push(newProperty)
          })
          
          this.state.players.push(player)
        })
    })
  
    this.onMessage("syncPlayer", (client, message) => {
      this.broadcast('syncPlayer', message, { except: client })
    });
  }

  onJoin (client: Client, options: any) {
    console.log(client.sessionId, "joined!")
  }

  onLeave (client: Client, consented: boolean) {
    const playerIndex = this.state.players.findIndex(player => player.clientSessionId === client.sessionId)
    this.state.players.splice(playerIndex, 1)
    
    console.log(client.sessionId, "left!");
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }
}
