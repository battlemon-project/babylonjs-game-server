"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyRoom = void 0;
const colyseus_1 = require("colyseus");
class MyRoom extends colyseus_1.Room {
    onCreate(options) {
        // this.setState(new MyRoomState());
        this.onMessage("newPlayer", (client, message) => {
            this.broadcast('newPlayer', message, { except: client });
        });
        this.onMessage("syncPlayer", (client, message) => {
            this.broadcast('syncPlayer', message, { except: client });
        });
        this.onMessage("helloNewPlayer", (client, message) => {
            this.broadcast('helloNewPlayer', message, { except: client });
        });
    }
    onJoin(client, options) {
        console.log(client.sessionId, "joined!");
    }
    onLeave(client, consented) {
        console.log(client.sessionId, "left!");
    }
    onDispose() {
        console.log("room", this.roomId, "disposing...");
    }
}
exports.MyRoom = MyRoom;
