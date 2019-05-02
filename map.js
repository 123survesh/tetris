var TileMap = (function () {

    function TileMap(config) {
        this.height = config.dimension.board.h;
        this.width = config.dimension.board.w;
        this.tileSize = config.dimension.tile.h;
        this.setBorder = config.setBorder || true;

        _init.call(this);
    }

    function _init() {
        this.tileMap = {};
        var width = this.width + this.tileSize;
        var height = this.height + this.tileSize;
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
        var width = this.width + this.tileSize;
        var height = this.height + this.tileSize;
        // var finalHeightIndex = (Math.floor((this.height+this.tileSize)/this.tileSize))*this.tileSize;
        // var finalWidthIndex = (Math.floor((this.width+this.tileSize)/this.tileSize))*this.tileSize;
        for (j = -this.tileSize; j < width; j += this.tileSize) {
            if((j == -this.tileSize) || (j+this.tileSize > width))
            {
                this.tileMap[-this.tileSize][j] = 9;
            }
            this.tileMap[this.height][j] = 9;
        }
        for (i = 0; i < height; i += this.tileSize) {
            this.tileMap[i][-this.tileSize] = 9;
            this.tileMap[i][this.width] = 9;
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
                    if (typeof coords == "object")
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
        for (var i = rcount - 1; i > -1; i--) {
            var columns = Object.keys(tileSet[rows[i]]);
            var ccount = columns.length;

            for (var j = ccount - 1; j > -1; j--) {
                if (tileSet[rows[i]][columns[j]]) {
                    if (!_checkTile.call(this, tileSet[rows[i]][columns[j]])) {
                        return false;
                    }
                }
            }

        }
        return true;
    }

    function _checkTile(coords) {
        if (coords) {
            if (this.tileMap[coords.y][coords.x] == 0) {
                return true;
            }
            return false;
        }
        return true;
    }

    function _checkForFullLines() {
        var i, j, start = [],
            end = [];
        var buffer = [];
        start[0] = (this.setBorder) ? (this.height - this.tileSize) : this.height;
        end[0] = 0;
        // start[1] = 0;
        // end[1] = (this.setBorder) ? (this.width - this.tileSize) : this.width;
        for (i = start[0]; i >= end[0]; i -= this.tileSize) {
            // var fullLine = true;
            // for (j = start[1]; j <= end[1]; j += this.tileSize) {
            //     if (_checkTile.call(this, { x: j, y: i })) {
            //         fullLine = false;
            //     }
            // }
            var fullLineFlag = _checkForFullLine.call(this, i);
            if (fullLineFlag) {
                buffer.push(i);
            }
        }
        return buffer;

    }

    function _checkForFullLine(line)
    {
        var start = 0;
        var end = (this.setBorder) ? (this.width - this.tileSize) : this.width;
        var fullLine = true;
        for (var j = start; j <= end; j += this.tileSize) {
            if (_checkTile.call(this, { x: j, y: line })) {
                fullLine = false;
                return fullLine;
            }
        }
        return fullLine;
    }

    function _unsetRow(row) {

        var start, end;
        start = 0;
        end = (this.setBorder) ? (this.width - this.tileSize) : this.width;
        for (var i = start; i < end; i += this.tileSize) {
            this.tileMap[row][i] = 0;

        }
    }

    function _moveRowsDown(row) {
        for (var i = row; i > 0; i -= this.tileSize) {
            this.tileMap[i] = JSON.parse(JSON.stringify(this.tileMap[i - this.tileSize]));
        }
        _unsetRow.call(this, i);
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

    TileMap.prototype.checkForFullLines = function () {
        return _checkForFullLines.call(this);
    }

    TileMap.prototype.moveDownOneRow = function (row) {
        _moveRowsDown.call(this, row);
    }

    return TileMap;
})();