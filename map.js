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
        for (var i = 0; i < this.height; i += this.tileSize) {
        	this.tileMap[i] = {};
            for (var j = 0; j < this.width; j += this.tileSize) {
                this.tileMap[i][j] = 0;
            }
        }
        if (this.setBorder) {
            _setBorder.call(this);
        }
    }

    function _setBorder() {
        var j, i;
        for (j = 0; j < this.width; j += this.tileSize) {
            this.tileMap[0][j] = 1;
        }
        for (i = this.tileSize; i < this.height; i += this.tileSize) {
            this.tileMap[i][0] = 1;
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
                    var coords = row[coulmns[j]];
                    this.tileMap[coords.x][coords.y] = 1;
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
        for (var i = 0; i < rcount; i++) {
            var columns = Object.keys(tileSet[rows[i]]);
            var ccount = columns.length;

            for (var j = 0; j < ccount; j++) {
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
	        if (this.tileMap[coords.x][coords.y] == 0) {
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