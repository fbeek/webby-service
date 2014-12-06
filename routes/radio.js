var express = require('express');
var router = express.Router();
var tar = require('tar-fs');
var zlib = require('zlib');
var fs = require('fs');
var util = require('util');
var builder = require('xmlbuilder');
var dateFormat = require('dateformat');
var checksum = require('checksum');

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { title: 'Radio' });
});

router.get('/catalog/list', function(req,res){

    util.log('GOT Request from Device '+ req.query.device +' with SN '+ req.query.sn +' and Version ' +req.query.ver);

    var sourceFile = 'radio_list.csv';
    var sourceDir = 'data/original/'
    var target = 'data/_generated/radio_list.tar.gz';

    if (fs.existsSync(sourceDir+sourceFile)) {
        var gzip = zlib.createGzip({
            level: 6,
            memLevel: 6
        });

        var pack = tar.pack(sourceDir, {
            entries: [sourceFile] // only the specific entries will be packed
        });
        pack.pipe(gzip).pipe(fs.createWriteStream(target,{encoding: 'binary'}));
        pack.on('end',function(){
            checksum.file(target,{algorithm: 'md5'}, function (err, sum) {
                var date = new Date();
                var radioListObj = {
                    radioList: {
                        lastBuildDate: dateFormat(date, "yyyy-mm-dd")+'T'+dateFormat(date,"HH:MM:ss"),
                        date_validity: 0,
                        estimated_update_time: dateFormat(date, "HH:MM:ss"),
                        catalog_radio:{
                            url_catalog_radio: process.env.SERVICEHOSTNAME+'radio/file/radio_list.tar.gz',
                            md5_catalog_radio: sum
                        },
                        list_category:{
                            '#list': [
                                { category: { label: "Top Radio", dbColumn: 'Group', filter: 'TopRadio'} },
                                { category: { label: "Deutsche Radiosender", dbColumn: 'Continent', filter: 'All'} }
                            ]
                        }
                    }
                }
                var xml = builder.create(radioListObj);
                var xmlString = xml.end();

                res.set('Content-Type', 'text/xml');
                res.send(xmlString);
            });
        });

    }



});

router.post('/catalogo/verifyTransfer',function(req, res){

    util.log('GOT Verify from Device '+ req.query.device +' with SN '+ req.query.sn);
    var radioListObj = {
        Download_description: {
            Transfer_Complete: 'YES',
            Device_Name: 'UEBBI Radiosveglia di Alice',
            Manufacturer: 'Promelit_AVT'
        }
    };

    var xml = builder.create(radioListObj);
    var xmlString = xml.end({ pretty: true});

    res.set('Content-Type', 'text/xml');
    res.send(xmlString);
});

router.get('/file/:name',function(req, res){
    var fileName = req.params.name;
    res.sendFile(fileName, {root: 'data/_generated/'},function (err) {
        if (err) {
            util.log(err);
            res.status(404).end();
        }
        else {
            util.log('Sent: '+fileName);
        }
    });
});

module.exports = router;