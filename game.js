/*
	Dependency

	tiles.js
	assets.js
	canvaz.js
	tilemap.js

	classAdder.js
*/
var Game = (function () {
    var directionMap = {
        "up": 9,
        "right": 2,
        "down": 3,
        "left": 4,
    }

    var directionKeyMap = {
        "ArrowUp": "up",
        "ArrowRight": "right",
        "ArrowLeft": "left",
        "ArrowDown": "down"
    }

    var gameStateMap = {
        "play": 1,
        "pause": 2,
        "stop": 3,
        "start": 4,
        "nextTile": 5
    }

    function Game(config) {
        this.target = config.target;
        this.boardConf = config.boardConf;
        this.tileConf = config.tileConf;
        this.mapConf = config.mapConf;
        _init.call(this);
        window.addEventListener("keyup", _userController.bind(this));
        createGameControls.call(this);
    }

    function _init() {
        var _this = this;
        this.tiles = [];
        if (this.canvasTarget) {
            this.canvasTarget.innerHTML = "";
        } else {
            this.canvasTarget = document.createElement("div");
            this.canvasTarget.classList.add("game-canvas-wrapper");
            this.target.appendChild(this.canvasTarget);
        }


        this.boardConf.target = this.canvasTarget;
        this.boardCanvas = new Canvaz(this.boardConf);
        this.tileCanvas = new Canvaz(this.boardConf);
        this.wallCanvas = new Canvaz(this.boardConf);
        this.tileMap = new TileMap(this.mapConf);
        for (var i = 0.5; i < this.boardConf.width; i = i + this.tileConf.height) {
            for (var j = 0.5; j < this.boardConf.height; j = j + this.tileConf.height) {
                this.boardCanvas.ctx.strokeRect(i, j, 46, 46);
            }
        }
        this.gameState = 3;
        _tileKong.call(this);

    }

    function _tileKong() {
        switch (this.gameState) {
            /*case 1:
            break;
            case 2:
            break;*/
        case 3:
        case 4:
        case 5:
            this.tile = null;
            this.tile = new Tile(this.tileConf);
            break;
        }
        this.gameState = 1;
        var _this = this;
        var comparator = _this.boardCanvas.height;
        var firstFlag = true;
        _this.tileDropper = setInterval(function () {
            if (_this.tile.y < comparator) {
                if (!_move.call(_this, "down")) {
                    if (firstFlag) // hit top
                    {
                        _this.gameState = 3;
                        clearInterval(_this.tileDropper);
                        console.log("game over #_#");
                    } else {
                        firstFlag = false;
                        _wrongMoveAction.call(_this, { dir: 3 });
                    }
                }
                firstFlag = false;
            } else {
                this.gameState = 5;
                clearInterval(_this.tileDropper);
                _tileKong.call(_this);
            }
        }, 500);


    }

    function _wrongMoveAction(config) {
        if (config.dir) {
            switch (config.dir) {
                // case 9:
                // case 2:
                // case 4:

                // break;	
            case 3:
                this.gameState = 5;
                // /*erase the tileCanvas*/this.tileCanvas.ctx.clearRect(0, 0, this.tileCanvas.width, this.tileCanvas.height);
                this.tileMap.setTileSet({ tileSet: this.tile.mappedTileSet, strictMode: true });
                /*draw on the wallCanvas*/
                _drawTile.call(this, { ctx: this.wallCanvas.ctx, tile: this.tile, eraseFlag: false });
                clearInterval(this.tileDropper);
                var fullLineRows = this.tileMap.checkForFullLine();
                var rowLength = fullLineRows.length;
                if (rowLength) {
                    this.tileCanvas.ctx.clearRect(0, 0, this.boardConf.width, this.boardConf.height);
                    for (var i = rowLength - 1; i >= 0; i--) {
                        /*
                        	move one row down in tileMap
                        	clear the current row in canvas 
                        	move the above rows in canvas down
                        */
                        this.tileMap.moveDownOneRow(fullLineRows[i]);
                        this.wallCanvas.ctx.clearRect(0, fullLineRows[i], this.boardConf.width, this.tileConf.height);
                        var imgData = this.wallCanvas.ctx.getImageData(0, 0, this.boardConf.width, fullLineRows[i]);
                        // this.wallCanvas.ctx.clearRect(0, 0, this.boardConf.width, fullLineRows[i]-this.tileConf.height);
                        this.wallCanvas.ctx.putImageData(imgData, 0, this.tileConf.height);
                    }
                }
                _tileKong.call(this);
                break;
            }

        }

    }
    /*
    	various possible wrong moves are
    	- rotating around boundaries
    	- rotating when there are tiles
    	- moving in a direction where there are tiles
    	- when item dropped cannot go beyond the first cell
    */
    function _userController(e) {
        if (this.gameState == 1) {
            var dir = directionKeyMap[e.key];
            if (!_move.call(this, dir)) {
                _wrongMoveAction.call(this, { dir: directionMap[dir] });
            }
        }
    }

    function _move(dir) {
        /*
        	- check if the move is possible
        	- if not, do not make the move and return false
        	- if possible, make the move and return true
        	- add rotation in here
        */
        var x = this.tile.x;
        var y = this.tile.y;
        var directionType = directionMap[dir];
        switch (directionType) {
        case 2:
            {
                // var rightSum = this.tile.x + this.tile.tileBlockWidth;
                // if(rightSum < this.boardConf.width)
                this.tile.move({ x: (this.tile.x + this.tile.height) });
                break;
            }
        case 3:
            {
                this.tile.move({ y: (this.tile.y + this.tile.height) });
                break;
            }
        case 4:
            {
                var leftSum = this.tile.x - this.tile.height;
                // if(leftSum > -1)
                this.tile.move({ x: leftSum });
                break;
            }
        case 9:
            {
                this.tile.rotate();
                break;
            }
        }
        var possible = this.tileMap.checkTileSet({ tileSet: this.tile.mappedTileSet, strictMode: true });
        if (!possible) {
            if (directionType < 9) {
                this.tile.move({ x: x, y: y });
            } else {
                this.tile.rotate("antiClock");
            }
            return false;
        }
        // console.log("CheckTile result = "+possible);
        _drawTile.call(this, { ctx: this.tileCanvas.ctx, tile: this.tile, eraseFlag: true });
        return true;
    }

    function _rotateCurrentTile() {
        _drawTile.call(this, { ctx: this.tileCanvas.ctx, tile: this.tile, eraseFlag: true });
        this.tile.rotate();
        _drawTile.call(this, { ctx: this.tileCanvas.ctx, tile: this.tile });
    }

    function _drawTile(config) {
        var x = config.tile.x;
        var y = config.tile.y;
        var tileSet = config.tile.tileSet || null;

        config.ctx.lineWidth = 2;
        config.ctx.strokeStyle = config.tile.color[1];
        config.ctx.fillStyle = config.tile.color[0];
        if (config.eraseFlag) {
            config.ctx.clearRect(0, 0, this.tileCanvas.width, this.tileCanvas.height);
        }


        for (var i = 0; i < config.tile.rowCount; i++) {

            for (var j = 0; j < config.tile.columnCount; j++) {

                if (config.tile.mappedTileSet[i][j]) {
                    _drawSqr.call(this, config.tile.mappedTileSet[i][j].x, config.tile.mappedTileSet[i][j].y, config.ctx);
                }
            }
        }
        // for (var i in tileSet) {
        //     // console.log("i="+i);
        //     for (var j in tileSet[i]) {
        //         // console.log("j="+tileSet[i][j]);	
        //         if (tileSet[i][j]) {
        //             _drawSqr.call(this, (x + (parseInt(j) * config.tile.height)), (y + (parseInt(i) * config.tile.height)), config.ctx);
        //         }
        //     }
        // }

    }

    function createGameControls() {
        var _this = this;
        var buttonWrapper = document.createElement("div");
        buttonWrapper.classList.add("game-control-wrapper");

        var pauseButton = document.createElement("div");
        pauseButton.classList.add("pause-button");
        pauseButton.innerText = "||";
        pauseButton.addEventListener("click", _gamePlayControl.bind(this, { command: "pause" }));

        var playButton = document.createElement("div");
        playButton.classList.add("play-button");
        playButton.innerText = "\u25b6";
        playButton.addEventListener("click", _gamePlayControl.bind(this, { command: "play" }));

        var restartButton = document.createElement("div");
        restartButton.classList.add("restart-button");
        restartButton.innerText = "\u21bb";
        restartButton.addEventListener("click", _gamePlayControl.bind(this, { command: "restart" }));

        buttonWrapper.appendChild(pauseButton);
        buttonWrapper.appendChild(playButton);
        buttonWrapper.appendChild(restartButton);

        this.target.appendChild(buttonWrapper);
    }

    function _drawSqr(x, y, ctx) {
        // console.log("x = "+x+", y = "+y);
        ctx.fillRect(x, y, 46, 46);
    }

    function _eraseSqr(x, y, ctx) {
        ctx.clearRect(x, y, 46, 46);
    }

    function _gamePlayControl(config) {
        switch (config.command) {
        case "stop":
            this.gameState = 3;
            clearInterval(this.tileDropper);
            break;

        case "start":
            this.gameState = 4;
            _init.call(this);
            break;

        case "pause":
            this.gameState = 2;
            clearInterval(this.tileDropper);
            break;

        case "play":
            this.gameState = 1;
            clearInterval(this.tileDropper);
            _tileKong.call(this);
            break;

        case "restart":
            this.gameState = 4;
            clearInterval(this.tileDropper);
            _init.call(this);
            break;
        }
    }

    Game.prototype.rotateCurrentTile = function () {
        _rotateCurrentTile.call(this);
    }

    Game.prototype.control = function (control) {
        _gamePlayControl.call(this, control);
    }

    return Game;
})();