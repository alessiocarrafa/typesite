function Scheduler()
{
	var queue = [];
	var timer = null;

	this.getNext = function()
	{
		var item = queue.shift();
		if( item )
		{
			timer = setTimeout( function()
			{
				item.callback.call( item.self );
				timer = null;
				this.getNext();
			}, item.delay );
		}
	};

	this.schedule = function( delay, callback, self )
	{
		queue.push({
			callback: callback,
			delay: delay,
			self: self
		});

		if( !timer ) this.getNext();

		return this;
	};
}