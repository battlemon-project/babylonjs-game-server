import { Room, Client } from "colyseus";
import { MyRoomState } from "./schema/MyRoomState";

export class MyRoom extends Room<MyRoomState> {

  onCreate (options: any) {
    //TODO: create state
    //this.setState(new MyRoomState());

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

  onJoin (client: Client, options: any) {
    console.log(client.sessionId, "joined!");
  }

  onLeave (client: Client, consented: boolean) {
    this.broadcast('leavePlayer', client.sessionId, { except: client });

    console.log(client.sessionId, "left!");
  }

  onDispose() {


    console.log("room", this.roomId, "disposing...");
  }
}
