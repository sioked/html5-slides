window.addEventListener('load',
function() {
    google.bookmarkbubble.Bubble.prototype.NUMBER_OF_TIMES_TO_DISMISS = 99999;
    window.setTimeout(function() {
        var bubble = new google.bookmarkbubble.Bubble();

        var parameter = 'bmb=1';

        bubble.hasHashParameter = function() {
            return window.location.hash.indexOf(parameter) != -1;
        };

        bubble.setHashParameter = function() {
            if (!this.hasHashParameter()) {
                window.location.hash += parameter;
            }
        };

        bubble.getViewportHeight = function() {
            window.console.log('Example of how to override getViewportHeight.');
            return window.innerHeight;
        };

        bubble.getViewportScrollY = function() {
            window.console.log('Example of how to override getViewportScrollY.');
            return window.pageYOffset;
        };

        bubble.registerScrollHandler = function(handler) {
            window.console.log('Example of how to override registerScrollHandler.');
            window.addEventListener('scroll', handler, false);
        };

        bubble.deregisterScrollHandler = function(handler) {
            window.console.log('Example of how to override deregisterScrollHandler.');
            window.removeEventListener('scroll', handler, false);
        };

        bubble.showIfAllowed();
    },
    1000);
},
false);



// All of the code for google maps integration
var initialLocation;
var newyork = new google.maps.LatLng(40.69847032728747, -73.9514422416687);
var browserSupportFlag = new Boolean();
var map;
var infowindow = new google.maps.InfoWindow();
var localSearch = new google.search.LocalSearch();
var markers;
var minLat,maxLat,minLng,maxLng;

function initialize() {
    var myOptions = {
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
    detectBrowser();

    // Try W3C Geolocation method (Preferred)
    if (navigator.geolocation) {
        browserSupportFlag = true;
        console.log("Has browser support");
        navigator.geolocation.getCurrentPosition(function(position) {
            initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            contentString = "You are here!";
            map.setCenter(initialLocation);
            infowindow.setContent(contentString);
            infowindow.setPosition(initialLocation);
            infowindow.open(map);
            search();
        },
        function() {
            handleNoGeolocation(browserSupportFlag);
        });
    } else if (google.gears) {
        // Try Google Gears Geolocation
        browserSupportFlag = true;
        var geo = google.gears.factory.create('beta.geolocation');
        geo.getCurrentPosition(function(position) {
            initialLocation = new google.maps.LatLng(position.latitude, position.longitude);
            contentString = "You are here!";
            map.setCenter(initialLocation);
            infowindow.setContent(contentString);
            infowindow.setPosition(initialLocation);
            infowindow.open(map);
            search();
        },
        function() {
            handleNoGeolocation(browserSupportFlag);
        });
    } else {
        // Browser doesn't support Geolocation
        browserSupportFlag = false;
        handleNoGeolocation(browserSupportFlag);
    }
}

function handleNoGeolocation(errorFlag) {
    if (errorFlag == true) {
        initialLocation = newyork;
        contentString = "Error: The Geolocation service failed.";
    } else {
        initialLocation = siberia;
        contentString = "Error: Your browser doesn't support geolocation. Are you in Siberia?";
    }
    map.setCenter(initialLocation);
    infowindow.setContent(contentString);
    infowindow.setPosition(initialLocation);
    infowindow.open(map);
}


function detectBrowser() {
    var useragent = navigator.userAgent;
    var mapdiv = document.getElementById("map_canvas");

    if (useragent.indexOf('iPhone') != -1 || useragent.indexOf('Android') != -1) {
        mapdiv.style.width = '100%';
        mapdiv.style.height = '100%';
    } else if ( useragent.indexOf('iPad') != -1 ){
        mapdiv.style.width = '768px';
        mapdiv.style.height = '1024px';
    } else {
        mapdiv.style.width = '768px';
        mapdiv.style.height = '1024px';
    }
};

function completedSearch(){
    console.log("Inside search results!");
    console.log(localSearch.results);
    markers = [];
    var result;
    for(var i=0; i<localSearch.results.length; i++){
      console.log("adding markers");
      console.log(localSearch.results[i]);
      result = localSearch.results[i];
      var position = new google.maps.LatLng(
          result.lat, result.lng)
      var marker = new google.maps.Marker({
                title: result.title,
                map: map,
                position: position,
                clickable: false,
                draggable: true,
                flat: true
              })
        addClickHandler(marker, result);
        markers.push(marker);
        console.log("Updated markers:");
        console.log(markers);
    }
}

function addClickHandler(marker, result, position){
    var html = '<div id="content"><div id="title">'
      + result.title +'</div>'
      +'<ul><li><a href="tel:'+result.phoneNumbers[0].number+'">'+result.phoneNumbers[0].number+'</a></li>'
      +'<li>'+result.addressLines[0]+'</li>'
      +'<li>'+result.addressLines[1]+'</li>'
      +'</div>';
    var infowindow = new google.maps.InfoWindow(
        { title: result.title,
          content: html,
          size: new google.maps.Size(50,50),
          position: position
        });
    google.maps.event.addListener(marker, 'click', function() {
      infowindow.open(map,marker);
    });
}

function search(){
  localSearch.setCenterPoint(initialLocation);
  localSearch.setSearchCompleteCallback(this, completedSearch);
  localSearch.execute('Thai restaurant');
}