angular.module('findSomeShitAndGetThereApp', [])
  .controller('homeCtrl', homeController)
​
homeController.$inject = ['$http']
​
function homeController($http) {
​
  var hCtrl = this;
  hCtrl.title = 'Find Some Shit And Get There';
​
  hCtrl.interest;
  hCtrl.location;
  hCtrl.venues = []
  hCtrl.uberServerToken = 'fYyYhlTV3GsaYq-iub1cnTICeLkO27wHJvue1tjp';
  hCtrl.uberResult;
  hCtrl.currentVenue;
​
​
​
  ////// Go function is used to initiate the search process //////
  ///////////////////////////////////////////////////////////////
  hCtrl.go = function() {
​
​
    /////// Calls ipinfo's API to get client Lat/Long /////////
    $.get("http://ipinfo.io", function(response) {
      // Takes response and splits into Lat/Long parts
      hCtrl.locationArray = response.loc.split(',')
      // Sends client location to foursquare API function
      getFoursquare(hCtrl.locationArray)
    }, "jsonp");
​
    /////// Calls foursquare API to get business info from
    //////  search and location
    function getFoursquare(locationArr) {
​
      /////// Calls foursquare API, appending user location
      /////// and search term as query parameters
      $http.get('https://api.foursquare.com/v2/venues/search?client_id=QMJ0NXOISYYKWJ32H2HZS42BEAMQ3ILUUBI3Y4S2HDOG3NTW&client_secret=GHNBLQCF4W3B0UMKRGQIZFKTRSPJ21TOHU04LRWCCJP0I3IW&v=20130815&ll=' + locationArr + '&query=' + hCtrl.interest)
        // If request is successful
        .then(function(response) {
          // Copy response to controller variable
          hCtrl.venues = response.data.response.venues;
          // For each venue in response
          for (venue of hCtrl.venues) {
            // Send venue info along with client location to Uber API
            getUber(hCtrl.locationArray, venue)
          }
        // Error, oh well :|
        },function(error) {
          // **TODO: add error handling
        })
​
    }
​
    /////// Calls uber API to get cost and time estimate for uber
    //////  ride based on client location and venue location
    function getUber(clientLatLong, venue) {
​
      // Splitting client location into Lat/Long seperated vars,
      // Splitting venue location into Lat/Long
      var lat = clientLatLong[0];
      var long = clientLatLong[1];
      var venueLat = venue.location.lat;
      var venueLong = venue.location.lng
​
      //// Actual call to uber API
      $.ajax({
        url: 'https://api.uber.com/v1/estimates/price',
        headers: {
            Authorization: "Token " + hCtrl.uberServerToken
        },
        data: {
            start_latitude: lat,
            start_longitude: long,
            end_latitude: venueLat,
            end_longitude: venueLong
        },
        //// If response is success
        success: function(result) {
            // Copy result to controller variable
            hCtrl.uberResult = result;
            // Find index of individual venue object within venues array
            var index = hCtrl.venues.indexOf(venue)
            // Add price, time, and distance to each venue object
            hCtrl.venues[index].uberPrice = result.prices[0].estimate;
            hCtrl.venues[index].uberTime = result.prices[0].duration;
            hCtrl.venues[index].uberDistance = result.prices[0].distance;
        }
      });
    }
​
    //// Used to convert returned time (from uber API, in seconds)
    //// into minutes to display
    hCtrl.SecondsTohhmmss = function(totalSeconds) {
      var hours   = Math.floor(totalSeconds / 3600);
      var minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
      var seconds = totalSeconds - (hours * 3600) - (minutes * 60);
​
      // round seconds
      seconds = Math.round(seconds * 100) / 100
​
      var result = minutes;
          result += " minutes ";
      return result;
    }
​
  }
​
  // Used to order venues by distance from client
  // (is used in HTML with ng-repeat and orderBy)
  hCtrl.orderThings = function(venue) {
    return venue.location.distance;
  }
​
  // Used to gather information from selected venue for
  // modal popup
  hCtrl.getVenueInfo = function(venue) {
    hCtrl.currentVenue = venue;
  }
}
