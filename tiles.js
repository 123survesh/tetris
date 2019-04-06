/*
	Dependency
	tile_map json from assets.js

*/
var Tile = (function(){
	var rotationDirectionMap = {
		"clock": 1,
		"antiClock": 0
	}
	function Tile(config)
	{
		this.x = config.coords.x;
		this.y = config.coords.y;
		this.height = config.height;
		_init.call(this);
	}	

	function _init()
	{
		var random_number = Math.random(11);
		var _10 = Math.floor(random_number*10);
		var _100 = Math.floor(random_number*100);
		// console.log("_10 = "+_10+", _100 = "+_100);
		random_number = (_10 > 1)? _10 : (_100 > 11)? _10 : _100;
		this.tileSet = window.tile_map[random_number];
		this.mappedTileSet = [];
		_mapTileSet.call(this);
		this.tileBlockWidth = this.tileSet[0].length * this.height;
		this.color = window.colorMap[Math.floor(10*Math.random())] || 1;
	}

	function _mapTileSet()
	{
		var tileSet_ = {};
		var rows = Object.keys(this.tileSet);
		var rowCount = rows.length;
		for(var i=0;i<rowCount;i++)
		{
			var column = this.tileSet[rows[i]];
			var columnCount = column.length;
			if(!tileSet_[i])
			{
				tileSet_[i] = {};
			}	
			for(var j=0;j<columnCount;j++)
			{
				
				tileSet_[i][j] = {};
				
				if(this.tileSet[i][j])
				{
					tileSet_[i][j].x = (j*this.height) + this.x;
					tileSet_[i][j].y = (i*this.height) + this.y;
				}
				else
				{
					tileSet_[i][j] = 0;
				}
			}
		}
		this.mappedTileSet = tileSet_;
	}

	function _move(coords)
	{
		this.x = (typeof coords.x == "number")? coords.x : this.x;
		this.y = (typeof coords.y == "number")? coords.y : this.y;
		_mapTileSet.call(this);
	}

	function _rotate(direction)
	{
		var tileSet_ = {};
		var mappedTileSet_ = {};
		var rows = Object.keys(this.tileSet);
		var rowCount = rows.length;
		for(var i=0;i<rowCount;i++)
		{
			var column = this.tileSet[rows[i]];
			var columnCount = column.length;
			for(var j=0;j<columnCount;j++)
			{
				var one, two;
				if(rotationDirectionMap[direction])
				{
					one = j;
					two = i;
				}
				else
				{
					one = i;
					two = j;
				}
				if(!tileSet_[one])
				{
					tileSet_[one] = [];
					mappedTileSet_[one] = {};
				}

				tileSet_[one][two] = this.tileSet[rowCount-two-1][one];
				

				mappedTileSet_[one][two] = {};

				if(tileSet_[one][two])
				{
					mappedTileSet_[one][two].x = (two*this.height) + this.x;
					mappedTileSet_[one][two].y = (one*this.height) + this.y;
				}
				else
				{
					mappedTileSet_[one][two] = 0;
				}
			}
		}
		this.tileSet = tileSet_;
		this.mappedTileSet = mappedTileSet_;
		this.tileBlockWidth = this.tileSet[0].length * this.height;
	}

	Tile.prototype.rotate = function(direction)
	{
		direction = direction || "clock";
		_rotate.call(this, direction);
	}

	Tile.prototype.move = function(coords)
	{
		var _this = this;
		_move.call(_this, coords);
	}

	return Tile;
})()