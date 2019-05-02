/*
	Dependency

	tiles.js
	assets.js
	canvaz.js
	tilemap.js

	classAdder.js
*/
var Game = (function () {

    var keyboardInstructions = '<div><b>Instructions for moving and rotating the tiles:</b></div>'+
        '<div>1. Use the &#8592; (left), &#8594 (right) and &#8595 (down) arrow keys for navigation</div>'+
        '<div>2. Use the &#8593 (up) arrow key for rotation</div>';

    var touchInstructions = '<div><b>Instructions for moving and rotating the tiles:</b></div>'+
        '<div>1. Swipe left, right and down to navigate</div>'+
        '<div>2. Tap once for rotation</div>';

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
        this.audioPath = config.audioPath;
        _init.call(this);


        window.addEventListener("keydown", _userController.bind(this));
        var touchEvents = new userController({callbacks:_userController.bind(this), target:this.canvasTarget});
        window.addEventListener("focus", function(){this.target.focus();});
    }

    function _init() {
        var _this = this;
        this.tiles = [];
        if (this.canvasTarget) {
            this.canvasTarget.innerHTML = "";
        } 
        else 
        {
            this.metaWrapper = document.createElement("div");
            this.metaWrapper.classList.add("meta-wrapper");

            this.canvasWrapper = document.createElement("div");
            this.canvasWrapper.classList.add("canvas-wrapper");
            
            _createGameTitleBoard.call(this);
            
            this.canvasTarget = document.createElement("div");
            this.canvasTarget.classList.add("game-canvas-wrapper");
            this.canvasWrapper.appendChild(this.canvasTarget);
            
            var instructions = document.createElement("div");
            instructions.id = "instructions";

            var mobileFlag = false;
            if(window.innerHeight > window.innerWidth)
            {
                instructions.innerHTML = touchInstructions;
            }
            else
            {
                instructions.innerHTML = keyboardInstructions;
            }

            this.metaWrapper.appendChild(instructions);

            this.target.appendChild(this.metaWrapper);
            this.target.appendChild(this.canvasWrapper);
        }

        this.gameSpeed = 500;
        this.gameSpeedCounter = 0;
        this.gameLevelCounter = 1;
        this.gameSpeedConstant = 10;
        this.score = 0;
        this.scoreConstant = 5;


        this.boardConf.target = this.canvasTarget;
        this.boardCanvas = new Canvaz(this.boardConf);
        this.tileCanvas = new Canvaz(this.boardConf);
        this.wallCanvas = new Canvaz(this.boardConf);
        this.tileMap = new TileMap(this.mapConf);
        this.boardCanvas.ctx.strokeRect(1, 1, this.boardConf.dimension.w-2, this.boardConf.dimension.h-2);
        for (var i = 0; i < this.boardConf.dimension.w; i = i + this.tileConf.dimension.h) {
            for (var j = 0; j < this.boardConf.dimension.h; j = j + this.tileConf.dimension.h) {
                this.boardCanvas.ctx.strokeRect(i, j, this.tileConf.dimension.h, this.tileConf.dimension.h);
            }
        }
        this.gameState = 3;
        
        _updateSpeed.call(this, true);
        _updateScore.call(this, false, true);
        _updateStatus.call(this);
        
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
                        if(this.tileMap && this.tileMap.checkForFullLine(0))
                        {
                            _this.gameState = 5;
                            clearInterval(_this.tileDropper);
                            _tileKong.call(_this);
                        }
                        else
                        {
                            _this.gameState = 3;
                            clearInterval(_this.tileDropper);
                            console.log("game over #_#");
                        }
                    } else {
                        firstFlag = false;
                        _wrongMoveAction.call(_this, { dir: 3 });
                    }
                }
                firstFlag = false;
                _updateStatus.call(_this);
            } else {
                _this.gameState = 5;
                clearInterval(_this.tileDropper);
                _tileKong.call(_this);
            }
        }, _this.gameSpeed);


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
                var fullLineRows = this.tileMap.checkForFullLines();
                var rowLength = fullLineRows.length;
                _updateScore.call(this);
                if (rowLength) {
                    this.tileCanvas.ctx.clearRect(0, 0, this.boardConf.dimension.w, this.boardConf.dimension.h);
                    for (var i = rowLength - 1; i >= 0; i--) {
                        /*
                        	move one row down in tileMap
                        	clear the current row in canvas 
                        	move the above rows in canvas down
                        */
                        _playmusic.call(this, "fullLine");
                        this.tileMap.moveDownOneRow(fullLineRows[i]);
                        this.wallCanvas.ctx.clearRect(0, fullLineRows[i], this.boardConf.dimension.w, this.tileConf.dimension.h);
                        var imgData = this.wallCanvas.ctx.getImageData(0, 0, this.boardConf.dimension.w, fullLineRows[i]);
                        // this.wallCanvas.ctx.clearRect(0, 0, this.boardConf.dimension.w, fullLineRows[i]-this.tileConf.dimension.h);
                        this.wallCanvas.ctx.putImageData(imgData, 0, this.tileConf.dimension.h);

                        _updateSpeed.call(this);
                        _updateScore.call(this, true);
                        
                        this.gameSpeed -= this.gameSpeedConstant / this.gameLevelCounter;
                        console.log("Game Speed: ", this.gameSpeed);
                        console.log("Score: ", this.score);
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
    function _userController(e, config) {
        if(config || directionKeyMap[e.key])
        {
            e.preventDefault();
            if (this.gameState == 1) {
                var dir = directionKeyMap[e.key] || config.direction;
                if(dir)
                    {
                        console.log(dir);
                        // _playmusic.call(this, "move");
                        if (!_move.call(this, dir)) {
                            _wrongMoveAction.call(this, { dir: directionMap[dir] });
                        }
                    }
            }
        }
    }

    function _updateStatus() {
    	switch(this.gameState)
    	{
    		case 3:
    			this.tags.gameStatusText.innerText = "Game Over";
    		break;
    		case 2:
    			this.tags.gameStatusText.innerText = "Game Paused";
    		break;
    		case 1:
    			this.tags.gameStatusText.innerText = "Game Playing";
    		break;
    	}
    }

    function _updateSpeed(reinit) {
    	var levelUp = false;
        if (!reinit) {
            this.gameSpeedCounter++;
            if (this.gameSpeedCounter < this.gameLevelCounter * this.gameSpeedConstant) {
                this.gameSpeedCounter++;
            } else {
                this.gameSpeedCounter = 1;
                this.gameLevelCounter++;
                console.log("Level = "+this.gameLevelCounter);
                levelUp = true;
            }

        }
        if(levelUp)
        {
        	this.tags.levelText.innerText = this.gameLevelCounter;
        }
        this.tags.speedText.innerText = this.gameLevelCounter + "." + this.gameSpeedCounter;
    }

    function _updateScore(fullLine, reinit) {
        if (reinit) {
            this.score = 0;
        } else {
            if (fullLine) {
                this.score += (this.scoreConstant * this.gameLevelCounter) * (this.boardConf.dimension.w / this.tileConf.dimension.w);
            } else {
                this.score += this.scoreConstant * this.gameLevelCounter;
            }
        }


        this.tags.scoreText.innerText = this.score;
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
        var directionType = (typeof dir == "string")? directionMap[dir] : dir;
        if(directionType)
        {
            switch (directionType) {
            case 2:
                {
                    // var rightSum = this.tile.x + this.tile.tileBlockWidth;
                    // if(rightSum < this.boardConf.dimension.w)
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
        return false;
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

        config.ctx.lineWidth = 0;
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

    function _createGameTitleBoard() {
        this.tags = {};

        var gameTitleBoardWrapper = document.createElement("div");
        gameTitleBoardWrapper.classList.add("game-title-board");

        var gameTitleWrapper = document.createElement("div");
        var gameTitle = document.createElement("span");
        gameTitle.innerText = "Tetris, a test-game";
        gameTitleWrapper.appendChild(gameTitle);

        var gameStatusWrapper = document.createElement("div");

        var score = document.createElement("div");
        score.innerText = "Score: ";
        this.tags.scoreText = document.createElement("span");
        this.tags.scoreText.innerText = "0";
        score.appendChild(this.tags.scoreText);

        var level = document.createElement("div");
        level.innerText = "Level: ";
        this.tags.levelText = document.createElement("span");
        this.tags.levelText.innerText = "1";
        level.appendChild(this.tags.levelText);

        var speed = document.createElement("div");
        speed.innerText = "Speed: ";
        this.tags.speedText = document.createElement("span");
        this.tags.speedText.innerText = "1.0";
        speed.appendChild(this.tags.speedText);

        var gameStatus = document.createElement("div");
        this.tags.gameStatusText = document.createElement("div");
        this.tags.gameStatusText.innerText = "Game Over";
        gameStatus.appendChild(this.tags.gameStatusText);

        gameStatusWrapper.appendChild(level);
        gameStatusWrapper.appendChild(score);
        gameStatusWrapper.appendChild(speed);
        gameStatusWrapper.appendChild(gameStatus);


        var gameControlsWrapper = _createGameControls.call(this);

        gameTitleBoardWrapper.appendChild(gameTitleWrapper);
        gameTitleBoardWrapper.appendChild(gameStatusWrapper);
        gameTitleBoardWrapper.appendChild(gameControlsWrapper);

        this.metaWrapper.appendChild(gameTitleBoardWrapper);
    }

    function _createGameControls() {
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

        return buttonWrapper;
    }

    function _drawSqr(x, y, ctx) {
        // console.log("x = "+x+", y = "+y);
        ctx.fillRect(x, y, this.tileConf.dimension.h, this.tileConf.dimension.h);
    }

    function _eraseSqr(x, y, ctx) {
        ctx.clearRect(x, y, this.tileConf.dimension.h, this.tileConf.dimension.h);
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

    function _playmusic(state)
	{
	    var filePath = audioFiles[state];
        if(typeof filePath == "object")
        {
            filePath = filePath[Math.floor(Math.random()*4)];
        }
	    var src = this.audioPath+filePath;
	    // console.log("index = "+randomIndex+" src = "+src);
	    var audio = new Audio(src);
	    audio.pause();
	    audio.play();
	}

    Game.prototype.rotateCurrentTile = function () {
        _rotateCurrentTile.call(this);
    }

    Game.prototype.control = function (control) {
        _gamePlayControl.call(this, control);
    }

    Game.prototype.moveTile = function (config) {
        _move.call(this, config.direction);
    }

    return Game;
})();