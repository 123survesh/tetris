var userController = (function(){
	var _direction = {
		"up": 1,
		"right": 2,
		"down": 3,
		"left": 4,
		"tap": 9
	}

	function userController(config)
	{
		this.target = config.target || window;
		this.callbacks = config.callbacks || function(){};
		this.touchMoveFlag = false;
		_init.call(this);
	}

	function _init()
	{
		  this.coords = {
		  	start:{x:0,y:0},
		  	move:{x:0,y:0}
		  }
		  this.target.addEventListener("touchstart", _handleStart.bind(this));
		  this.target.addEventListener("touchend", _handleEnd.bind(this));
		  this.target.addEventListener("touchcancel", _handleCancel.bind(this));
		  this.target.addEventListener("touchmove", _handleMove.bind(this));
	}


	function _handleTouch(e)
	{
		console.log(e);
	}

	function _handleStart(e)
	{
		e.stopPropagation();
		e.preventDefault();
		this.coords.start.x = e.touches[0].pageX;
		this.coords.start.y = e.touches[0].pageY;
		this.touchMoveFlag = false;
	}

	function _handleMove(e)
	{
		var d = "";
		e.stopPropagation();
		// e.preventDefault();
		this.coords.move.x = e.touches[0].pageX - this.coords.start.x;
		this.coords.move.y = e.touches[0].pageY - this.coords.start.y;
		var xFlag = (Math.abs(this.coords.move.x) > Math.abs(this.coords.move.y));
		if(Math.abs(this.coords.move.x) > 30 || Math.abs(this.coords.move.y) > 30)
		{
			this.touchMoveFlag = true;
			if(xFlag)
			{
				if(this.coords.move.x > 0)
				{
					d = "right";
				}
				else
				{
					d = "left";
				}
				
			}
			else
			{
				if(this.coords.move.y > 0)
				{
					d = "down";
				}
				else
				{
					d = "up";
				}
			}
			this.coords.start.x = e.touches[0].pageX;
			this.coords.start.y = e.touches[0].pageY;
			this.coords.move.x = 0;
			this.coords.move.y = 0;
		}
		if(d)
			_callTheCallBacks.call(this, e, {direction_name:d, direction: _direction[d]});
	}

	function _handleEnd(e)
	{
		e.stopPropagation();
		e.preventDefault();
		
		if(!this.touchMoveFlag)
		{
			_callTheCallBacks.call(this,e , {direction_name:"tap", direction: _direction["tap"]});		
		}

		this.coords = {
		  	start:{x:0,y:0},
		  	move:{x:0,y:0}
		}
	}

	function _callTheCallBacks(event, config)
	{
		switch(typeof this.callbacks)
		{
			case "function":
				this.callbacks(event, config);
				break;
			case "object":
				var keys = Object.keys(this.callbacks);
				var kCount = keys.length;
				var i;
				for(i = 0; i< kCount;i++)
				{
					this.callbacks[keys[i]](event, config);
				}
		}
	}

	var _handleCancel = _handleEnd;
	return userController;
})();