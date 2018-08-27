// All needed variables 
var map;
var zoomLevel = 2;
//var zoomLevelPic ;
//var centerPoint = {lat: 25, lng: 10};

var markers;
var markerIcon = 'index/img/icons/pin2.png';
var centerPoint = {lat:29.625829, lng:52.558476} ;
var centerControlDiv;

//var picMarkers= [];
//var picPersGOAN = 'index/img/persepolis_GOAN.jpg';
//var picShirazHafezieh = 'index/img/hafezieh.jpg';
// <-------------------------------------------------------  enter pics here ...
var picDir = "index/img/";
var locationInfo = [
    ['Persepolis, Gathe Of All Nations', 29.936218, 52.889074, 'persepolis_GOAN.jpg',  'https://www.google.ca' ],
    ['Shiraz, Tomb Of Hafez',            29.625829, 52.558476, 'hafezieh.jpg',         'http://www.bbc.com/persian' ],
    /*
    add more locations here on the form :
    [ name, lat, long, img,  gallery link address ]
   
    ..
    */
];

var locations = []; 
//var locationPics =[];    // stores all pics
//var locationPicsOn = []; // stores tures if pic icon is already on
//var locationLables = []; // stores all lables 

//var shiraz_TombOfHafez =  {lat:29.625829, lng:52.558476}; // 29.625829, 52.558476          < Checked >
//locations.push(shiraz_TombOfHafez);

//var persepolis_GOAN =  {lat:29.936218, lng:52.889074}; // 29.936218, 52.889074             < Checked >
//locations.push(persepolis_GOAN);
// <--------------------------------------------------  enter locations here ...



        


        
// ======================================================================================
//	initialize the map with the options
// --------------------------------------------------------------------------------------
function initMap() {

	createMap(); // creates the base map
  createMarkers(); // creates the markers; not shows on the map until create marker clustes 
  createMarkerCluster(); // creates the marker clusters
  	
  //createIconLabels();
  	
	
	
  //map.addListener('zoom_changed', zoomChecker);
    
     
    
  // add a controll to the map (reset)
  centerControlDiv = document.createElement('div');

  var centerControl = new CenterControl(centerControlDiv, map);   
    centerControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);

}


// ======================================================================================
//	Creates a new map with the options 				                                       < Checked >
// --------------------------------------------------------------------------------------
function createMap() {
  var mapCanvas = document.getElementById("map");
  var mapOptions = {
		zoom: zoomLevel,         
    	center: centerPoint,
    	zoomControl: true,
		mapTypeControl: true,   
    	scaleControl: true,
    	streetViewControl: false,
    	rotateControl: true,
    	fullscreenControl: true,     
    	mapTypeControlOptions: {
      		style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
      		mapTypeIds: ['roadmap', 'terrain', 'satellite', 'hybrid'] 
      	}  
  }; 
  map = new google.maps.Map(mapCanvas, mapOptions);
}


// ======================================================================================
//	Creates markers and adds them to the maps		                                       < Checked >
// --------------------------------------------------------------------------------------
function createMarkers() {
    setLocations();
    var myIcon = {
         url: markerIcon, // url
         origin: new google.maps.Point(0,0), // origin
         labelOrigin: new google.maps.Point(50, -10) //OK
    };
    markers = locations.map(
      function(location, i) {
		      var marker = new google.maps.Marker({
  				  position: location,
            title: "Click here to See the image!",
  				  optimized:false,
            //scaledSize: new google.maps.Size(100, 100),
            shape: { coords: [0, 0, 60], type: 'circle' }, 
            /*label: {
                    text: "(?)",
                    color: "#000000",
                    fontSize: "16px",
                    fontWeight: "bold",
                    x: '20',
                    y: '10'
            },*/ 
            animation: google.maps.Animation.DROP,
  			 	  icon: myIcon	
		      });
		      bounce(marker);
		      clickEvent(marker);
		      return marker;
      });
}

// ======================================================================================
//  Populates the locations array                                                     < Checked >
// --------------------------------------------------------------------------------------
function setLocations() {
    for(i=0; i<locationInfo.length; i++) {
        var location =  { lat:locationInfo[i][1], lng:locationInfo[i][2] }; 
        locations.push(location);
    }
}

// ======================================================================================
//  Adds Listeners for mouseover and mouseout events                                       < Checked >
// --------------------------------------------------------------------------------------
function bounce(marker) {
    marker.addListener('mouseover', bounceOver);
    marker.addListener('mouseout', bounceOut);
    function bounceOver() { marker.setAnimation(google.maps.Animation.BOUNCE);}
    function bounceOut() { marker.setAnimation(null);}
}

// ======================================================================================
//  Adds Listeners for click events                                                        < Checked >
// --------------------------------------------------------------------------------------
function clickEvent(marker) {

    marker.addListener('click', mouseClick);
    function mouseClick() {
        var i = getIndexLocationOf(marker);
        var title = locationInfo[i][0];
        var img = picDir+locationInfo[i][3];
        var link = locationInfo[i][4];
        var content = '<b id="b">' + title + '</b>' + '<br>'+
                      '<a href="' + link + '"  title="Click here to see all the pictures">' + 
                          '<img src="' + img + '" style="width:200px; padding-top:8px; ">'+
                      '</a>';
        var infowindow = new google.maps.InfoWindow();
        infowindow.setContent(content);
        infowindow.open(map, marker);
    }
}

// ======================================================================================
//  use for finding locations in the locations array                                       < Checked >
// --------------------------------------------------------------------------------------
function getIndexLocationOf( marker ) {
  var location = marker.getPosition();
  var lat = parseFloat(location.lat()).toFixed(5); //ok
  var lng = parseFloat(location.lng()).toFixed(5); //ok
  var latP;
  var lngP;
  var index = -1;
  for(i=0; i<locations.length; i++) {
    latP = parseFloat(locations[i].lat).toFixed(5); // ok
    lngP = parseFloat(locations[i].lng).toFixed(5); // ok
    if ( lat == latP && lng == lngP ){
      index = i;
    }
  }
  return index;
}


// ======================================================================================
//	Creates marker ckuster and adds all the markers into it		                           < Checked >
// --------------------------------------------------------------------------------------
function createMarkerCluster() {
 	markerCluster = new MarkerClusterer(map, markers,
            {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});

}





// ======================================================================================
//	Removes all of the markers in the array					 	                            < Checked >
// --------------------------------------------------------------------------------------
function deleteAllMarkers(markers) {
	for(i=0; i<markers.length; i++) {
		deleteMarker(markers[i]);
	}
	markers = [];
}


// ======================================================================================
//  Removes the marker                                                       < Checked >
// --------------------------------------------------------------------------------------
function deleteMarker(marker) {
  marker.setMap(null);
  marker = null;
}


// ======================================================================================
//  creates the reset control of the map                                                   < Checked >
// --------------------------------------------------------------------------------------
function CenterControl(controlDiv, map) {

        // Set CSS for the control border.
        var controlUI = document.createElement('div');
        controlUI.style.backgroundColor = '#fff';
        controlUI.style.border = '2px solid #fff';
        controlUI.style.borderRadius = '3px';
        controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
        controlUI.style.cursor = 'pointer';
        controlUI.style.marginBottom = '22px';
        controlUI.style.textAlign = 'center';
        controlUI.title = 'Click to reset the map';
        controlDiv.appendChild(controlUI);

        // Set CSS for the control interior.
        var controlText = document.createElement('div');
        controlText.style.color = 'rgb(25,25,25)';
        controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
        controlText.style.fontSize = '16px';
        controlText.style.lineHeight = '38px';
        controlText.style.paddingLeft = '5px';
        controlText.style.paddingRight = '5px';
        controlText.innerHTML = 'Reset';
        controlUI.appendChild(controlText);

        // Setup the click event listeners: simply set the map to Chicago.
        controlUI.addEventListener('click', function() {
        	//var chicago = {lat: 41.85, lng: -87.65};
          	//map.setCenter(chicago);
          	zoomLevel = map.getZoom();
          	centerPoint = map.getCenter();
          	initMap();
          	
        });     
}





//window.alert("d: "+d);


