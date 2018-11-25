const http = require('http');
var self = module.exports = {

    correspondances(body) {
        return new Promise((resolve, reject) => {

            var urlTrain = 'http://transport.opendata.ch/v1/connections?from=' + body.dep + '&to=' + body.arr + '&date=' + body.date + '&time=' + body.time + '&isArrivalTime=' + body.isArrivalTime;

            http.get(urlTrain, (resp) => {
                let dataTrain = '';

                // A chunk of data has been recieved.
                resp.on('data', (chunk) => {
                    dataTrain += chunk;
                });

                resp.on('end', () => {
                    resolve(dataTrain);
                });

            }).on("error", (err) => {
                console.log("Error: " + err.message);
            });


        });
    },

    find3FirstStation(body) {
        return new Promise((resolve, reject) => {

            var stationsNearby = [];

            var urlTrain = 'http://transport.opendata.ch/v1/connections?from=' + body.dep + '&to=' + body.arr + '&date=' + body.date + '&time=' + body.time + '&isArrivalTime=' + body.isArrivalTime;
            http.get(urlTrain, (resp) => {
                let dataTrain = '';

                // A chunk of data has been recieved.
                resp.on('data', (chunk) => {
                    dataTrain += chunk;
                });
                resp.on('end', () => {
                    for (var i = 0; j = 3, i < j; i++) {

                        var conn = JSON.parse(dataTrain).connections[0];

                        stationsNearby.push(JSON.parse(dataTrain).connections[0].sections[0].journey.passList[i].station.name)
                    }
                    resolve(stationsNearby);

                });
            }).on("error", (err) => {
                console.log("Error: " + err.message);
            });


        });
    },

    parkingData(station) {
        return new Promise((resolve, reject) => {


            var urlParking = 'http://data.sbb.ch/api/records/1.0/search/?dataset=linie-mit-betriebspunkten&q=' + station;

            http.get(urlParking, (resp) => {
                let parkingData = '';

                // A chunk of data has been recieved.
                resp.on('data', (chunk) => {
                    parkingData += chunk;
                });

                resp.on('end', () => {
                    resolve(parkingData);
                });

            }).on("error", (err) => {
                console.log("Error: " + err.message);
            });
        });
    },

    parkingDataStations(stations) {
        return new Promise((resolve, reject) => {

            var parkingDataStations = [];
            var sat = stations;
            for (var i = 0; j = stations.length, i < j; i++) {
                self.parkingData(stations[i]).then((parkingData) => {
                    parkingDataStations.push(parkingData)
                });
            }

            //Wait for other Promise (I know realy bad like this)
            setTimeout(function() {
                resolve(parkingDataStations);
            }, 1000);

        });
    },

    getAllStations() {
        return new Promise((resolve, reject) => {

            var stations = [];

            var url = 'http://data.sbb.ch/api/records/1.0/search/?dataset=betriebspunkte-didok&rows=1000&refine.haltestelle=*';

            http.get(url, (resp) => {
                let allStations = '';

                // A chunk of data has been recieved.
                resp.on('data', (chunk) => {
                    allStations += chunk;
                });

                resp.on('end', () => {
                    for(i in JSON.parse(allStations).records){
                        stations.push(JSON.parse(allStations).records[i].fields.gdname);
                    }

                    resolve(stations);
                });

            }).on("error", (err) => {
                console.log("Error: " + err.message);
            });
        });
    },


};