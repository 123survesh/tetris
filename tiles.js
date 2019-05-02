/*
	Dependency
	tile_map json from assets.js

*/
var Tile = (function () {
    var rotationDirectionMap = {
        "clock": 1,
        "antiClock": 0
    }

    function Tile(config) {
        this.x = config.coords.x;
        this.y = config.coords.y;
        this.height = config.dimension.h;
        _init.call(this);
    }

    function _init() {
        var random_number = Math.floor(Math.random()*12);

        this.tileSet = window.tile_map[random_number];
        if (!this.tileSet) {
            this.tileSet = window.tile_map[random_number];
        }
        console.log("TileSet Number: "+random_number);

        _initRCCount.call(this);

        if (this.midY) {
            if (_checkRow(this.tileSet[0])) {
                this.y = (this.midY * this.height) - this.height;
            }
        }
        this.mappedTileSet = [];
        _mapTileSet.call(this);
        this.color = window.colorMap[Math.floor(10 * Math.random())] || 1;
    }

    function _checkRow(arr) {
        var arrLength = arr.length;
        for (var i = 0; i < arrLength; i++) {
            if (arr[i])
                return true;
        }
        return false;
    }

    function _initRCCount() {
        var rows = Object.keys(this.tileSet)
        this.rowCount = rows.length;
        this.columnCount = this.tileSet[rows[0]].length;
        this.midY = Math.ceil(this.rowCount / 2) - 1;
        this.midX = Math.ceil(this.columnCount / 2) - 1;

    }
    /*
    	Must change this to make the center 11 block this.x and this.y
    */
    function _mapTileSet() {
        if (this.tileSet) {
            var tileSet_ = {};
            for (var i = 0; i < this.rowCount; i++) {

                if (!tileSet_[i]) {
                    tileSet_[i] = {};
                }
                for (var j = 0; j < this.columnCount; j++) {

                    tileSet_[i][j] = {};

                    if (this.tileSet[i][j]) {
                        tileSet_[i][j].x = (j <= this.midX) ? this.x - (this.midX - j) * this.height : this.x + (j - this.midX) * this.height;
                        tileSet_[i][j].y = (i <= this.midY) ? this.y - (this.midY - i) * this.height : this.y + (i - this.midY) * this.height;
                    } else {
                        tileSet_[i][j] = 0;
                    }
                }
            }
            this.mappedTileSet = tileSet_;

        }
    }

    function _move(coords) {
        this.x = (typeof coords.x == "number") ? coords.x : this.x;
        this.y = (typeof coords.y == "number") ? coords.y : this.y;
        _mapTileSet.call(this);
    }

    function _rotate(direction) {
        var tileSet_ = {};
        // var mappedTileSet_ = {};
        var rows = Object.keys(this.tileSet);
        var rowCount = rows.length;
        for (var i = 0; i < rowCount; i++) {
            var column = this.tileSet[rows[i]];
            var columnCount = column.length;
            for (var j = 0; j < columnCount; j++) {
                // var subtractValue = rowCount;
                var one, two, one_, two_;
                if (rotationDirectionMap[direction]) {
                    one = j;
                    two = i;
                    one_ = rowCount - i - 1
                    two_ = one;
                } else {
                    one = j;
                    two = i;
                    one_ = i;
                    two_ = columnCount - j - 1;
                }
                if (!tileSet_[one]) {
                    tileSet_[one] = [];
                    // mappedTileSet_[one] = {};
                }
                // console.log("one_ = "+one_+" two_ = "+two_);
                tileSet_[one][two] = this.tileSet[one_][two_];


                // mappedTileSet_[one][two] = {};

                // if (tileSet_[one][two]) {
                //     // mappedTileSet_[one][two].x = (two * this.height) + this.x;
                //     // mappedTileSet_[one][two].y = (one * this.height) + this.y;
                //     mappedTileSet_[one][two].x = (one_ <= this.midX) ? this.x - (this.midX - one_) * this.height : this.x + (one_ - this.midX) * this.height;
                //     mappedTileSet_[one][two].y = (two_ <= this.midY) ? this.y - (this.midY - two_) * this.height : this.y + (two_ - this.midY) * this.height;
                // } else {
                //     mappedTileSet_[one][two] = 0;
                // }
            }
        }
        this.tileSet = tileSet_;
        _initRCCount.call(this);
        _mapTileSet.call(this);
        // this.mappedTileSet = mappedTileSet_;
        // this.tileBlockWidth = this.tileSet[0].length * this.height;
    }

    Tile.prototype.rotate = function (direction) {
        direction = direction || "clock";
        _rotate.call(this, direction);
    }

    Tile.prototype.move = function (coords) {
        var _this = this;
        _move.call(_this, coords);
    }

    return Tile;
})()