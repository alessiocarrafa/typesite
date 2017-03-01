( function($){

	$(document).ready(function()
	{

		var seq = [];

		$('#player_data').children().each(
			function()
			{
				var curr = $( this );

				var wait	= parseInt( curr.attr('wait') );
				var delay	= parseInt( curr.attr('delay') );
				var inline	= curr.attr('inline') == 'true'; 
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

							/*var dom_line;

							if( !inline )	dom_line = $('<p/>').addClass('dom_line');
							else			dom_line = $('#player_area .dom_line').last();*/
							var dom_line = inline ? $('#player_area .dom_line').last() : $('<p/>').addClass('dom_line');

							$('#player_area').append( dom_line );

							if( delay )
							{
								for( var x = 0; x < text_len; x++ )
								{
									sub_seq.push( ( function( args )
									{
										var sub_dfd = $.Deferred();

										setTimeout(
											function( param )
											{
												console.log( param.txt[param.pos] );
												dom_line[0].innerHTML += param.txt[param.pos];
												sub_dfd.resolve();
											}, args.delay, args
										);

										return sub_dfd.promise();
									} ).bind( null, { txt : text, pos: x, delay : delay } ) );
								}
							}
							else
							{
								dom_line[0].innerHTML = text;
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

