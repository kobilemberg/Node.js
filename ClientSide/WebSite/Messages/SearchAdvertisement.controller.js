angular.module('angularModule').controller('SearchAdvertisementController',function($rootScope,$scope,$http, $route, $routeParams,MyService) {

    /*Post the serach data and set the page params for display*/
    console.log("SearchAdvertisementController");
    console.log("dataToSend"+JSON.stringify(MyService.dataToSendToServer));
    $http({
        method: 'POST',
        url: '/searchMsg',
        data:MyService.dataToSendToServer

    }).then(function successCallback(response) {
        console.log("Searched advertisement:"+response.data);
        $scope.searchedAdvertisement = response.data;
    }, function errorCallback(response) {
        console.log("error with  get searchMsg");
        console.log(response);
    });

    $( "#searchAdvertisment" ).click(function() {
        $http({
            method: 'POST',
            url: '/searchMsg',
            data:MyService.dataToSendToServer

        }).then(function successCallback(response) {
            console.log("Searched advertisment:"+response.data);
            $scope.searchedAdvertisement = response.data;
        }, function errorCallback(response) {
            console.log("error with  get searchMsg");
            console.log(response);
        });
    });

});