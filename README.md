# OddGame

<h1 align="center">
    <br>
    <image src="https://github.com/smuecke/OddGame/blob/master/res/item_1.png" alt="OddGame" width="200">
</h1>
<h4 align="center">A mobile game idea</h4>

The objective of this game is to click the *odd one out*, i.e. the only item that is *unique*, as fast as possible. At first this is easy, but as you progress, the odd one out gets much trickier to spot. Have fun!

This game is implemented using [Phaser](https://phaser.io).

## Screenshots

![Gameplay](https://i.imgur.com/kdrZUsF.png)

## Installation
### Linux

The commendable way:

1. Clone repository to directory `/foo/oddgame`
2. Change into the directory:  
   ```
   cd /foo/oddgame
   ```
3. Start local HTTP server, e.g. using python:  
   
   ```sh
   # Python 2.x OR ...
   python -m SimpleHTTPServer
   # Python 3.x
   python -m http.server 
   ```
4. Open your browser and navigate to `localhost:8000`

Note that it is no longer possible to open `index.html` directly due to issues with CORS (Cross-Origin Resource Sharing). For further information s. https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS/Errors/CORSRequestNotHttp.
