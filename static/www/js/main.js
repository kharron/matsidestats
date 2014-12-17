window.jQuery(document).ready(function($){
	
	'use strict';
	
	//-------------------- jQuery smooth scrolling --------------------//
	
	$('a.smooth-scroll').on('click', function(event) {
		var $anchor		= $(this);
		var offsetTop	= '';
		var elemHeight	= parseInt($('#navigation').height() - 1, 0);
		
		if ($(document).width() >= 769) {
			offsetTop = parseInt($($anchor.attr('href')).offset().top - elemHeight, 0);
		} else {
			offsetTop = parseInt($($anchor.attr('href')).offset().top, 0);
		}
		
		$('html, body').stop().animate({
			scrollTop: offsetTop
		}, 2000,'easeInOutExpo');
		
		event.preventDefault();
	});
	
	//-------------------- End jQuery smooth scrolling --------------------//
	
	
	
	//-------------------- Navigation menu scrollspy to anchor section --------------------//
	
	$('body').scrollspy({
		target: '#navigation .navbar-collapse',
		offset: parseInt($('#navigation').height(), 0)
	});
	
	//-------------------- End navigation menu scrollspy to anchor section --------------------//
	
	
	
	//-------------------- jQuery tooltips --------------------//
	
	$('.btn-tooltip').tooltip();
	$('.btn-popover').popover();
	
	//-------------------- End jQuery tooltips --------------------//
	
	
	
	//-------------------- Slider with Slick carousel --------------------//
	
	// Header slider
	$('#header .carousel-slider').slick({
		arrows: false,
		dots: true,
		autoplay: true,
		autoplaySpeed: 5000,
		draggable: false,
		responsive: [{
			breakpoint: 767,
			settings: { draggable: true }
		}]
	});
	
	// Gallery slider
	$('.carousel-slider.gallery-slider').slick({
		arrows: false,
		dots: true,
		slidesToShow: 4,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 5000,
		draggable: false,
		responsive: [{
			breakpoint: 767,
			settings: {
				slidesToShow: 1,
				draggable: true
			}
		}]
	});
	
	// General slider
	$('.carousel-slider.general-slider').each(function() {
		$(this).slick({
			adaptiveHeight: true,
			draggable: false,
			responsive: [{
				breakpoint: 767,
				settings: { draggable: true }
			}]
		});
	});
	
	//-------------------- End slider with Slick carousel --------------------//
	
	
	
	//-------------------- Preview images popup gallery with Fancybox --------------------//
	
	$('.fancybox').fancybox({
		loop: false	
	});
	
	//-------------------- End preview images popup gallery with Fancybox --------------------//
	
	
	
	//-------------------- jQuery placeholder for IE --------------------//
	
	$('input, textarea').placeholder();
	
	//-------------------- End jQuery placeholder for IE --------------------//
	
	
	
	//-------------------- Embed animation effects to html elements with CSS3 --------------------//
	
	var topOffset = $(window).scrollTop() + ($(window).height()*0.8);
		
	$('.animation, .animation-visible').each(function() {
		var imagePos = $(this).offset().top;
		if (imagePos < topOffset) { $(this).addClass('animated ' + $(this).attr('data-animation')); }
	});
	
	$(window).scroll(function() {
		var topOffset = $(window).scrollTop() + ($(window).height()*0.8);
		
		$('.animation, .animation-visible').each(function() {
			var imagePos = $(this).offset().top;
			if (imagePos < topOffset) { $(this).addClass('animated ' + $(this).attr('data-animation')); }
		});
	});
	
	$(window).resize(function() {
		$(window).scroll(function() {
			var topOffset = $(window).scrollTop() + ($(window).height()*0.8);
			
			$('.animation, .animation-visible').each(function() {
				var imagePos = $(this).offset().top;
				if (imagePos < topOffset) { $(this).addClass('animated ' + $(this).attr('data-animation')); }
			});
		});
	});
	
	//-------------------- End embed animation effects to html elements with CSS3 --------------------//
	
	
	
	//-------------------- Parallax background effect with jQuery --------------------//
	
	$('.wrap-bg.wrap-bg-parallax').each(function() {
		var $bgobj	= $(this);
		var $img	= $bgobj.data('image-src');
		
		if ($img !== undefined && $img !== '') {
			$bgobj.css('background-image', 'url(' + $img + ')');
		}
		
		$(window).bind('scroll resize', function() {
			var yPos	= -(($(window).scrollTop() - $bgobj.offset().top) / 10);
			var coords	= '50% ' + yPos + 'px';
			
			if ($(document).width() >= 769) {
				$bgobj.css({ backgroundPosition: coords });
			} else {
				$bgobj.css({ backgroundPosition: 'center center' });
			}
		});
	});
	
	//-------------------- End parallax background effect with jQuery --------------------//
	
	
	
	//-------------------- Number ticker animation --------------------//
	
	$('.dotstheme_counter > h4').counterUp({
		delay: 10,
		time: 3000
	});
	
	//-------------------- End number ticker animation --------------------//
	
	
	
	//-------------------- Contact form submit process --------------------//
	
	/*
	$('.dotstheme-form-contact').submit(function() {
		var $form		= $(this);
		var submitData	= $form.serialize();
		var $email		= $form.find('input[name="email"]');
		var $name		= $form.find('input[name="name"]');
		var $message	= $form.find('textarea[name="message"]');
		var $submit		= $form.find('input[name="submit"]');
		var $dataStatus	= $form.find('.data-status');
		
		$email.attr('disabled', 'disabled');
		$name.attr('disabled', 'disabled');
		$message.attr('disabled', 'disabled');
		$submit.attr('disabled', 'disabled');
		
		$dataStatus.show().html('<div class="alert alert-info"><strong>Loading...</strong></div>');
		
		$.ajax({ // Send an offer process with AJAX
			type: 'POST',
			url: 'process-contact.php',
			data: submitData + '&action=add',
			dataType: 'html',
			success: function(msg){
				if (parseInt(msg, 0) !== 0) {
					var msg_split = msg.split('|');
					if (msg_split[0] === 'success') {
						$email.val('').removeAttr('disabled');
						$name.val('').removeAttr('disabled');
						$message.val('').removeAttr('disabled');
						$submit.removeAttr('disabled');
						$dataStatus.html(msg_split[1]).fadeIn();
					} else {
						$email.removeAttr('disabled');
						$name.removeAttr('disabled');
						$message.removeAttr('disabled');
						$submit.removeAttr('disabled');
						$dataStatus.html(msg_split[1]).fadeIn();
					}
				}
			}
		});
		
		return false;
	});
	*/
	
	//-------------------- End contact form submit process --------------------//

});
