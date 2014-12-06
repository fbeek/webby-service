var express = require('express');
var router = express.Router();
var builder = require('xmlbuilder');
var util = require('util');
var dateFormat = require('dateformat');

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { title: 'News' });
});

router.get('/list', function(req,res){

    var date = new Date();
    var newsObject = {
        NEWS : {
            data_validita : dateFormat(date, "yyyy-mm-dd"),
            ora_presunta_aggiornamento : dateFormat(date, "HH:MM"),
            RES : {
                '@LASTHIT' : 10,
                '@FIRSTHIT' : 1,
                '#list': [
                    {
                       HIT:{
                            '@NO' : 1,
                            ID: 1,
                            T: 'Headline One',
                            H: dateFormat(date, "HH:MM"),
                            P: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam"
                       }
                    },
                    {
                        HIT:{
                            '@NO' : 2,
                            ID: 2,
                            T: 'Headline One',
                            H: dateFormat(date, "HH:MM"),
                            P: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam"
                        }
                    },
                    {
                        HIT:{
                            '@NO' : 2,
                            ID: 2,
                            T: 'Headline One',
                            H: dateFormat(date, "HH:MM"),
                            P: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam"
                        }
                    }
                    ,{
                        HIT:{
                            '@NO' : 3,
                            ID: 3,
                            T: 'Headline One',
                            H: dateFormat(date, "HH:MM"),
                            P: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam"
                        }
                    }
                ]
            }
        }
    };

    var xml = builder.create(newsObject);
    var xmlString = xml.end();
    util.log('Send news list');
    res.set('Content-Type', 'text/xml');
    res.send(xmlString);

});

module.exports = router;