angular.module('tripMakerApp', [])
  .controller('homeCtrl', homeController)
​
homeController.$inject = ['$http']
​
function homeController($http) {
​
  var hCtrl = this;
  hCtrl.title = 'Trip Maker';
