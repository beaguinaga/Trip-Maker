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
  .controller('homeCtrl', ['$http','$scope', homeController])

function homeController($http,$scope) {
  var hCtrl = this;
  hCtrl.title = "Trip Maker";
  hCtrl.lat;
  hCtrl.lng;
  hCtrl.nightlifeArray = [];

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

    //  console.log(getUri)

    $.get(getUri, function(data) {
      // console.log('success');
      // console.log(data);
      var results = data.getElementsByTagName("TotalPrice")
      var avgPPN = data.getElementsByTagName("AveragePricePerNight")
      var bookUrl = data.getElementsByTagName("DeepLink")
      console.log(results)


      setTimeout(function() {
      var hotelsDiv = $('#hotels');
      // console.log(hotelsDiv)
        for (var i = 0;i < results.length; i++) {
          console.log(results[i].innerHTML)

          $('#hotels').append('<p><a class="waves-effect waves-light btn" href=' + bookUrl[i].innerHTML + '>BOOK NOW</a></p>');
          $('#hotels').append('<p>' + avgPPN[i].innerHTML + '</p>');
          $('#hotels').append('<p>' + results[i].innerHTML + '</p>');
          // if (mallThing.contact.formattedPhone) {
          // $('#hotels').append('<p>' + hotel.contact.formattedPhone + '</p>');
          // }
          // if (mallThing.url) {
          // $('#hotels').append('<p>' + hotel.url + '</p>');
          // }
          // if (bar.menu.url) {
          // $('#bars').append('<p>' + bar.menu.url + '</p>');
          // }
          $('#hotels').append('<hr />');
        }
      },1000);


      // var nodes = results.childNodes;
      // console.log(results)
    })

    /////// Calls ipinfo's API to get client Lat/Long /////////
    $.get("http://ipinfo.io", function(response) {
      // Takes response and splits into Lat/Long parts
      hCtrl.locationArray = response.loc.split(',')
      // Sends client location to foursquare API function
      // console.log(hCtrl.locationArray)

      GMaps.geocode({
        address: hCtrl.destination,
        callback: function(results, status) {
          if (status == 'OK') {
            var latlng = results[0].geometry.location;
            hCtrl.lat = latlng.lat();
            hCtrl.lng = latlng.lng();
            // console.log(latlng.lat(),latlng.lng())
            console.log(hCtrl.lat,hCtrl.lng)

            // console.log(((latlng.lat() - parseInt(hCtrl.locationArray[0])) / 2))
            // console.log(((parseInt(hCtrl.locationArray[1]) - latlng.lng()) / 2))

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

            // console.log(zoomLevel)
            //
            // console.log(centerLat,centerLng)


            // console.log('started map')
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

      setTimeout(function() {
        // console.log('in nightlife')
        // console.log(hCtrl.lat,hCtrl.lng)
        hCtrl.locArray = [hCtrl.lat,hCtrl.lng];
        // console.log(hCtrl.locArray)
        $http.get('https://api.foursquare.com/v2/venues/search?client_id=QMJ0NXOISYYKWJ32H2HZS42BEAMQ3ILUUBI3Y4S2HDOG3NTW&client_secret=GHNBLQCF4W3B0UMKRGQIZFKTRSPJ21TOHU04LRWCCJP0I3IW&v=20130815&ll=' + hCtrl.locArray + '&query=bars')
          // If request is successful
          .then(function(response) {
            // console.log(response.data.response.venues)
            hCtrl.nightlifeArray = response.data.response.venues;
            // console.log(hCtrl.nightlifeArray)

            var barDiv = $('#bars');
            // console.log(barDiv)
              for (bar of hCtrl.nightlifeArray) {
                // console.log(bar)

                $('#bars').append('<p><b>' + bar.name + '</b> <a class="waves-effect waves-light btn"><i class="material-icons">library_add</i></a></p>');
                if (bar.contact.formattedPhone) {
                $('#bars').append('<p>' + bar.contact.formattedPhone + '</p>');
                }
                if (bar.url) {
                $('#bars').append('<p>' + bar.url + '</p>');
                }
                // if (bar.menu.url) {
                // $('#bars').append('<p>' + bar.menu.url + '</p>');
                // }
                $('#bars').append('<hr />');
              }



          // Error, oh well :|
          },function(error) {
            // **TODO: add error handling
          })
      }, 1000)

      setTimeout(function() {
        // console.log('in nightlife')
        // console.log(hCtrl.lat,hCtrl.lng)
        hCtrl.locArray = [hCtrl.lat,hCtrl.lng];
        // console.log(hCtrl.locArray)
        $http.get('https://api.foursquare.com/v2/venues/search?client_id=QMJ0NXOISYYKWJ32H2HZS42BEAMQ3ILUUBI3Y4S2HDOG3NTW&client_secret=GHNBLQCF4W3B0UMKRGQIZFKTRSPJ21TOHU04LRWCCJP0I3IW&v=20130815&ll=' + hCtrl.locArray + '&query=arcade')
          // If request is successful
          .then(function(response) {
            // console.log(response.data.response.venues)
            hCtrl.funArray = response.data.response.venues;
            // console.log(hCtrl.funArray)

            var barDiv = $('#bars');
            // console.log(barDiv)
              for (funThing of hCtrl.funArray) {
                // console.log()

                $('#funThings').append('<p><b>' + funThing.name + '</b> <a class="waves-effect waves-light btn"><i class="material-icons">library_add</i></a></p>');
                if (funThing.contact.formattedPhone) {
                $('#funThings').append('<p>' + funThing.contact.formattedPhone + '</p>');
                }
                if (funThing.url) {
                $('#funThings').append('<p>' + funThing.url + '</p>');
                }
                // if (bar.menu.url) {
                // $('#bars').append('<p>' + bar.menu.url + '</p>');
                // }
                $('#funThings').append('<hr />');
              }



          // Error, oh well :|
          },function(error) {
            // **TODO: add error handling
          })
      }, 1000)

      setTimeout(function() {
        // console.log('in nightlife')
        // console.log(hCtrl.lat,hCtrl.lng)
        hCtrl.locArray = [hCtrl.lat,hCtrl.lng];
        // console.log(hCtrl.locArray)
        $http.get('https://api.foursquare.com/v2/venues/search?client_id=QMJ0NXOISYYKWJ32H2HZS42BEAMQ3ILUUBI3Y4S2HDOG3NTW&client_secret=GHNBLQCF4W3B0UMKRGQIZFKTRSPJ21TOHU04LRWCCJP0I3IW&v=20130815&ll=' + hCtrl.locArray + '&query=mall')
          // If request is successful
          .then(function(response) {
            // console.log(response.data.response.venues)
            hCtrl.mallArray = response.data.response.venues;
            // console.log(hCtrl.mallArray)

            var mallDiv = $('#mall');
            // console.log(mallDiv)
              for (mallThing of hCtrl.mallArray) {
                // console.log()

                $('#mallThings').append('<p><b>' + mallThing.name + '</b> <a class="waves-effect waves-light btn"><i class="material-icons">library_add</i></a></p>');
                if (mallThing.contact.formattedPhone) {
                $('#mallThings').append('<p>' + mallThing.contact.formattedPhone + '</p>');
                }
                if (mallThing.url) {
                $('#mallThings').append('<p>' + mallThing.url + '</p>');
                }
                // if (bar.menu.url) {
                // $('#bars').append('<p>' + bar.menu.url + '</p>');
                // }
                $('#mallThings').append('<hr />');
              }



          // Error, oh well :|
          },function(error) {
            // **TODO: add error handling
          })
      }, 1000)

      setTimeout(function() {
        // console.log('in nightlife')
        // console.log(hCtrl.lat,hCtrl.lng)
        hCtrl.locArray = [hCtrl.lat,hCtrl.lng];
        // console.log(hCtrl.locArray)
        $http.get('https://api.foursquare.com/v2/venues/search?client_id=QMJ0NXOISYYKWJ32H2HZS42BEAMQ3ILUUBI3Y4S2HDOG3NTW&client_secret=GHNBLQCF4W3B0UMKRGQIZFKTRSPJ21TOHU04LRWCCJP0I3IW&v=20130815&ll=' + hCtrl.locArray + '&query=burger')
          // If request is successful
          .then(function(response) {
            // console.log(response.data.response.venues)
            hCtrl.burgerArray = response.data.response.venues;
            // console.log(hCtrl.burgerArray)

            var burgerDiv = $('#burger');
            // console.log(burgerDiv)
              for (burgerThing of hCtrl.burgerArray) {
                // console.log()

                $('#burgerThings').append('<p><b>' + burgerThing.name + '</b> <a class="waves-effect waves-light btn"><i class="material-icons">library_add</i></a></p>');
                if (burgerThing.contact.formattedPhone) {
                $('#burgerThings').append('<p>' + burgerThing.contact.formattedPhone + '</p>');
                }
                if (burgerThing.url) {
                $('#burgerThings').append('<p>' + burgerThing.url + '</p>');
                }
                // if (burgerThing.menu.url) {
                // $('#burgerThings').append('<p>' + burgerThing.menu.url + '</p>');
                // }
                $('#burgerThings').append('<hr />');
              }



          // Error, oh well :|
          },function(error) {
            // **TODO: add error handling
          })
      }, 1000)

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
