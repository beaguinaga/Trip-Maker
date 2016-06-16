angular.module('tripMakerApp', ['google.places'])
//   .config(tripMakerRouter)
//
// tripMakerRouter.$inject = ['$stateProvider', '$urlRouterProvider']
//
// function tripMakerRouter ($stateProvider, $urlRouterProvider) {
//
//   $stateProvider
//     .state('home', {
//       url: '/',
//       templateUrl: 'home.html',
//       controller: 'homeCtrl as hCtrl'
//     })
//
//     $urlRouterProvider.otherwise('/')
// }



angular.module('tripMakerApp')
  .controller('homeCtrl', homeController)

function homeController() {
  var hCtrl = this;
  hCtrl.title = "Trip Maker";

  hCtrl.getLocation = function() {
    console.log(hCtrl.place);
  }

  hCtrl.getHotels = function () {
    var key= 'chxdwwtpqfdubk2wj49643jk';
    var destination = document.getElementById('destination').value;

    destination = destination.split(' ');
    console.log(destination)

    var formattedDestination = '';
    for (var i = 0; i < destination.length; i++) {
      if (i == destination.length - 1) {
        formattedDestination += destination[i]
      } else {
        formattedDestination += destination[i] + '%20';
      }
    }

    console.log(formattedDestination)

    var startDate = document.getElementById('startDate').value;

    startDate = startDate.split('-')
    var formattedStartDate = startDate[1] + '/' + startDate[2] + '/' + startDate[0];
    console.log(formattedStartDate)

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
      console.log(data);
      var results = data.getElementsByTagName("HotelResult")
      // var nodes = results.childNodes;
      console.log(results)
    })
  }
}

$(document).ready(function(){
  $('.slider').slider({full_width: true});
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
