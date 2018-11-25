var express = require('express');
var research = require('../modules/research');
var router = express.Router();


/* GET home page. */
router.get('/', function (req, res, next) {


    res.render('search');
})
;


//Search all the correspondances and Parking lots
router.get('/options', function (req, res, next) {


    res.render('option');

});


//Search all the correspondances and Parking lots
router.post('/result', function (req, res, next) {

    research.correspondances(req.body).then((dataTrain) => {
        research.find3FirstStation(req.body).then((nearbyStation) => {
            research.parkingDataStations(nearbyStation).then((parkingDataStations) => {

                console.log(parkingDataStations);
                res.render('parkings', {dataTrain: JSON.parse(dataTrain), dataParking: nearbyStation});
            });
        });
    });
});


module.exports = router;





