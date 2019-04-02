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
		this.mappedTileSet = [];
		_mapTileSet.call(this);
		this.tileBlockWidth = this.tileSet[0].length * this.height;

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
		this.x = coords.x || this.x;
		this.y = coords.y || this.y;
		_mapTileSet.call(this);
	}

	function _rotate()
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
				if(!tileSet_[j])
				{
					tileSet_[j] = [];
					mappedTileSet_[j] = {};
				}

				tileSet_[j][i] = this.tileSet[rowCount-i-1][j];
				

				mappedTileSet_[j][i] = {};

				if(tileSet_[j][i])
				{
					mappedTileSet_[j][i].x = (i*this.height) + this.x;
					mappedTileSet_[j][i].y = (j*this.height) + this.y;
				}
				else
				{
					mappedTileSet_[j][i] = 0;
				}
			}
		}
		this.tileSet = tileSet_;
		this.mappedTileSet = mappedTileSet_;
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