// All needed variables
var map;
var zoomLevel = 2;
var markers;
var markerIcon = 'travelMap/img/icons/pin2.png';
var picDir = "travelMap/img/";
var centerPoint = {lat:25, lng:10} ;
var centerControlDiv;

// <-------------------------------------------------------  enter pics here ...
var locationInfo = [
    ['Persepolis, Gathe Of All Nations', 29.936218, 52.889074, 'https://www.google.ca', 	'0/', 2, 0],
    ['Shiraz, Tomb Of Hafez',            29.625829, 52.558476, 'http://www.bbc.com/persian', '1/', 2, 0],
    // <--------------------------------------------------  enter locations here ...
    /* add more locations here on the form :
    [ name, lat, long, gallery link address, pic directory, number of pics]
    ..
    */
];

const indexLocInfo_name = 0;
const indexLocInfo_lat = 1;
const indexLocInfo_lng = 2;
const indexLocInfo_link = 3;
const indexLocInfo_picDir = 4;
const indexLocInfo_numOfPics = 5;
const indexLocInfo_currentPic = 6;

var locations = [];
var locationPicsOnOff = []; // stores tures if pic icon is already on

// ======================================================================================
//	initialize the map with the options
// --------------------------------------------------------------------------------------
function initMap() {

	createBaseMap(); // creates the base map
	createMarkers(); // creates the markers; not shows on the map until create marker clustes
	createMarkerCluster(); // creates the marker clusters

  //map.addListener('zoom_changed', zoomChecker);

  // add a controll to the map (reset)
  //centerControlDiv = document.createElement('div');

  /*
  var centerControl = new CenterControl(centerControlDiv, map);
    centerControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);
    */

}


// ======================================================================================
//	Creates a new map with the options 				                                       < Checked >
// --------------------------------------------------------------------------------------
function createBaseMap() {
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
    setlocationPicsOnOff();
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
//  Populates the locations array                                                    		 < Checked >
// --------------------------------------------------------------------------------------
function setLocations() {
    for(i=0; i<locationInfo.length; i++) {
        var location =  { lat:locationInfo[i][ indexLocInfo_lat ], lng:locationInfo[i][ indexLocInfo_lng ] };
        locations.push(location);
    }
}

// ======================================================================================
//  Populates the ocationPicsOnOff array                                                     < Checked >
// --------------------------------------------------------------------------------------
function setlocationPicsOnOff() {
	for(i=0; i<locationInfo.length; i++) {
		locationPicsOnOff.push(false);
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
        var id = i.toString();
        var title = locationInfo[i][ indexLocInfo_name ];
        var link = locationInfo[i][ indexLocInfo_link ];
        var n = locationInfo[i][ indexLocInfo_numOfPics ];
        var markerPicsDir = locationInfo[i][ indexLocInfo_picDir ];
        var pics = []; // stores all the marker's pics in the dir
        var currentPicIndex = locationInfo[i][ indexLocInfo_currentPic ];
        for(i=0; i<n; i++) {
        	var pic = picDir + markerPicsDir + i.toString() + ".jpg";
        	pics.push(pic);	
        }
        

        var content = '<b>' + title + '</b>' + '<br>'+
                      '<a href="' + link + '"  title="Click here to see all the pictures">' +
                          '<img id="'+id+'" src="' + pics[currentPicIndex] + '" style="width:200px; padding-bottom:8px; padding-top:8px; ">'+
                      '</a> <br> <div style="text-align:right;"> <b onclick="nextPic('+id+')" style="color:blue; cursor:pointer;"> >> Next Picture </b> </div>';

        var infowindow = new google.maps.InfoWindow();
        infowindow.setContent(content);
        infowindow.open(map, marker)

        //window.alert("After the function ! ");



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

function getCurrentPic(i) {

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


function readPicDir( dir ) {
    //window.alert("inside readPicDir(...)"); // ok so far

    var fs = require('fs');
    var files = fs.readdirSync( dir );

    window.alert(">> files.length: " + files.length );
    window.alert(">> files: " + files );

    return files;
}


function nextPic(locInfoIndex) {

    var i = parseInt(locInfoIndex);
    var id = i.toString();

    var markerPicsDir = locationInfo[i][ indexLocInfo_picDir ];

    locationInfo[ i ][ indexLocInfo_currentPic ]++;

    var currentPicIndex = locationInfo[ i ][ indexLocInfo_currentPic ];
    var n = locationInfo[ i ][ indexLocInfo_numOfPics];



    

    
    //window.alert("> dir: "+dir);

    //currentPicIndex++;

    /*var pic = locationInfo[ index ][ currentPicIndex ]

    var files = readPicDir( dir );
    var currentIndex = locationInfo[index][ indexLocInfo_curretPicIndex ];
    window.alert("> currentIndex: "+currentIndex);

    locationInfo[index][ indexLocInfo_curretPicIndex ] = currentIndex+1;
    window.alert("> currentIndex++: "+locationInfo[index][ indexLocInfo_curretPicIndex ]);

    var nextPicIndex = locationInfo[ index ][ indexLocInfo_curretPicIndex ];

    var file = files[nextPicIndex];
	*/
	if(currentPicIndex<n) {
		var pic = picDir + markerPicsDir + currentPicIndex.toString() + ".jpg";
		var controlText = document.getElementById(id);
    	//window.alert("nextPic");
    	controlText.src = pic;
	}

}





//window.alert("d: "+d);


