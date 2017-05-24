function initialize() {
  var myOptions = {
    center: new google.maps.LatLng(37.4219999,-122.0840575),
    zoom: 14,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  var map = new google.maps.Map(document.getElementById("default"), myOptions);
  setMarkers(map, locations)
}

function setMarkers(map, locations) {
  var marker, i
  for (i = 0; i < locations.length; i++) {
    var name = locations[i][0]
    var lat = locations[i][1]
    var long = locations[i][2]
    var desc = locations[i][3]

    latlngset = new google.maps.LatLng(lat, long);
    var marker = new google.maps.Marker({
      map: map,
      title: name,
      position: latlngset
    });
    map.setCenter(marker.getPosition())
    var content = "<strong>" + name + "</strong>" + "<br>" + desc + "<br>" + String(lat) + ", " + String(long);
    var infowindow = new google.maps.InfoWindow()
    google.maps.event.addListener(marker, 'click', (function(marker, content, infowindow) {
      return function() {
        infowindow.setContent(content);
        infowindow.open(map, marker);
      };
    })(marker, content, infowindow));
  }
}
