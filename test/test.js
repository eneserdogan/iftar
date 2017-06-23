const expect 	= require('chai').expect;
const Request   = require('request');

describe('Iftar Command Line Tools', function() {
    it('<city> => "Istanbul" <response.status> => "200"', function() {
        Request(`http://www.namazvaktim.net/json/gunluk/istanbul.json`, function (error, response, body) {
             expect(response.statusCode).to.not(200);
        });
    });
});
