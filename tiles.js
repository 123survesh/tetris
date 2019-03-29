/*
	Dependency
	tile_map json from assets.js

*/
var Tile = (function(){
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
		console.log("_10 = "+_10+", _100 = "+_100);
		random_number = (_10 > 1)? _10 : (_100 > 11)? _10 : _100;
		this.tileSet = window.tile_map[random_number];
		this.tileBlockWidth = this.tileSet[0].length * this.height;

	}

	function _move(coords)
	{
		this.x = coords.x;
		this.y = coords.y;
	}

	function _rotate()
	{
		var tileSet_ = {};
		var rows = Object.keys(this.tileSet);
		var rowCount = rows.length;
		for(var i=0;i<rowCount;i++)
		{
			var column = this.tileSet[rows[i]];
			var columnCount = column.length;
			for(var j=0;j<columnCount;j++)
			{
				if(!tileSet_[j])
				{
					tileSet_[j] = [];
				}
				tileSet_[j][i] = this.tileSet[rowCount-i-1][j];
			}
		}
		this.tileSet = tileSet_;
		this.tileBlockWidth = this.tileSet[0].length * this.height;
	}

	Tile.prototype.rotate = function()
	{
		_rotate.call(this);
	}

	Tile.prototype.move = function(coords)
	{
		var _this = this;
		_move.call(_this, coords);
	}

	return Tile;
})()