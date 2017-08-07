var mocha = require('mocha');
var chai = require('chai');
var expect = chai.expect;
var http = require('http');
var request = require("request")

 //var currencies = require('./api/currencies');

describe("When you get currency object", function() {
    it("Is the number of days 10", function(done) {
		request({
		    url: 'http://localhost:8000/api/currencies',
		    json: true
		}, function (error, response, body) {

		    if (!error && response.statusCode === 200) {
		       // console.log(Object.keys(body)) 
		      expect(Object.keys(body).length).to.be.above(9);
		      done();
		    }
		});   
    });
    it("Number of currencies returned should be 172", function(done) {
		request({
		    url: 'http://localhost:8000/api/currencies',
		    json: true
		}, function (error, response, body) {

		    if (!error && response.statusCode === 200) {
		       // console.log(Object.keys(body)) 
		       var firstKey = Object.keys(body)[0];
		      // console.log(firstKey);
		      expect(Object.keys(body[firstKey].rates).length).to.be.above(171);
		      done();
		    }
		});   
    });
});