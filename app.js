angular.module('tripMakerApp', ['ui.router'])
  .config(tripMakerRouter)

tripMakerRouter.$inject = ['$stateProvider', '$urlRouterProvider']

function tripMakerRouter ($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('login', {
      url: '/login',
      templateUrl: 'login.html',
      controller: 'homeCtrl as hCtrl'
    })
    .state('register', {
      url: '/register',
      templateUrl: 'register.html',
      controller: 'homeCtrl as hCtrl'
    })
    .state('home', {
      url: '/home',
      templateUrl: 'home.html',
      controller: 'homeCtrl as hCtrl'
    })
    .state('driving', {
      url: '/driving',
      templateUrl: 'driving.html',
      controller: 'homeCtrl as hCtrl'
    })
    .state('fly', {
      url: '/fly',
      templateUrl: 'fly.html',
      controller: 'homeCtrl as hCtrl'
    })
    .state('profile', {
      url: '/profile',
      templateUrl: 'profile.html',
      controller: 'homeCtrl as hCtrl'
    })

    $urlRouterProvider.otherwise('/')
}



angular.module('tripMakerApp')
  .controller('homeCtrl', homeController)

function homeController() {
  var hCtrl = this;
  hCtrl.title = "Trip Maker";

  hCtrl.getHotels = function () {
    hCtrl.destination = document.getElementById('destination').value;
    var key= 'chxdwwtpqfdubk2wj49643jk';
    var destination = document.getElementById('destination').value;

    destination = destination.split(' ');
    // console.log(destination)

    var formattedDestination = '';
    for (var i = 0; i < destination.length; i++) {
      if (i == destination.length - 1) {
        formattedDestination += destination[i]
      } else {
        formattedDestination += destination[i] + '%20';
      }
    }

    // console.log(formattedDestination)

    var startDate = document.getElementById('startDate').value;

    startDate = startDate.split('-')
    var formattedStartDate = startDate[1] + '/' + startDate[2] + '/' + startDate[0];
    // console.log(formattedStartDate)

    var endDate = document.getElementById('endDate').value;

    endDate = endDate.split('-')
    var formattedEndDate = endDate[1] + '/' + endDate[2] + '/' + endDate[0];

    var numOfRooms = document.getElementById('numOfRooms').value;
    var numOfAdults = document.getElementById('numOfAdults').value;
    var numOfChildren = document.getElementById('numOfChildren').value;
    var getUri = 'http://api.hotwire.com/v1/search/hotel?apikey=' + key + '&dest=' +
     formattedDestination + '&rooms=' + numOfRooms + '&adults=' + numOfAdults + '&children=' +
     numOfChildren + '&startdate=' + formattedStartDate + '&enddate=' + formattedEndDate;

     console.log(getUri)

    $.get(getUri, function(data) {
      console.log('success');
      // console.log(data);
      var results = data.getElementsByTagName("TotalPrice")
      for (result of results) {
        console.log(result.innerHTML)
      }
      // var nodes = results.childNodes;
      // console.log(results)
    })

    /////// Calls ipinfo's API to get client Lat/Long /////////
    $.get("http://ipinfo.io", function(response) {
      // Takes response and splits into Lat/Long parts
      hCtrl.locationArray = response.loc.split(',')
      // Sends client location to foursquare API function
      console.log(hCtrl.locationArray)

      GMaps.geocode({
        address: hCtrl.destination,
        callback: function(results, status) {
          if (status == 'OK') {
            var latlng = results[0].geometry.location;
            console.log(latlng.lat(),latlng.lng())

            console.log(((latlng.lat() - parseInt(hCtrl.locationArray[0])) / 2))
            console.log(((parseInt(hCtrl.locationArray[1]) - latlng.lng()) / 2))

            // northeast
            var centerLat = (((latlng.lat() - parseInt(hCtrl.locationArray[0])) / 2) + parseInt(hCtrl.locationArray[0]));
            var centerLng = (parseInt(hCtrl.locationArray[1]) - ((parseInt(hCtrl.locationArray[1]) - latlng.lng()) / 2));

            var zoomLevel;
            if ((Math.abs((latlng.lat() - parseInt(hCtrl.locationArray[0])) / 2)) > 0 || (Math.abs(((parseInt(hCtrl.locationArray[1]) - latlng.lng()) / 2))) > 0) {
              zoomLevel = 8;
            }
            if ((Math.abs((latlng.lat() - parseInt(hCtrl.locationArray[0])) / 2)) > 2 || (Math.abs(((parseInt(hCtrl.locationArray[1]) - latlng.lng()) / 2))) > 2) {
              zoomLevel = 6;
            }
            if ((Math.abs(((latlng.lat() - parseInt(hCtrl.locationArray[0])) / 2))) > 10 || (Math.abs((parseInt(hCtrl.locationArray[1]) - latlng.lng()) / 2)) > 10) {
              zoomLevel = 5;
            }

            console.log(zoomLevel)

            console.log(centerLat,centerLng)


            console.log('started map')
            hCtrl.map = new GMaps({
              div: '#map',
              lat: centerLat,
              lng: centerLng,
              zoom: zoomLevel
            });

            hCtrl.map.drawRoute({
              origin: [hCtrl.locationArray[0], hCtrl.locationArray[1]],
              destination: [latlng.lat(), latlng.lng()],
              travelMode: 'driving',
              strokeColor: '#131540',
              strokeOpacity: 0.6,
              strokeWeight: 6
            });

          }
        }
      });

    }, "jsonp");




  }

  $(document).ready(function(){
    $('.slider').slider({full_width: true});
  });

  $(document).ready(function(){
      // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
      $('.modal-trigger').leanModal();
    });

  $(document).ready(function(){
    $('.materialboxed').materialbox();
  });

  //Collapsible
  $(document).ready(function(){
     $('.collapsible').collapsible({
       accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
     });
   });


}
