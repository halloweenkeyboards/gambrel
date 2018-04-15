(function() {
    'use strict';

    angular
    .module('app.businessAdd')
    .controller('BusinessAdd', BusinessAdd);

    BusinessAdd.$inject = ['$scope', '$http'];

    function BusinessAdd($scope, $http) {
        angular.element(document).ready(function() {
            //$scope.clientGooglePlacesSearch();
        });

        console.log(config.business_data_defaults);

        $scope.businessAddState = "search";

        // search state variables
        $scope.searchQuery = "";
        $scope.locationQuery = "";
        $scope.googlePlacesResultsArray = [];
        $scope.yelpFusionResultsArray = [];

        $scope.googlePlacesMatch = {
        	"id" : ""
        };
        $scope.yelpFusionMatch = {
        	"id" : ""
        };

        //details state variables
        $scope.googleDetailsResults = {};
        $scope.yelpDetailsResults = {};

        $scope.businessData = {};


        $scope.clientBusinessSearch = function() {

        	// Google Places Query Object
        	var googleSearchData = {};
        	googleSearchData['query'] = $scope.searchQuery + " " + $scope.locationQuery;

        	//  Google Places Post Request
	    	$http({
	    		method: 'POST',
	    		url: '/api/googlePlacesSearch',
	    		data: googleSearchData
	    	}).then(function successCallback(response) {

	            //console.log(response);
	            //console.log(response.data.results);
	            $scope.googlePlacesResultsArray = response.data.results;


	        }, function errorCallback(error) {
	            console.log(error);
	        }); 


	    	//Yelp Fusion Query Object
	    	var yelpSearchData = {};
	    	yelpSearchData['term'] = $scope.searchQuery;
	    	yelpSearchData['location'] = $scope.locationQuery;


	    	// Yelp Fusion Post Request
	    	$http({
	    		method: 'POST',
	    		url: '/api/yelpFusionSearch',
	    		data: yelpSearchData
	    	}).then(function successCallback(response) {

	            //console.log(response);
	            //console.log(response.data.results);
	            //$scope.googlePlacesResultsArray = response.data.results;
	            $scope.yelpFusionResultsArray = response.data.businesses;

	        }, function errorCallback(error) {
	            console.log(error);
	        }); 


        };


        $scope.clientDetailsSearch = function() {

        	$scope.businessAddState = 'details';

        	//console.log("Google Id: " + $scope.googlePlacesMatch.id);
        	//console.log("Yelp Id: " + $scope.yelpFusionMatch.id);
        	var googleDetailsData = {};
        	googleDetailsData['id'] = $scope.googlePlacesMatch.id;
        	//console.log($scope.googlePlacesMatch.id);

        	//  Google Places Post Request
	    	$http({
	    		method: 'POST',
	    		url: '/api/googlePlacesDetails',
	    		data: googleDetailsData
	    	}).then(function successCallback(response) {

	            //console.log(response);
	            var str = JSON.stringify(response.data.result, null, 2);

				//output(str, "google-details-results");
				output(syntaxHighlight(str), "google-details-results");

        		$scope.businessData.name = response.data.result.name;


	        }, function errorCallback(error) {
	            console.log(error);
	        });


	    	//Yelp Fusion Query Object
	    	var yelpDetailsData = {};
	    	yelpDetailsData['id'] = $scope.yelpFusionMatch.id;


	    	// Yelp Fusion Post Request
	    	$http({
	    		method: 'POST',
	    		url: '/api/yelpFusionDetails',
	    		data: yelpDetailsData
	    	}).then(function successCallback(response) {

	            var str = JSON.stringify(response.data, null, 2);

				output(syntaxHighlight(str), "yelp-details-results");

        		$scope.yelpDetailsResults = response.data;

	        }, function errorCallback(error) {
	            console.log(error);
	        });



        }
















        //this function and the one below it pretty print json

		function output(inp, divId) {
			var targetDiv = document.getElementById(divId);
		    targetDiv.appendChild(document.createElement('pre')).innerHTML = inp;
		}        


		function syntaxHighlight(json) {
		    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
		    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
		        var cls = 'number';
		        if (/^"/.test(match)) {
		            if (/:$/.test(match)) {
		                cls = 'key';
		            } else {
		                cls = 'string';
		            }
		        } else if (/true|false/.test(match)) {
		            cls = 'boolean';
		        } else if (/null/.test(match)) {
		            cls = 'null';
		        }
		        return '<span class="' + cls + '">' + match + '</span>';
		    });
		}





    }
})();

