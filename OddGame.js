var game = new Phaser.Game(720, 1325, Phaser.AUTO, 'oddgame');

game.state.add("MainMenu", mainMenuState);
game.state.add("Play", playState);
game.state.add("End", endState);

game.state.start("MainMenu");
