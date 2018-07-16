var playState = function(game) {
  
};

var HEX_ORIGIN = { x: 360, y: 590 };
var HEX_U = { x: 0,   y: 146 };
var HEX_V = { x: 127, y: 73  };

/*               blue      yellow    green     magenta   red       white    */
var TINTS   = [0x3838ff, 0xffee55, 0x229933, 0xff44ff, 0xff3322, 0xffffff];
var IMGKEYS = ["item_0", "item_1", "item_2", "item_3", "item_4", "item_5"];
var ROTATIONS = [[0, 60, 120, 180, -120, -60],
                 [-60, 0, 60, 120, 180, -120],
                 [-120, -60, 0, 60, 120, 180],
                 [180, -120, -60, 0, 60, 120],
                 [120, 180, -120, -60, 0, 60],
                 [60, 120, 180, -120, -60, 0]];

var score = 0;
var timer_text, timer;

playState.prototype = {
    preload: function() {
      game.load.image("item_0", "res/item_0.png");
      game.load.image("item_1", "res/item_1.png");
      game.load.image("item_2", "res/item_2.png");
      game.load.image("item_3", "res/item_3.png");
      game.load.image("item_4", "res/item_4.png");
      game.load.image("item_5", "res/item_5.png");
    },
    
    create: function() {
        game.add.tileSprite(0, 0, 720, 1325, 'background');
        
        // timer
        timer_text = game.add.bitmapText(15, 15, "LicensePlate", "0", 80);
        timer = game.time.create(false);
        timer.loop(10, updateTime);
        
        // score
        score_text = game.add.bitmapText(game.world.centerX, 15, "LicensePlate", "0", 80);
        
        HexField.init();
        HexField.intro();
        
        HexField.difficulty = 0;
        game.time.events.add(2000, function() {
          HexField.shuffle();
          HexField.draw();
          timer.start();
        }, this);
    }
};

function updateTime() {
  timer_text.setText(timer.seconds.toFixed(2));
}

var hex_to_pix = function(u, v) {
  return {
    x: HEX_ORIGIN.x + u*HEX_U.x + v*HEX_V.x,
    y: HEX_ORIGIN.y + u*HEX_U.y + v*HEX_V.y
  };
};

var HexField = {
  /* positions in hexagon coordinates */
  u: [-2, -2, -2, -1, -1, -1, -1,  0, 0, 0,  1, 1, 1,  2,  2, 2, 2,  3,  3, 3],
  v: [ 0,  1,  2, -1,  0,  1,  2, -2, 0, 1, -1, 0, 2, -2, -1, 0, 1, -2, -1, 0],
  
  /* colors (f = 0..5) and rotations (r = 0..5) */
  f: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  r: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  
  /* pivot index */
  p: 0,
  
  /* difficulty settings */
  _F:        [2, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 5, 5, 6, 4, 5, 6, 1, 2, 3, 4, 5, 6],
  _R:        [2, 3, 4, 5, 6, 3, 4, 5, 6, 4, 5, 6, 5, 6, 6, 2, 2, 2, 3, 3, 3, 4, 5, 6],
  _uniqueF : [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  _uniqueR : [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  
  difficulty : 0, /* index of above list (0..18) */
  
  _sprites: [],
  
  init: function () {
    for (i = 0; i < this.u.length; i++) {
      var sprite = game.add.sprite(0, 0, IMGKEYS[0]);
      sprite.name = { index: i, r: this.r[i] };
      sprite.anchor.setTo(0.5, 0.5);
      sprite.scale.setTo(0.44);
      sprite.angle = 0;
      sprite.events.onInputDown.add(function (sprite) {
        if (sprite.name["index"] == HexField.p) {
          Animation.click(sprite);
          
          HexField.difficulty = Math.min(Math.floor(score / 5), 18);
          HexField.shuffle();
          HexField.draw();
          
          score++;
          score_text.setText(score);
          Animation.click(score);
        } else {
          Animation.shake(sprite);
          score--;
          score_text.setText(score);
        }
      });
      sprite.inputEnabled = true;
      this._sprites[i] = sprite;
    }
  },
  
  shuffle: function () {
    var fs = randDistinctBetween(this._F[this.difficulty], 0, 5);
    var rs = randDistinctBetween(this._R[this.difficulty], 0, 5);
    
    /* first item in list is pivot item */
    if (this._uniqueF[this.difficulty]) this.f[0] = fs[0];
    if (this._uniqueR[this.difficulty]) this.r[0] = rs[0];
    
    /* distribute other colors and rotations evenly */
    if (this._uniqueF[this.difficulty]) {
      for (i = 1; i < this.f.length; i++) {
        this.f[i] = fs[i % (this._F[this.difficulty]-1) + 1];
      }
    } else {
      for (i = 0; i < this.f.length; i++) {
        this.f[i] = fs[i % this._F[this.difficulty]];
      }
    }
    
    if (this._uniqueR[this.difficulty]) {
      for (i = 1; i < this.r.length; i++) {
        this.r[i] = rs[i % (this._R[this.difficulty]-1) + 1];
      }
    } else {
      for (i = 0; i < this.r.length; i++) {
        this.r[i] = rs[i % this._R[this.difficulty]];
      }
    }
    
    /* shuffle color and rotations independently (except for pivot item) */
    shuffleArray(this.f, 1, this.f.length-1);
    shuffleArray(this.r, 1, this.r.length-1);
    
    /* place pivot item at random position */
    this.p = game.rnd.integerInRange(0, this.f.length-1);
    var cF = this.f[this.p];
    var cR = this.r[this.p];
    this.f[this.p] = this.f[0];
    this.r[this.p] = this.r[0];
    this.f[0] = cF;
    this.r[0] = cR;
  },
  
  intro: function() {
    var u, v, pt, sprite;
    for (i = 0; i < this.u.length; i++) {
      u = this.u[i];
      v = this.v[i];
      pt = hex_to_pix(u, v);
      
      sprite = this._sprites[i];
      sprite.x = pt.x;
      sprite.y = pt.y;
      
      this.f[i] = game.rnd.integerInRange(0, 5);
      this.r[i] = game.rnd.integerInRange(0, 5);
      
      sprite.name.r = this.r[i];
      sprite.loadTexture(IMGKEYS[this.r[i]]);
      sprite.tint = TINTS[this.f[i]];
      
      Animation.fall_in_place(sprite);
    }
  },
  
  draw: function () {
    var u, v, pt, sprite, t, old_r;
    for (i = 0; i < this.u.length; i++) {
      u = this.u[i];
      v = this.v[i];
      pt = hex_to_pix(u, v);
      
      sprite = this._sprites[i];
      sprite.x = pt.x;
      sprite.y = pt.y;
      
      old_r = sprite.name.r;
      sprite.name.r = this.r[i];
      
      t = game.add.tween(sprite)
        .to({angle: ROTATIONS[old_r][this.r[i]]}, 150, Phaser.Easing.Quadratic.Out);
      t.onComplete.addOnce(function(s) {
        s.angle = 0;
        s.loadTexture(IMGKEYS[s.name.r]);
        s.inputEnabled = true;
      }, this);
      sprite.inputEnabled = false;
      t.start();
      Animation.tween_tint(sprite, sprite.tint, TINTS[this.f[i]], 150);
      
    }
  }
};

/* get list of n unique integers between min and max (including)
 * precondition: n <= min-min+1 */
function randDistinctBetween(n, min, max) {
  var res = [];
  var r;
  while (res.length < n) {
    r = game.rnd.integerInRange(min, max);
    if (! res.includes(r))
      res.push(r);
  }
  return res;
}

/* implementation of Fisher-Yates shuffle */
function shuffleArray(array, i_from, i_to) {
  var j, a;
  for (i = i_from; i < i_to; i++) {
    /* random j with i <= j <= i_to */
    j = game.rnd.integerInRange(i, i_to);
    
    /* swap array items i and j */
    a = array[i];
    array[i] = array[j];
    array[j] = a;
  }
}
