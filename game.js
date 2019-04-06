/*
	Dependency

	tiles.js
	assets.js
	canvaz.js
	tilemap.js

	classAdder.js
*/
var Game = (function(){
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

	function Game(config)
	{
		this.target = config.target;
		this.boardConf = config.boardConf;
		this.boardConf.target = this.target;
		this.tileConf = config.tileConf;
		this.mapConf = config.mapConf;

		_init.call(this);
		this.flags = {
			"userControl": 1	
		}
	}

	function _init()
	{
		var _this = this;
		this.tiles = [];
		this.flags = 
		this.boardCanvas = new Canvaz(this.boardConf);
		this.tileCanvas = new Canvaz(this.boardConf);
		this.wallCanvas = new Canvaz(this.boardConf);
		this.tileMap = new TileMap(this.mapConf);
		for(var i=0.5;i<this.boardConf.width;i=i+this.tileConf.height)
		{
			for(var j=0.5;j<this.boardConf.height;j=j+this.tileConf.height)
			{
				this.boardCanvas.ctx.strokeRect(i, j, 46, 46);
			}
		}

		_tileKong.call(this);
		window.addEventListener("keyup",_userController.bind(_this));

	}

	function _tileKong()
	{
			var _this = this;
			this.tile = null;
			this.tile = new Tile(this.tileConf);
			var comparator = _this.boardCanvas.height;
			_this.tileDropper = setInterval(function(){
				if(_this.tile.y < comparator)
				{
					if(!_move.call(_this, "down"))
					{
						_wrongMoveAction.call(_this,{dir:3});
					}
				}
				else
				{
					clearInterval(_this.tileDropper);
					_tileKong.call(_this);
				}
			}, 500);
		

	}

	function _wrongMoveAction(config)
	{
		if(config.dir)
		{
			
			// /*erase the tileCanvas*/this.tileCanvas.ctx.clearRect(0, 0, this.tileCanvas.width, this.tileCanvas.height);
			this.tileMap.setTileSet({tileSet:this.tile.mappedTileSet, strictMode:true});
			/*draw on the wallCanvas*/_drawTile.call(this,{ctx: this.wallCanvas.ctx, tile:this.tile, eraseFlag: false});
			clearInterval(this.tileDropper);
			_tileKong.call(this);
			
		}

	}
/*
	various possible wrong moves are
	- rotating around boundaries
	- rotating when there are tiles
	- moving in a direction where there are tiles
	- when item dropped cannot go beyond the first cell
*/
	function _userController(e)
	{
		var dir = directionKeyMap[e.key];
		if(!_move.call(this, dir))
		{
			_wrongMoveAction.call(this,{dir:directionMap[dir]});
		}
	}

	function _move(dir)
	{
		/*
			- check if the move is possible
			- if not, do not make the move and return false
			- if possible, make the move and return true
			- add rotation in here
		*/
		var x = this.tile.x;
		var y = this.tile.y;
		var directionType = directionMap[dir];
		switch(directionType)
		{
			case 2:
			{
				var rightSum = this.tile.x + this.tile.tileBlockWidth;
				if(rightSum < this.boardConf.width)
					this.tile.move({x:(this.tile.x + this.tile.height)});
				break;
			}
			case 3:
			{
				this.tile.move({y: (this.tile.y + this.tile.height)});
				break;
			}
			case 4:
			{
				var leftSum = this.tile.x - this.tile.height;
				if(leftSum > -1)
					this.tile.move({x: leftSum}); 
				break;
			}
			case 9:
			{
				this.tile.rotate();
				break;
			}
		}
		var possible = this.tileMap.checkTileSet({tileSet:this.tile.mappedTileSet, strictMode: true});
		if(!possible)
		{
			if(directionType < 9)
			{
				this.tile.move({x: x, y: y}); 
			}
			else
			{
				this.tile.rotate("antiClock");
			}
			return false;
		}
		// console.log("CheckTile result = "+possible);
		_drawTile.call(this, {ctx: this.tileCanvas.ctx, tile: this.tile, eraseFlag: true});
		return true;
	}

	function _rotateCurrentTile()
	{
		_drawTile.call(this,{ctx: this.tileCanvas.ctx, tile: this.tile, eraseFlag: true});
		this.tile.rotate();
		_drawTile.call(this,{ctx: this.tileCanvas.ctx, tile: this.tile});
	}

	function _drawTile(config)
	{
		var x = config.tile.x;
		var y = config.tile.y;
		var tileSet = config.tile.tileSet || null;

		config.ctx.lineWidth = 2;
		config.ctx.strokeStyle = config.tile.color[1];
		config.ctx.fillStyle = config.tile.color[0];
		if(config.eraseFlag)
		{
			config.ctx.clearRect(0, 0, this.tileCanvas.width, this.tileCanvas.height);
		}
		
		for(var i in tileSet)
		{
			// console.log("i="+i);
			for(var j in tileSet[i])
			{
				// console.log("j="+tileSet[i][j]);	
				if(tileSet[i][j])
				{
					_drawSqr.call(this, (x+(parseInt(j)*config.tile.height)), (y+(parseInt(i)*config.tile.height)), config.ctx);
				}
			}
		}
		
	}

	function _drawSqr(x, y, ctx)
	{

		// console.log("x = "+x+", y = "+y);
		ctx.fillRect(x, y, 46, 46);
	}

	function _eraseSqr(x, y, ctx)
	{
		ctx.clearRect(x, y, 46, 46);
	}

	function gamePlayControl(config)
	{
		//
		switch(config.command)
		{
			case "stop-start":

			break;
			case "pause-play":
			case "restart":
		}
	}

	Game.prototype.rotateCurrentTile = function()
	{
		_rotateCurrentTile.call(this);
	}

	Game.prototype.stop = function()
	{
		_stop.call(this);
	}

	return Game;
})();

