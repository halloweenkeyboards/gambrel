'use strict'

var express = require('express');
var app = express();
var _ = require('underscore');
var bodyParser = require('body-parser');
var logger = require('morgan');
var request = require('request');
var yelp = require('yelp-fusion');

var Config = require('./config.js');



    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());

    app.use(logger('dev'));

    var api = '/api';


    app.post(api + '/googlePlacesSearch', googlePlacesSearch);
    app.post(api + '/yelpFusionSearch', yelpFusionSearch);
    app.post(api + '/googlePlacesDetails', googlePlacesDetails);
    app.post(api + '/yelpFusionDetails', yelpFusionDetails);

    function googlePlacesSearch(req, res) {
		request('https://maps.googleapis.com/maps/api/place/textsearch/json?query=' + req.body.query + '&key=' + Config.google_api_key, function (err, response, body) {
			if (err) {
				console.log('error:', err);
			} else {
				console.log("RESPONSE Google Places API - Search " + response.statusCode);
				res.send(body);
			}

		});
    }


    function yelpFusionSearch(req, res) {

		var client = yelp.client(Config.yelp_access_token);

		client.search(req.body).then(response => {
			console.log("RESPONSE Yelp Fusion API - Search " + response.statusCode);
			res.send(response.jsonBody);
		}).catch(e => {
			console.log(e);
		});

    }


    function googlePlacesDetails(req, res) {
        request('https://maps.googleapis.com/maps/api/place/details/json?placeid=' + req.body.id + '&key=' + Config.google_api_key, function (err, response, body) {
            if (err) {
                console.log('error:', err);
            } else {
                console.log("RESPONSE Google Places API - Details " + response.statusCode);
                res.send(body);
            }

        });
    }

    function yelpFusionDetails(req, res) {
        var client = yelp.client(Config.yelp_access_token);

        client.business(req.body.id).then(response => {
            console.log("RESPONSE Yelp Fusion API - Buisiness " + response.statusCode);
            res.send(response.jsonBody);
        }).catch(e => {
            console.log(e);
        });

    }
    







    console.log('** DEV **');
    app.use(express.static('./src/client/'));
    app.use(express.static('./'));
    app.use(express.static('./tmp'));
    app.use('/businessAdd', express.static('./src/client/businessAdd.html'));
    app.use('/businessData', express.static('./src/client/businessData.html'));
    app.use('/businessList', express.static('./src/client/businessList.html'));
    app.use('/productList', express.static('./src/client/productList.html'));
    app.use('/config', express.static('./src/client/config.html'));
    app.use('/*', express.static('./src/client/index.html'));

var port = 8080; 
app.listen(port);
console.log("App listening on port " + port);