// All needed const
const zoomLevel_start = 2;
const centerPoint_start = {lat:25, lng:10} ; 
const picDir = "travelMap/img/";
const markerIcon = 'travelMap/img/icons/flagGreen.png';

// map vars
var map;
var zoomLevel = zoomLevel_start;
var centerPoint = centerPoint_start ;
var locations = []; 
var markers = [];
var markerCluster;

// location data
var locationInfo = [
	['Persepolis, Entrance'   			  , 29.936061, 52.888546, 'https://www.flickr.com/photos/126978341@N07/albums/72157687187391943', 	'places/prs_e/',    1, 0, false, false],
    ['Persepolis, Gathe Of All Nations'   , 29.936218, 52.889074, 'https://www.flickr.com/photos/126978341@N07/albums/72157687187391943', 	'places/prs_goan/', 8, 0, false, false],
    ['Persepolis, The eagle-griffin'	  , 29.936539, 52.889715, 'https://www.flickr.com/photos/126978341@N07/albums/72157687187391943', 	'places/prs_eg/',   2, 0, false, false],
    ['Persepolis, The Unfinished Gate'	  , 29.936310, 52.890645, 'https://www.flickr.com/photos/126978341@N07/albums/72157687187391943', 	'places/prs_ug/',   3, 0, false, false],
    ['Persepolis, The Hundred Column Hall', 29.935345, 52.891043, 'https://www.flickr.com/photos/126978341@N07/albums/72157687187391943', 	'places/prs_hch/', 15, 0, false, false],
    ['Persepolis, The Apadana Palace'	  , 29.935177, 52.889596, 'https://www.flickr.com/photos/126978341@N07/albums/72157687187391943', 	'places/prs_a/',   15, 0, false, false],
    ['Persepolis, The Tachara Palace'	  , 29.934397, 52.889602, 'https://www.flickr.com/photos/126978341@N07/albums/72157687187391943', 	'places/prs_t/',    9, 0, false, false],
    ['Persepolis, Tomb of Artaxerxes III' , 29.935828, 52.892438, 'https://www.flickr.com/photos/126978341@N07/albums/72157687187391943', 	'places/prs_toa/',  3, 0, false, false],
    ['Shiraz, Tomb Of Hafez'			  , 29.625829, 52.558476, 'https://www.flickr.com/photos/126978341@N07/albums/72157700531417744', 	'places/shir_toh/', 4, 0, false, false],
    ['Shiraz, Karim Khan Citadel'		  , 29.617685, 52.544715, 'https://www.flickr.com/photos/126978341@N07/albums/72157700531417744', 	'places/shir_kkc/', 4, 0, false, false],
    ['Shiraz, Tomb Of Sa\'di'			  , 29.622535, 52.583137, 'https://www.flickr.com/photos/126978341@N07/albums/72157700531417744', 	'places/shir_tos/', 4, 0, false, false],
    // <--------------------------------------------------  enter locations here ...
    /* add more locations here on the form :
    [ name, lat, long, gallery link address, pic directory, number of pics]
    ..
    */
];

// indexs
const indexLocInfo_name = 0;
const indexLocInfo_lat = 1;
const indexLocInfo_lng = 2;
const indexLocInfo_link = 3;
const indexLocInfo_picDir = 4;
const indexLocInfo_numOfPics = 5;
const indexLocInfo_currentPic = 6;
const indexLocInfo_magnified = 7;
const indexLocInfo_clicked = 8;


var locationPicsOnOff = []; // stores tures if pic icon is already on

// ======================================================================================
//	initialize the map with the options
// --------------------------------------------------------------------------------------
function initMap() {

	createBaseMap(); // creates the base map
	createMarkers(); // creates the markers; not shows on the map until create marker clustes
	createMarkerCluster(); // creates the marker clusters
	//createIconLabels();
    
  	// add a controlls to the map 
  	globeControlDiv = document.createElement('div');
  	globeControl = new GlobeControl(globeControlDiv, map);
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(globeControlDiv);

    pinControlDiv = document.createElement('div');
  	globeControl = new PinControl(pinControlDiv, map);
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(pinControlDiv);
}

function resetMap() {

    resetAlltoUnMagnified();
    deleteAllMarkers(markers);
    //createBaseMap(); // creates the base map
    createMarkers(); // creates the markers; not shows on the map until create marker clustes
    createMarkerCluster(); // creates the marker clusters
    //createIconLabels();
    
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
    setAllInfoWinsOff();
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
        var location =  { 
            lat:locationInfo[i][ indexLocInfo_lat ], 
            lng:locationInfo[i][ indexLocInfo_lng ] 
        };
        //locations.push(location);
        locations[i] = location;
    }
}

// ======================================================================================
//  Populates the ocationPicsOnOff array                                                     < Checked >
// --------------------------------------------------------------------------------------
function setAllInfoWinsOff() {
	for(i=0; i<locationInfo.length; i++) {
		setInfoWinOff(i);
	}
}

function setInfoWinOff(id) {
    locationInfo[id][indexLocInfo_clicked] = false;
    //window.alert("isClicked("+id+"): "+locationInfo[id][indexLocInfo_clicked]);
    //window.alert("isClicked("+id+"): "+isClicked(id));
    //window.alert("clicked: "+locationInfo[id][indexLocInfo_clicked]);
}

function setInfoWinOn(id) {
    locationInfo[id][indexLocInfo_clicked] = true;
}

function isClicked(id) {
    return locationInfo[id][indexLocInfo_clicked];
}

function resetCurrentPic(id) {
    locationInfo[id][indexLocInfo_currentPic] = 0;
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
        var clicked = isClicked(i);

        var id = i.toString();
        var title = locationInfo[i][ indexLocInfo_name ];
        //var link = locationInfo[i][ indexLocInfo_link ];
        var n = locationInfo[i][ indexLocInfo_numOfPics ];
        var markerPicsDir = locationInfo[i][ indexLocInfo_picDir ];
        var pics = []; // stores all the marker's pics in the dir
        var currentPicIndex = locationInfo[i][ indexLocInfo_currentPic ];

		if (n == 1)
    	{
    		nextStyle = "color:gray;";
    	}
    	else
    	{
    		nextStyle = " color:blue; cursor:pointer;";
    	}

        for(k=0; k<n; k++) {
        	var pic = picDir + markerPicsDir + k.toString() + ".jpg";
        	pics.push(pic);	
        }

        var content = '<br>' +
                      '<img onclick ="picWin('+id+');" class="picMd" id="'+id+'" src="' + pics[currentPicIndex] + '" ></img>'+
                      '<br> <span class="leftBig" id="'+id+'pre'+'" onclick="prePic('+id+')" style="color:gray;"> <b> Previous << </b> </span>'+
                      '<span class="rightBig" id="'+id+'next'+'" onclick="nextPic('+id+')" style='+nextStyle+'> <b> >> Next </b> </span>'+
                      '<br> <hr class="lineBig" id="'+id+'line'+'" > <center class="titleBig" id="'+id+'cen'+'" > '+title+' </center>';

        var infowindow = new google.maps.InfoWindow();
        infowindow.setContent(content);
        infowindow.addListener('closeclick', infowindowClose );
        function infowindowClose() {
        	//locationPicsOnOff[id] = false;
            setInfoWinOff(id);
            //window.alert("infowindowClose(id): isClicked("+id+"): "+isClicked(id));
            resetCurrentPic(id);
        }

		if(!isClicked(id)) {
            map.setCenter(marker.getPosition());
            //window.alert("isClicked("+id+"): "+isClicked(id));
			infowindow.open(map, marker);
        	//locationPicsOnOff[id] = true;
            setInfoWinOn(id);
		}
        else {
            //window.alert("isClicked("+id+"): "+isClicked(id));
        }

        map.addListener('zoom_changed', zoomChecker);

        var zoomLevelBefor = map.getZoom();

        function zoomChecker() {
        	var df = zoomLevelBefor - map.getZoom();
        	//window.alert(" > df: "+df);

        	if (df > 0) {
        		//window.alert(" > window.alert: "+window.alert);
        		for(i=0; i<locationInfo.length; i++) {
                    var clicked = isClicked(i);
        			if (clicked) {
        				try {
        					var controlText = document.getElementById(id);
        					controlText.className = "picSmall";
                            locationInfo[parseInt(id)][indexLocInfo_magnified] = false;
        					controlText = document.getElementById(id+'pre');
        					controlText.className = "leftSmall";
        					controlText = document.getElementById(id+'next');
        					controlText.className = "leftSmall";
        					controlText = document.getElementById(id+'cen');
        					controlText.className = "titleSmall";
        					controlText = document.getElementById(id+'line');
        					controlText.className = "lineSmall";
        				}
        				catch {
        				}
        				
        			}
        		}
        	}

        	if (df < 0) {
        		//window.alert(" > window.alert: "+window.alert);
        		for(i=0; i<locationPicsOnOff.length; i++) {
        			if (locationPicsOnOff[i]==true) {
        				try {
        					var controlText = document.getElementById(id);
        					controlText.className = "picMd";
                            locationInfo[parseInt(id)][indexLocInfo_magnified] = false;
        					controlText = document.getElementById(id+'pre');
        					controlText.className = "leftBig";
        					controlText = document.getElementById(id+'next');
        					controlText.className = "rightBig";
        					controlText = document.getElementById(id+'cen');
        					controlText.className = "titleBig";
        					controlText = document.getElementById(id+'line');
        					controlText.className = "lineBig";
        				}
        				catch {

        				}

        				
        			}
        		}
        	}


        }


    	}
	}

// ======================================================================================
//  use for finding locations in the locations array                                       < Checked >
// --------------------------------------------------------------------------------------
function getIndexLocationOf(marker) {
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
      index = i
    }
  }
  return index;
}


// ======================================================================================
//	Creates marker ckuster and adds all the markers into it		                           < Checked >
// --------------------------------------------------------------------------------------
function createMarkerCluster() {
    if(markerCluster!=null){
        markerCluster.clearMarkers();
    }
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
function GlobeControl(controlDiv, map) {

        // Set CSS for the control border.
        var controlUI = document.createElement('div');
        //controlUI.style.backgroundColor = '#fff';
        //controlUI.style.border = '4px solid #fff';
        controlUI.style.borderRadius = '20px';
        controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
        controlUI.style.cursor = 'pointer';
        controlUI.style.marginBottom = '2px';
        controlUI.style.marginRight = '14px';
        controlUI.style.marginTop = '18px';
        controlUI.style.textAlign = 'center';
        controlUI.title = 'Click to reset the map';
        controlDiv.appendChild(controlUI);

        // Set CSS for the control interior.
        var controlText = document.createElement('div');
        controlText.style.color = 'rgb(25,25,25)';
        controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
        controlText.style.fontSize = '32px';
        controlText.style.lineHeight = '20px';
        controlText.style.paddingLeft = '0px';
        controlText.style.paddingRight = '0px';
        controlText.innerHTML = '&#127760;';  	
        //controlText.innerHTML = '&#128204;';
        controlUI.appendChild(controlText);

        // Setup the click event listeners: simply set the map to Chicago.
        controlUI.addEventListener('click', function() {
        	zoomLevel = zoomLevel_start;
        	centerPoint = centerPoint_start ; 
            resetAlltoUnMagnified();
          	initMap();
        });
}

function PinControl(controlDiv, map) {

        // Set CSS for the control border.
        var controlUI = document.createElement('div');
        controlUI.style.cursor = 'pointer';
        controlUI.style.marginBottom = '2px';
        controlUI.style.marginRight = '14px';
        controlUI.style.marginTop = '18px';
        controlUI.style.textAlign = 'center';
        controlUI.title = 'Click to reset all the markers';
        controlDiv.appendChild(controlUI);

        // Set CSS for the control interior.
        var controlText = document.createElement('div');
        controlText.style.color = 'rgb(25,25,25)';
        controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
        controlText.style.fontSize = '32px';
        controlText.style.lineHeight = '20px';
        controlText.style.paddingLeft = '0px';
        controlText.style.paddingRight = '0px';
        //controlText.innerHTML = '&#127760;';  	
        controlText.innerHTML = '&#128204;';
        controlUI.appendChild(controlText);

        // Setup the click event listeners: simply set the map to Chicago.
        controlUI.addEventListener('click', function() {
        	zoomLevel = map.getZoom();
        	centerPoint = map.getCenter() ; 
            resetMap();
        });
}


function resetAlltoUnMagnified() {
    for(i=0; i<locationInfo.length; i++) {
        locationInfo[i][indexLocInfo_magnified] = false;
    }
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

    	var next = document.getElementById(id+'next');
    	var pre  = document.getElementById(id+'pre');

    	if (currentPicIndex== n-1 ) {
    		next.style = "color:gray;";
    		pre.style = "color:blue; cursor:pointer;";
    	}
    	else if (currentPicIndex== 0)
    	{
    		next.style = "color:blue; cursor:pointer;";
    		pre.style = "color:gray;";
    	}
    	else 
    	{
    		next.style = "color:blue; cursor:pointer;";
    		pre.style  = "color:blue; cursor:pointer;";
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

    	var next = document.getElementById(id+'next');
    	var pre  = document.getElementById(id+'pre');

    	if (currentPicIndex== n-1 ) {
    		next.style = "color:gray;";
    		pre.style = "color:blue; cursor:pointer;";
    	}
    	else if (currentPicIndex== 0)
    	{
    		next.style = "color:blue; cursor:pointer;";
    		pre.style = "color:gray;";
    	}
    	else 
    	{
    		next.style = "color:blue; cursor:pointer;";
    		pre.style  = "color:blue; cursor:pointer;";
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

function picWin(id) {

	    var center = map.getCenter();;  // a latLng
		var offsetX = 0; // move center one quarter map width left
		var offsetY;// move center one quarter map height down

		var span = map.getBounds().toSpan(); // a latLng - # of deg map spans

        var img = document.getElementById(id);
        var mag = locationInfo[parseInt(id)][indexLocInfo_magnified];
        if(mag==false) {
        	img.className = "picBig";
        	picBig = true;
        	offsetY = 0.4; 
        	locationInfo[parseInt(id)][indexLocInfo_magnified] = true;
        }
        else {
        	img.className = "picMd";
        	picBig = false;
        	offsetY = -0.4;
        	locationInfo[parseInt(id)][indexLocInfo_magnified] = false; 
        }

		var newCenter = { 
    		lat: center.lat() + span.lat()*offsetY,
    		lng: center.lng() + span.lng()*offsetX
		};

		map.panTo(newCenter);  // or map.setCenter(newCenter);

}





//window.alert("d: "+d);


