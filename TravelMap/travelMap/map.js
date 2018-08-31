
// All needed variables
var map;
var zoomLevel = 2;
var markers;
var markerIcon = 'travelMap/img/icons/pin2.png';
var picDir = "travelMap/img/";
var picHeight ;
var centerPoint = {lat:25, lng:10} ;
var centerControlDiv;

// <-------------------------------------------------------  enter pics here ...
var locationInfo = [
    ['Persepolis, Gathe Of All Nations', 29.936218, 52.889074, 'https://www.flickr.com/photos/126978341@N07/albums/72157687187391943', 	'0/', 5, 0],
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
var centerControl;

// ======================================================================================
//	initialize the map with the options
// --------------------------------------------------------------------------------------
function initMap() {

	picHeight = 300;
	createBaseMap(); // creates the base map
	createMarkers(); // creates the markers; not shows on the map until create marker clustes
	createMarkerCluster(); // creates the marker clusters
	//createIconLabels();
    

  // add a controll to the map (reset)
  centerControlDiv = document.createElement('div');

  centerControl = new CenterControl(centerControlDiv, map);
    centerControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);
    
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
         rotation: 45,
         origin: new google.maps.Point(0,0), // origin
         labelOrigin: new google.maps.Point(20,-10) //OK
    };

    //deleteAllMarkers(markers);

    markers = locations.map(
      function(location, i) {
		      var marker = new google.maps.Marker({
  				  	position: location,
            		title: "Click here to See the image!",
  				  	optimized:false,
            		shape: { coords: [0, 0, 60], type: 'circle' },
            		labelClass: "labels",
            		//labelStyle: {opacity: 0.25},
            		//labelInBackground: true,
            		/*label: {
                    	text: "(?)",
                    	color: '#b22222',
                    	fontSize: "14px",
                    	fontWeight: "bold"
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
	locations = [];
    for(i=0; i<locationInfo.length; i++) {
        var location =  { lat:locationInfo[i][ indexLocInfo_lat ], lng:locationInfo[i][ indexLocInfo_lng ] };
        locations.push(location);
    }
}

// ======================================================================================
//  Populates the ocationPicsOnOff array                                                     < Checked >
// --------------------------------------------------------------------------------------
function setlocationPicsOnOff() {
	locationPicsOnOff = [];
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
        var clicked = locationPicsOnOff[i];
        

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
        

        var content = '<a href="' + link + '"  title="Click here to see all the pictures" target="_blank" > <br>' +
                      '<img id="'+id+'" src="' + pics[currentPicIndex] + '" style="height:'+picHeight.toString()+'px; margin-left:10px; border: 1px solid black;"></img></a>'+
                      '<br> <br> <span style="float:left; margin-left:15px; "> <b id="'+id+'pre'+'" onclick="prePic('+id+')" style="color:gray;"> Previous << </b> </span>'+
                      '<span style="float:right;"> <b id="'+id+'next'+'" onclick="nextPic('+id+')" style=" font-size:100%; color:blue; cursor:pointer;"> >> Next </b> </span>'+
                      '<br> <hr style="margin-left:15px; "> <center id="'+id+'cen'+'"  style="color:#b22222; padding-top:5px; padding-down:5px; font-size:110%; font-style: oblique; font-weight: bold;"  > '+title+' </center>';

        var infowindow = new google.maps.InfoWindow();
        infowindow.setContent(content);
        infowindow.setZIndex(0);
        infowindow.addListener('closeclick', infowindowClose);
        function infowindowClose() {
        	locationPicsOnOff[id] = false;
        }

        infowindow.addListener('closeclick', infowindowClose);
        function infowindowClose() {
        	locationPicsOnOff[id] = false;
        	locationInfo[id][indexLocInfo_currentPic] = 0;
        }

		if(!clicked) {
			infowindow.open(map, marker);
        	locationPicsOnOff[id] = true;
		}


        map.addListener('zoom_changed', zoomChecker);

        var zoomLevelBefor = map.getZoom();

        function zoomChecker() {
        	var df = zoomLevelBefor - map.getZoom();
        	//window.alert(" > df: "+df);

        	if (df > 1) {
        		//window.alert(" > window.alert: "+window.alert);
        		for(i=0; i<locationPicsOnOff.length; i++) {
        			if (locationPicsOnOff[i]==true) {
        				try {
        					var controlText = document.getElementById(id);
        					controlText.style = "margin-left:10px; height:150px; border: 1px solid black; ";
        					picHeight = 150;
        					controlText = document.getElementById(id+'cen');
        					controlText.style = "color:#b22222; padding-top:5px; padding-down:5px; font-size:90%; font-style: oblique; font-weight: bold;";
        				}
        				catch {

        				}

        				
        			}
        		}
        	}

        	if (df < 1) {
        		//window.alert(" > window.alert: "+window.alert);
        		for(i=0; i<locationPicsOnOff.length; i++) {
        			if (locationPicsOnOff[i]==true) {
        				try {
        					var controlText = document.getElementById(id);
        					controlText.style = "margin-left:10px; height:300px; border: 1px solid black; ";
        					picHeight = 300;
        					controlText = document.getElementById(id+'cen');
        					controlText.style = "color:#b22222; padding-top:5px; padding-down:5px; font-size:110%; font-style: oblique; font-weight: bold;";
        				}
        				catch {

        				}

        				
        			}
        		}
        	}


        }

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
	//window.alert("***");
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
        controlUI.style.marginTop = '10px';
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
          	//zoomLevel = map.getZoom();
          	//centerPoint = map.getCenter();
          	//deleteAllMarkers(markers);
          	//markerCluster.setMap(null);
          	//markerCluster.clearMarkers();
          	//markerCluster = null;
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

	if(currentPicIndex<n) {
		var pic = picDir + markerPicsDir + currentPicIndex.toString() + ".jpg";
		var controlText = document.getElementById(id);
    	//window.alert("nextPic");
    	controlText.src = pic;

    	if (currentPicIndex== n-1 ) {
    		controlText = document.getElementById(id+'next');
    		controlText.style = "color:gray;";
    		controlText = document.getElementById(id+'pre');
    		controlText.style = "color:blue; cursor:pointer;";
    	}
    	else
    	{
    		controlText = document.getElementById(id+'next');
    		controlText.style = "color:blue; cursor:pointer;";
    		controlText = document.getElementById(id+'pre');
    		controlText.style = "color:gray;";
    	}
	}
}


function prePic(locInfoIndex) {

    var i = parseInt(locInfoIndex);
    var id = i.toString();
    var markerPicsDir = locationInfo[i][ indexLocInfo_picDir ];
    locationInfo[ i ][ indexLocInfo_currentPic ]--;
    //window.alert("locationInfo[ i ][ indexLocInfo_currentPic ]: "+locationInfo[ i ][ indexLocInfo_currentPic ]);
    var currentPicIndex = locationInfo[ i ][ indexLocInfo_currentPic ];
    var n = locationInfo[ i ][ indexLocInfo_numOfPics];

	if(currentPicIndex>=0 && currentPicIndex<n) {
		var pic = picDir + markerPicsDir + currentPicIndex.toString() + ".jpg";
		var controlText = document.getElementById(id);
    	//window.alert("nextPic");
    	controlText.src = pic;

    	if (currentPicIndex==0) {
    		controlText = document.getElementById(id+'pre');
    		controlText.style = "color:gray;";
    		controlText = document.getElementById(id+'next');
    		controlText.style = "color:blue; cursor:pointer;";
    	}
    	else
    	{
    		controlText = document.getElementById(id+'pre');
    		controlText.style = "color:blue; cursor:pointer;";
    		controlText = document.getElementById(id+'next');
    		controlText.style = "color:gray;";
    	}
	}

}

/*
// ======================================================================================
//  Create the related icon labels                                                         < Checked >
// --------------------------------------------------------------------------------------
function createIconLabels(){
	for(i=0; i<markers.length; i++) {

         markers[i].getLabel().text = locationInfo[i][indexLocInfo_name];

	}
}*/





//window.alert("d: "+d);


