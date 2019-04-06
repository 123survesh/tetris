var TileMap = (function () {

    function TileMap(config) {
        this.height = config.height;
        this.width = config.width;
        this.tileSize = config.tileSize;
        this.setBorder = config.setBorder || true;

        _init.call(this);
    }

    function _init() {
        this.tileMap = {};
        var width = this.width+this.tileSize;
        var height = this.height+this.tileSize;
        for (var i = -this.tileSize; i < height; i += this.tileSize) {
        	this.tileMap[i] = {};
            for (var j = -this.tileSize; j < width; j += this.tileSize) {
                this.tileMap[i][j] = 0;
            }
        }
        if (this.setBorder) {
            _setBorder.call(this);
        }
    }

    function _setBorder() {
        var j, i;
        var width = this.width+this.tileSize;
        var height = this.height+this.tileSize;
        for (j = -this.tileSize; j < width; j += this.tileSize) {
            this.tileMap[-this.tileSize][j] = 1;
            this.tileMap[this.width][j] = 1;
        }
        for (i = 0; i < height; i += this.tileSize) {
            this.tileMap[i][-this.tileSize] = 1;
            this.tileMap[i][this.height] = 1;
        }
    }

    function _setTileSet(config) {
        var proceed = true;
        var tileSet = config.tileSet;
        if (config.strictMode) {
            if (!_checkTileSet.call(this, tileSet)) {
                proceed = false;
            }
        }
        if (proceed) {
            var rows = Object.keys(tileSet);
            var rcount = rows.length;
            for (var i = 0; i < rcount; i++) {
                var columns = Object.keys(tileSet[rows[i]]);
                var ccount = columns.length;

                var row = tileSet[rows[i]];
                for (var j = 0; j < ccount; j++) {
                    var coords = row[columns[j]];
                    if(typeof coords == "object")
                    	this.tileMap[coords.y][coords.x] = 1;
                }
            }
            return 1;
        }
        return 0;
    }

    /*
		coords = {
			0: [{x,y},{x,y}]
		}
    */
    function _checkTileSet(tileSet) {
        var rows = Object.keys(tileSet);
        var rcount = rows.length;
        for (var i = rcount-1; i > -1; i--) {
            var columns = Object.keys(tileSet[rows[i]]);
            var ccount = columns.length;

            for (var j = ccount-1; j > -1; j--) {
                if (!_checkTile.call(this, tileSet[rows[i]][columns[j]])) {
                    return false;
                }
            }

        }
        return true;
    }

    function _checkTile(coords) {
    	if(coords)
    	{
	        if (this.tileMap[coords.y][coords.x] == 0) {
	            return true;
	        }
        	return false;
    	}
    	return true;
    }


    TileMap.prototype.checkTileSet = function (config) {
        return _checkTileSet.call(this, config.tileSet);
    }

    TileMap.prototype.checkTile = function (config) {
        return _checkTile.call(this, config.coords);
    }

    TileMap.prototype.setTileSet = function (config) {
        return _setTileSet.call(this, config);
    }


    return TileMap;
})();