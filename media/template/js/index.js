window.addEventListener('load', function() {
	"use strict";
	//Initialize FastClick plugin
    FastClick.attach(document.body);
}, false);

//Declare variables
var myScroll, wrapper, $sectionTitle, $btnLocation, activeLi = 1;

//Set variables
body = document.getElementById("body"),
wrapper = document.getElementById("wrapper");
$sectionTitle = $('h1.sectionTitle');
$btnLocation = $('a#location');

var xhReq = new XMLHttpRequest();
var heightBody = window.innerHeight-50;

var app = {

	initialize: function() {

		//Creation of the css class
		var style = document.createElement('style');
		style.type = 'text/css';
		style.innerHTML = '.cssClass { position:absolute; z-index:2; left:0; top:50px; width:100%; height: '+heightBody+'px; overflow:auto;}';
		document.getElementsByTagName('head')[0].appendChild(style);

		//Add the css class
		wrapper.className = 'cssClass';

		//Load default option
		xhReq.open("GET", "options/option1.html", false);
		xhReq.send(null);
		document.getElementById("sectionContent").innerHTML=xhReq.responseText;

		//Add default active class to the menu
		$( "ul.ulMenu li:nth-child(1)" ).addClass( "active" );

		//Initialize slides in HOME section
		$("#slides").slidesjs({
	    	width: 940,
	    	height: 528,
			navigation: {
				active: false
			},
			pagination: {
				active: false
			},
			play: { auto: true}
	    });

		//Creation of the scroll using iScroll plugin
		myScroll = new iScroll('wrapper', { hideScrollbar: true });

		//Add default header title
		$sectionTitle.text('Home');
		this.bindEvents();
	},
	bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
    	//Only for iOS 7 in the Phonegap Project
        if (parseFloat(window.device.version) >= 7.0)
		{
			$('div#header').css('padding-top','20px');
			$('div#header .btn').css('margin-top','20px');
			$('div#header .location').css('margin-top','20px');
			$('div#sectionContent').css('margin-top','30px');
			$('div#wrapper').css('top','70px');
		}
    }

};

function menu(option){

	//Remove previous active class
	$( "ul.ulMenu li:nth-child("+activeLi+")" ).removeClass( "active" );

	//Add active class to the current option
	$( "ul.ulMenu li:nth-child("+option+")" ).addClass( "active" );

	//Save active option
	activeLi = option;

	//Read by ajax the page
	if (option==1){
		xhReq.open("GET", "/register/", false);
	} else {
		xhReq.open("GET", "options/option"+option+".html", false);
	}
	xhReq.send(null);
	document.getElementById("sectionContent").innerHTML=xhReq.responseText;

	if(option == 1){
		setTitle('Home');
		$btnLocation.hide();
		//Initialize slides
		$("#slides").slidesjs({
	    	width: 940,
	    	height: 528,
			navigation: {
				active: false
			},
			pagination: {
				active: false
			},
			play: { auto: true}
    	});
		myScroll.enable();
	}
	else if(option == 2){
		$btnLocation.hide();
		setTitle('About Us');
		myScroll.enable();
	}
	else if(option == 3){
		$btnLocation.hide();
		setTitle('Blog');
		myScroll.enable();
	}
	else if(option == 4){
		setTitle('Gallery');
		myScroll.disable();
		//Initialize PhotoSwipe plugin for gallery
		var myPhotoSwipe = Code.PhotoSwipe.attach( window.document.querySelectorAll('#Gallery a'), { enableMouseWheel: false , enableKeyboard: false } );
	}
	else if(option == 5){
		setTitle('Contact');
		myScroll.disable();
		mapObject.init();
	}

	//Refresh of the iScroll plugin
	myScroll.refresh();
	myScroll.scrollTo(0,0);

}

function setTitle(title){
	$sectionTitle.text(title);
}

//Map

var mapObject = {

	init : function(){
		var map, markers = [], openInfoWindow, bounds = new google.maps.LatLngBounds();
		$('div#mapCanvas').css({'height': heightBody - (heightBody/2) + 10 + 'px'});
		var markers = [];
		var latlng = new google.maps.LatLng(33.2117,-117.3258);
		var myOptions = {
			zoom: 16,
			center: latlng,
			disableDefaultUI: true,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		map = new google.maps.Map(document.getElementById("mapCanvas"), myOptions);
		this.getMarkers();
	},

	getMarkers: function(){
		//Set a hardcoded marker
		mapObject.addMarker(
			'43.978518',
			'15.383649',
			'Contact',
			'<h3>Contact me</h3><br><p>I am at this heart shaped island.</p>',
			1,
			false);
		$btnLocation.show();
	},

	addMarker: function(lat,lng,title,description,id,position){
		var myLatlng = new google.maps.LatLng(lat, lng);

		var marker = new google.maps.Marker({
			position: myLatlng,
			map: map,
			animation: google.maps.Animation.DROP,
			title: title
		});

		marker.infowindow = new google.maps.InfoWindow({
			content: description
		});

		marker.id = id;

		google.maps.event.addListener(marker, 'click', function() {

			if(marker.title != '')
			{
				marker.infowindow.open(map, marker);
			}
		});

		markers.push(marker);
	}

};

//When user resize the window in the browser, or in mobile change the position, adjust the height of the content
$( window ).resize(function() {
  $('#wrapper').css('height',window.innerHeight-50);
});
