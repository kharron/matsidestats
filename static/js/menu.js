
/*	Define Click Event for Mobile */
	if( 'ontouchstart' in window ){ var click = 'touchstart'; }
	else { var click = 'click'; }

	/*	Reveal Menu */
	$('a.button').on(click, function(){
		$('#header').removeClass('borderRadius');
		if( !$('div.content').hasClass('inactive') ){
		
			// Slide and scale content
			$('div.content').addClass('inactive');
			setTimeout(function(){ $('div.content').addClass('flag'); }, 100);
			
			// Slide in menu links
			var timer = 0;
			$.each($('li'), function(i,v){
				timer = 40 * i;
				setTimeout(function(){
					$(v).addClass('visible');
				}, timer);
			});
		}
	});
	
	/*	Close Menu */
	function closeMenu() {
		$('#header').addClass('borderRadius');
		// Slide and scale content
		$('div.content').removeClass('inactive flag');
		
		// Reset menu
		setTimeout(function(){
			$('li').removeClass('visible');
		}, 300);
	}
	
	$('div.content').on(click, function(){
		if( $('div.content').hasClass('flag') ){
			closeMenu();
		}
	});

	$('li a').on(click, function(e){
		//e.preventDefault();
		closeMenu();
	});