/*
	Dependency

	tiles.js
	assets.js
	canvaz.js

	classAdder.js
*/
var Game = (function(){
	var direction = {
		"up": 1,
		"right": 2,
		"down": 3,
		"left": 4,
	}

	var direction_map = {
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
		_init.call(this);
	}

	function _init()
	{
		var _this = this;
		this.boardCanvas = new Canvaz(this.boardConf);
		this.tileCanvas = new Canvaz(this.boardConf);

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
					_move.call(_this, "down");
				}
				else
				{
					clearInterval(_this.tileDropper);
					_tileKong.call(_this);
				}
			}, 500);
		

	}

	function _userController(e)
	{
		var dir = direction_map[e.key];
		if(direction[dir] == 1)
		{
			this.tile.rotate();
		}
		_move.call(this, dir);
	}

	function _move(dir)
	{
		switch(direction[dir])
		{
			case 2:
			{
				var rightSum = this.tile.x + this.tile.tileBlockWidth;
				if(rightSum < this.boardConf.width)
					this.tile.x += this.tile.height; 
				break;
			}
			case 3:
			{
				this.tile.y += this.tile.height;
				break;
			}
			case 4:
			{
				var leftSum = this.tile.x - this.tile.height;
				if(leftSum > -1)
					this.tile.x = leftSum; 
				break;
			}
		}
		_drawTile.call(this, {ctx: this.tileCanvas.ctx, tile: this.tile, eraseFlag: true});
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
		var tileSet = config.tile.tileSet;

		// config.ctx.lineWidth = 2;
		// config.ctx.fillStyle = "red";
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
					_drawSqr.call(this, (x+(parseInt(j)*50)), y+(parseInt(i)*50), config.ctx);
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

	function _stop()
	{
		clearInterval(this.tileDropper);
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

