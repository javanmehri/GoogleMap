var map;
var mapStyle = [{
        'stylers': [{'visibility': 'off'}]
      }, {
        'featureType': 'landscape',
        'elementType': 'geometry',
        'stylers': [{'visibility': 'on'}, {'color': '#fcfcfc'}]
      }, {
        'featureType': 'water',
        'elementType': 'geometry',
        'stylers': [{'visibility': 'on'}, {'color': '#bfd4ff'}]
}];

function myMap() {

    var mapOptions = {
        center: {lat: 67.2, lng: -88.2},
        zoom: 3,
        styles: mapStyle,
        disableDefaultUI: true
    }
    
    // load the map
	map = new google.maps.Map(document.getElementById("map"), mapOptions);
    
    
    // set up the style rules and events for google.maps.Data
    map.data.setStyle(styleFeature);
    map.data.addListener('mouseover', mouseInToRegion);
    map.data.addListener('mouseout', mouseOutOfRegion);
    
    
    // wire up the button
    var selectBox = document.getElementById('selected_year');
    
    /*google.maps.event.addDomListener(selectBox, 'click', function() {
          window.alert('selectBox was clicked!');
    });*/

    google.maps.event.addDomListener(selectBox, 'change', function() {
          clearCensusData();
		  
          loadCensusData(selectBox.options[selectBox.selectedIndex].value);
    });
    
    loadMapShapes();
   
}

/** Loads the province boundary polygons from a GeoJSON source. */
function loadMapShapes() {
        // load US state outline polygons from a GeoJson file
        map.data.loadGeoJson('https://raw.githubusercontent.com/javanmehri/GeoJson/master/Canada/canada_provinces_rgb.json', { idPropertyName: 'cartodb_id' });
}

/** Removes census data from each shape on the map and resets the UI. */
function clearCensusData() {
 map.data.forEach(function(row) {
          row.setProperty('r', undefined);
          row.setProperty('g', undefined);
          row.setProperty('b', undefined);
          row.setProperty('o', undefined);
        });
}

/** Loads the census data */
function loadCensusData(variable) {
        // load the requested variable from the census API (using local copies)
        var xhr = new XMLHttpRequest();
        xhr.open('GET', variable + '.json');
        xhr.onload = function() {
          var censusData = JSON.parse(xhr.responseText);
          censusData.shift(); // the first row contains column names
          
          censusData.forEach(function(row) {
          
            var r = parseInt(row[0]);
            var g = parseInt(row[1]);
            var b = parseInt(row[2]);
            var o = parseInt(row[3]);
            var stateId = row[4];

            // update the existing row with the new data
            map.data.getFeatureById(stateId).setProperty('r', r);
            map.data.getFeatureById(stateId).setProperty('g', g);
            map.data.getFeatureById(stateId).setProperty('b', b);
            map.data.getFeatureById(stateId).setProperty('o', o);
            
          });
        };
        xhr.send();
}



function styleFeature(feature) {

        var r = feature.getProperty('r');
        var g = feature.getProperty('g');
        var b = feature.getProperty('b');
        var o = feature.getProperty('o');
        
        // determine whether to show this shape or not
        var showRow = true;
        
        if (feature.getProperty('r') == null ||
            isNaN(feature.getProperty('r')) ) {
            r = 0;
          	showRow = false;
        }
        
        if (feature.getProperty('g') == null ||
            isNaN(feature.getProperty('g')) ) {
            g = 0;
          	showRow = false;
        }

        if (feature.getProperty('b') == null ||
            isNaN(feature.getProperty('b')) ) {
            b = 0;
          	showRow = false;
        }
        
        if (feature.getProperty('o') == null ||
            isNaN(feature.getProperty('o')) ) {
            o = 0;
          	showRow = false;
        }
        
        var total = r + g + b + o;
        
        r = (r/total)*255;
        g = (g/total)*255;
        b = (b/total)*255;
        
        /*if(r > 0 || g>0 || b>0) {
        	window.alert('r:'+r+' g:'+ g+ ' b: '+b);
        }*/
        
        
        var outlineWeight = 0.5, zIndex = 1;
        if (feature.getProperty('state') === 'hover') {
          outlineWeight = zIndex = 2;
        }
        
        var op = 0.75;

        if(total <2) {
        	op = 0.4;
        }
        if(total > 1 && total <15) {
        	op = 0.5;
        }
        if(total > 14 && total <40) {
        	op = 0.75;
        }
        if(total > 39 && total <80) {
        	op = 0.85;
        }
        if(total > 79 ) {
        	op = 1;
        }   
        
        var col = 'rgb(' + r + ',' +g + ',' + b + ')';
        
     	if(total==0) {
        	op = 0.75;
        	col = 'black';
        }
             
        

        return {
          strokeWeight: outlineWeight,
          strokeColor: '#fff',
          zIndex: zIndex,
          fillColor: col,
          fillOpacity: op,
          //visible: showRow
        };
}

/** Responds to the mouse-in event on a map shape (province). */
function mouseInToRegion(e) {
        // set the hover state so the setStyle function can change the border
        e.feature.setProperty('state', 'hover');
        
        var state =  e.feature.getProperty('state');
        var name = e.feature.getProperty('name');
        var r = e.feature.getProperty('r');
        var g = e.feature.getProperty('g');
        var b = e.feature.getProperty('b');
        var o = e.feature.getProperty('o');
        
        

 		//window.alert('> name:'+name);
 
        // update the label
        document.getElementById('province').textContent = name ;
        
        if(r=='0'){
        	document.getElementById('Con').textContent = "";
        }
        else {
        	document.getElementById('Con').textContent = " Conservative Party:  "+r ;
        }
        
        if(g=='0'){
        	document.getElementById('NDP').textContent = "";
        }
        else {
        	document.getElementById('NDP').textContent = " New Democratic Party:  "+g;
        }
        
        if(b=='0'){
        	document.getElementById('Lib').textContent = "";
        }
        else {
        	document.getElementById('Lib').textContent = " Liberal Party:  "+b;
        }
        
        if(o=='0'){
        	document.getElementById('Oth').textContent = "";
        }
        else {
        	document.getElementById('Oth').textContent = " Others:  "+o;
        }        
        
        
        
        if(r!='null'){
       	 	document.getElementById('data-box').style.display = 'block';
        }
        
}

/** Responds to the mouse-out event on a map shape (province). */
function mouseOutOfRegion(e) {
        // reset the hover state, returning the border to normal
        e.feature.setProperty('state', 'normal');
        document.getElementById('data-box').style.display = 'none';
}



