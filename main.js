'use strict';

requirejs(["myWorld", "lambda", "terminal"], function(util) {
  var term = new Terminal();      
  document.body.appendChild(term.html);
  
  var world = new MyWorld();
  var lambda = new Lambda(term, world);
  lambda.run();
});
