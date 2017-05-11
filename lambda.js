'use strict';

function stringify(obj, replacer, spaces, cycleReplacer) {
  return JSON.stringify(obj, serializer(replacer, cycleReplacer), spaces)
}

function serializer(replacer, cycleReplacer) {
  var stack = [], keys = []

  if (cycleReplacer == null) cycleReplacer = function(key, value) {
    if (stack[0] === value) return "[Circular ~]"
    return "[Circular ~." + keys.slice(0, stack.indexOf(value)).join(".") + "]"
  }

  return function(key, value) {
    if (stack.length > 0) {
      var thisPos = stack.indexOf(this)
      ~thisPos ? stack.splice(thisPos + 1) : stack.push(this)
      ~thisPos ? keys.splice(thisPos, Infinity, key) : keys.push(key)
      if (~stack.indexOf(value)) value = cycleReplacer.call(this, key, value)
    }
    else stack.push(value)

    return replacer == null ? value : replacer.call(this, key, value)
  }
}

function makeWords(line) {
  let quoted = false;

  let result = [];
  let word = null;
  for (var index = 0; index < line.length; index++) {
    var c = line[index];
    if (c == ' ') {
      if (quoted) {
        if (word == null) {
          word = "";
        }
        word += c;
      } else {
        if (word != null) {
          result.push(word);
          word = null;
        }
      }
    } else if (c == '"') {
      quoted = !quoted;
    } else {
      if (word == null) {
        word = "";
      }
      word += c;
    }
  }
  if (word != null) {
    result.push(word);
  }
  
  return result;
}

// http://www.hayseed.net/MOO/manuals/ProgrammersManual.html

// Look for verbs:
// 1. the player who typed the command,
// 2. the room the player is in,
// 3. the direct object, if any, and
// 4. the indirect object, if any.

class Lambda {
  constructor(term, world) {
    this.term = term;
    this.world = world;
    this.world.player.location = this.world.room;
    this.world.room.contents = [this.world.player];
    this.preps = [
      //['none'],
      //['any'],
      ['with', 'using'],
      ['at', 'to'],
      ['in front of'],
      ['in', 'inside', 'into'],
      ['on top of', 'on', 'onto', 'upon'],
      ['out of', 'from inside', 'from'],
      ['over'],
      ['through'],
      ['under', 'underneath', 'beneath'],
      ['behind'],
      ['beside'],
      ['for', 'about'],
      ['is'],
      ['as'],
      ['off', 'off of'],
    ];
  }
  
  run() {
    if (this.world.player._quit) {
      this.term.print('Goodbye!');
    } else {
      this.term.print(this.world.player.location.description);
      this.term.input("", (result) => {
        
        //term.print("(" + result + ")");
        this.parse(result);
        this.run();
      });
    }
  }
  
  execute(obj, verb) {
    //term.print("==================");
    //term.print(stringify(obj));
    if (!('verbs' in obj)) {
      //term.print("No verbs!");
      return false;
    }

    for (var index = 0; index < obj.verbs.length; index++) {
      var v = obj.verbs[index];
      if (v.length == 1) {
        // Just a function - it's name is the verb to match
        var func = v[0];
        if (typeof func === "function") {
          if (func.name == verb) {
            func.call(obj, this.term);
            return true;
          }
        }
      }
    }
    return false;
  }
  
  parse(text) {
    var words = makeWords(text);
    this.term.print(JSON.stringify(words));
    if (words.length < 1) {
      return;
    }
    var verb = words[0];
    
    if (this.execute(this.world.player, verb)) return;
    if (this.execute(this.world.player.location, verb)) return;
    this.term.print('Command not understood: ' + text);
  }
}
