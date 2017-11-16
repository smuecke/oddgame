
var Animation = {

	click: function (sprite) {
		var s0 = sprite.scale.x;
		var s1 = s0 * 1.18;
        sprite.inputEnabled = false;
		var t = game.add.tween(sprite.scale)
			.to({x: s1, y: s1}, 75, Phaser.Easing.Quadratic.Out)
			.to({x: s0, y: s0}, 75, Phaser.Easing.Quadratic.In);
        t.onComplete.addOnce(function() {sprite.inputEnabled = true;}, this);
		t.start();
	},
    
    shake: function(sprite) {
      sprite.inputEnabled = false;
      var s0 = sprite.scale.x;
      var s1 = s0 * 0.9;
      
      var t1 = game.add.tween(sprite.scale)
        .to({x: s1, y: s1}, 75, Phaser.Easing.Quadratic.Out);
      var t2 = game.add.tween(sprite)
        .to({angle: 15},  50, Phaser.Easing.Linear.None)
        .to({angle: -15}, 50, Phaser.Easing.Linear.None)
        .to({angle: 15},  50, Phaser.Easing.Linear.None)
        .to({angle: 0},   50, Phaser.Easing.Linear.None);
      var t3 = game.add.tween(sprite.scale)
        .to({x: s0, y: s0}, 75, Phaser.Easing.Quadratic.In);
      t3.onComplete.addOnce(function() { sprite.inputEnabled = true; }, this);
        
      t1.chain(t2);
      t2.chain(t3);
      t1.start();
    },

	fall_in_place: function(sprite) {
		var s0 = sprite.scale.x;
		var y0 = sprite.y;
		sprite.inputEnabled = false;
		sprite.scale.setTo(s0*4);
		sprite.y -= game.world.height;
		var u = game.add.tween(sprite.scale)
			.to({x: s0, y: s0}, 1500, Phaser.Easing.Bounce.Out);
		var t = game.add.tween(sprite)
			.to({y: y0}, 1500, Phaser.Easing.Bounce.Out);
        t.onComplete.addOnce(function() {sprite.inputEnabled = true;}, this);
		u.start();
		t.start();
	},
    
    _rotate: function(sprite, angle) {
      sprite.inputEnabled = false;
      var t = game.add.tween(sprite)
        .to({angle: sprite.angle + angle}, 100, Phaser.Easing.Quadratic.Out);
      t.onComplete.addOnce(function() {sprite.inputEnabled = true;}, this);
      t.start();
    },
    
    /* after lewster32 (http://www.html5gamedevs.com/topic/7162-tweening-a-tint/) */
    tween_tint: function(obj, startColor, endColor, time) {
      var colorBlend = {step: 0};
      var colorTween = game.add.tween(colorBlend)
        .to({step: 100}, time, Phaser.Easing.Quadratic.Out);
      
      colorTween.onUpdateCallback(function() {
        obj.tint = Phaser.Color.interpolateColor(startColor, endColor, 100, colorBlend.step);
      });
      
      colorTween.start();
    }

}
