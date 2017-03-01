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
				var clear	= curr.attr('clear') == 'true';
				var text	= curr.text();

				seq.push( function()
				{
					var dfd = $.Deferred();

					if( !clear )
					{
						setTimeout(
							function()
							{
								var sub_seq = [];

								var dom_line = inline ? $('#player_area .dom_line').last() : $('<span/>').addClass('dom_line');

								var indicator = $('#console_indicator').clone();

								$('#console_indicator').remove();

								$('#player_area').append( dom_line, indicator, inline ? $('<br/>') : null );

								if( delay )
								{
									for( var x = 0; x < text.length; x++ )
									{
										sub_seq.push( ( function( args )
										{
											var sub_dfd = $.Deferred();

											setTimeout(
												function( param )
												{
													dom_line[0].innerHTML += param.txt[param.pos];
													document.body.scrollTop = document.body.scrollHeight;
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
					}
					else //clear command
					{
						setTimeout(
							function( param )
							{
								console.log('CLEARED');
								var indicator = $('#console_indicator').clone();
								$('#player_area').empty().append( indicator );
								dfd.resolve();
							}, wait
						);
					}

				

					return dfd.promise();
				} );
			}
		);

		$.sequence( seq ).then( function(){ console.log('DONE!'); });
	});

} )( jQuery );

