"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyRoom = void 0;
const colyseus_1 = require("colyseus");
const MyRoomState_1 = require("./schema/MyRoomState");
const axios_1 = __importDefault(require("axios"));
class MyRoom extends colyseus_1.Room {
    onCreate(options) {
        this.setState(new MyRoomState_1.MyRoomState());
        this.onMessage('createPlayer', (client, message) => {
            console.info('New player request: ' + message.playerId);
            if (message.playerId.includes('guest_')) {
                const data = {
                    id: message.playerId,
                    items: [],
                    properties: [
                        { type: 'exo_top', flavour: 'ExoTop_Snowwhite' },
                        { type: 'exo_bot', flavour: 'ExoBot_Snowwhite' },
                        { type: 'feet', flavour: 'Feet_Snowwhite' },
                        { type: 'eyes', flavour: 'Eyes_Blue' },
                        { type: 'hands', flavour: 'Hands_Snowwhite' },
                        { type: 'head', flavour: 'Head_Fresh_Lemon' },
                        { type: 'teeth', flavour: 'Teeth_Hollywood' }
                    ],
                };
                this.pushData(data, client.sessionId);
            }
            else {
                axios_1.default.get('https://promo.battlemon.com/api/lemon/' + message.playerId)
                    .then(result => {
                    this.pushData(result.data, client.sessionId);
                }).catch((error) => {
                    if (error.response) {
                        client.send('errorIdPlayer', error.response.status);
                    }
                });
            }
        });
        this.onMessage("syncPlayer", (client, message) => {
            this.broadcast('syncPlayer', message, { except: client });
        });
    }
    onJoin(client, options) {
        console.log(client.sessionId, "joined!");
    }
    onLeave(client, consented) {
        const playerIndex = this.state.players.findIndex(player => player.clientSessionId === client.sessionId);
        this.state.players.splice(playerIndex, 1);
        console.log(client.sessionId, "left!");
    }
    onDispose() {
        console.log("room", this.roomId, "disposing...");
    }
    pushData(data, sessionId) {
        let player = new MyRoomState_1.Player();
        player.id = data.id;
        player.clientSessionId = sessionId;
        player.items = [];
        player.properties = [];
        data.items.forEach((item) => {
            let newItem = new MyRoomState_1.Item();
            newItem.type = item.type;
            newItem.flavour = item.flavour;
            player.items.push(newItem);
        });
        data.properties.forEach((property) => {
            let newProperty = new MyRoomState_1.Property();
            newProperty.type = property.type;
            newProperty.flavour = property.flavour;
            player.properties.push(newProperty);
        });
        this.state.players.push(player);
    }
}
exports.MyRoom = MyRoom;
