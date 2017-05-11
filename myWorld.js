'use strict';

class Lobby {
  constructor() {
    this.name = "Lobby";
    this.description = "A pleasant room.";
    this.verbs = [
      [this.look],
    ];
  }

  look(term) {
    term.print("You are in the Lobby of Google.");
  }
}

class Player {
  constructor() {
    this.name = "Player";
    this._quit = false;
    this.verbs = [
      [this.quit],
    ];
  }

  quit(term) {
    term.print("I see you're quitting!");
    this._quit = true;
  }
}

class MyWorld {
  constructor() {
    this.lobby = new Lobby();

    // Leave the variables Lambda is looking for:
    this.room = this.lobby;
    this.player = new Player();
  }
}
