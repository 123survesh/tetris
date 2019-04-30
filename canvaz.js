var Canvaz = (function () {
    function Canvaz(config) {
        this.target = config.target;
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.height = config.dimension.h;
        this.width = config.dimension.w;
        this.classes = config.classes;
        _init.call(this);
    }

    function _init() {
        this.canvas.height = this.height;
        this.canvas.width = this.width;
        classAdder(this.canvas, this.classes);
        _populateTarget.call(this);
    }

    function _populateTarget() {
        this.target.appendChild(this.canvas);
    }

    function _unPopulateTarget() {
        this.target.removeChild(this.canvas);
    }

    function _show() {
        this.canvas.style.display = "inline-block";
    }

    function _hide() {
        this.canvas.style.display = "none";
    }

    return Canvaz;
})();