( function($){

	"use strict";
	var copy = function (a) {
		return Array.prototype.slice.call(a);
	};

	/**
		Handle a sequence of methods, stopping on failure by default
		@param Array<Function> chain    List of methods to execute.  Non-deferred return values will be treated as successful deferreds.
		@param Boolean  continueOnFailure   Continue executing even if one of the returned deferreds fails.
		@returns Deferred
	*/
	$.sequence = function (chain, continueOnFailure) {
		var handleStep, handleResult,
			steps = copy(chain),
			def = new $.Deferred(),
			defs = [],
			results = [];
		handleStep = function () {
			if (!steps.length) {
				def.resolveWith(defs, [ results ]);
				return;
			}
			var step = steps.shift(),
				result = step();
			handleResult(
				$.when(result).always(function () {
					defs.push(this);
				}).done(function () {
					results.push({ resolved: copy(arguments) });
				}).fail(function () {
					results.push({ rejected: copy(arguments) });
				})
			);
		};
		handleResult = continueOnFailure ?
				function (result) {
					result.always(function () {
						handleStep();
					});
				} :
				function (result) {
					result.done(handleStep)
						.fail(function () {
							def.rejectWith(defs, [ results ]);
						});
				};
		handleStep();
		return def.promise();
	};

	$(document).ready(function()
	{

		var seq = [];

		$('#player_data').children().each(
			function()
			{
				var curr = $( this );

				var wait	= parseInt( curr.attr('wait') );
				var speed	= parseInt( curr.attr('speed') );
				var text	= curr.text();

				seq.push( function()
				{
					var dfd = $.Deferred();

					setTimeout(
						function()
						{
							console.log( text );

							var sub_seq = [];

							var text_len = text.length;

							var x = 0;

							for( x = 0; x < text_len; x++ )
							{
								sub_seq.push( ( function( args )
								{
									var sub_dfd = $.Deferred();

									setTimeout(
										function( param )
										{
											console.log( param.txt[param.pos] );
											sub_dfd.resolve();
										}, args.delay, args
									);

									return sub_dfd.promise();
								} ).bind( null, { txt : text, pos: x, delay : speed } ) );
							}

							$.sequence( sub_seq ).then( function(){ console.log('SUB DONE!'); dfd.resolve(); });

						}, wait
					);

					return dfd.promise();
				} );
			}
		);

		$.sequence( seq ).then( function(){ console.log('DONE!'); });
	});

} )( jQuery );

