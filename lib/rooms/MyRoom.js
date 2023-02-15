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
            axios_1.default.get('https://promo.battlemon.com/api/lemon/' + message.playerId)
                .then(result => {
                const data = result.data;
                let player = new MyRoomState_1.Player();
                player.id = data.id;
                player.clientSessionId = client.sessionId;
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
            });
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
}
exports.MyRoom = MyRoom;
