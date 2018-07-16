var mainMenuState = function(game) {
    console.log("Starting game!");
    
    var item;
    var text;
}

mainMenuState.prototype = {
    preload: function() {
        game.load.image('background', "res/background.jpg");
        game.load.image('item', "res/Silber1.png");
        
        game.load.bitmapFont('LicensePlate', "fonts/LicensePlate.png", "fonts/LicensePlate.fnt");
    },

    create: function() {
        game.add.tileSprite(0, 0, 720, 1325, 'background');
        
        text = game.add.bitmapText(game.world.centerX, 150, "LicensePlate", "START GAME", 60);
        text.anchor.setTo(0.5, 0.5);
        text.fontSize = 90;
        text.fill = "white";
        text.inputEnabled = true;
        text.events.onInputDown.add(startGame);
        
        // create item in center of screen
        item = game.add.sprite(game.world.centerX, game.world.centerY, 'item');
        item.anchor.setTo(0.5, 0.5);
    },
    
    update: function() {
        item.rotation = game.physics.arcade.angleBetween(item, game.input.mousePointer);
    }
};

function startGame() {
  game.state.start("Play");
}
