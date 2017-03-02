( function($){

	$(document).ready(function()
	{
		var seq			= [];
		var player_area	= $('#player_area');

		$('#player_data').children().each(
			function()
			{
				var wait		= parseInt( this.getAttribute('wait') );
				var delay		= parseInt( this.getAttribute('delay') );
				var rollback	= parseInt( this.getAttribute('rollback') );
				var inline		= this.getAttribute('inline') == 'true';
				var clear		= this.getAttribute('clear') == 'true';
				var text		= this.innerHTML;

				seq.push( function()
				{
					var dfd = $.Deferred();

					var oldIndicator	= $('#console_indicator');
					var last_dom_line	= $( '.dom_line', player_area ).last();

					if( !clear )
					{
						setTimeout(
							function()
							{
								var sub_seq = [];

								var dom_line = null;

								if( inline )
								{
									dom_line = last_dom_line;

									player_area.append( dom_line, oldIndicator.remove().clone() );
								}
								else if( rollback )
								{
									dom_line = last_dom_line;
								}
								else
								{
									dom_line = $('<span/>').addClass('dom_line');

									var child_num = player_area[0].childNodes.length;

									player_area.append( child_num > 1 ? $('<br/>') : null, dom_line, oldIndicator.remove().clone() );
								}

								if( delay )
								{
									if( text && text.length )
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
									if( rollback )	//delete command
									{
										for( var x = 0; x < rollback; x++ )
										{
											sub_seq.push( ( function( args )
											{
												var sub_dfd = $.Deferred();

												setTimeout(
													function( param )
													{
														dom_line[0].innerHTML = dom_line[0].innerHTML.slice( 0, -1 );
														document.body.scrollTop = document.body.scrollHeight;
														sub_dfd.resolve();
													}, args.delay, args
												);

												return sub_dfd.promise();
											} ).bind( null, { delay } ) );
										}
									}
								}
								else
								{
									dom_line[0].innerHTML = text;
								}

								$.sequence( sub_seq ).then( function(){ console.debug('SUBROUTINE DONE!'); dfd.resolve(); });

							}, wait
						);
					}
					else //clear command
					{
						setTimeout(
							function( param )
							{
								player_area.empty().append( oldIndicator.clone() );
								dfd.resolve();
							}, wait
						);
					}

					return dfd.promise();
				} );
			}
		);

		$.sequence( seq ).then( function(){ console.debug('DONE!'); });
	});

} )( jQuery );

