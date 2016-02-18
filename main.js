var express = require('express');
var moment = require('moment');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var Q = require('q');

var app = express();

var DB_URL = 'mongodb://localhost:27017/bodybuilding';
var APP_PORT = 3000;

function query(handler) {
    MongoClient.connect(DB_URL, function (err, db) {
        handler(db, function () {
            db.close();
        });
    });
}

app.get('/meals', function (req, res) {
    query(function (db, done) {
        db.collection('meals').find({}).toArray(function (err, meals) {
            if (err) {
                res.status(500).json({ error: err });
                return done();
            }

            res.json({ meals: meals });
            done();
        });
    });
});

app.get('/items', function (req, res) {
    query(function (db, done) {
        db.collection('items').find({}).toArray(function (err, items) {
            if (err) {
                res.status(500).json({ error: err });
                return done();
            }

            res.json({ items: items });
            done();
        });
    });
});

app.get('/stats', function (req, res) {
    query(function (db, done) {
        db.collection('stats').findOne({}, function (err, stats) {
            if (err) {
                res.status(500).json({ error: err });
                return done();
            }

            res.json({ stats: stats });
            done();
        });
    });
});

app.post('/items', function (req, res) {
    query(function (db, done) {
        var today = moment().format('DD.MM.YYYY');

        db.collection('items').findOneAndReplace({ date: today }, { date: today, items: req.body.items }, { upsert: true }, function (err) {
            if (err) {
                res.status(500).json({ error: err });
                return done();
            }

            res.json({});
            done();
        });
    });
});

app.post('/stats', function (req, res) {
    query(function (db, done) {
        var today = moment().format('DD.MM.YYYY');
        var stats = req.body.stats;

        stats.date = today;

        db.collection('stats').findOneAndReplace({ date: today }, stats, { upsert: true }, function (err) {
            if (err) {
                res.status(500).json({ error: err });
                return done();
            }

            res.json({});
            done();
        });
    });
});

app.use(bodyParser.json());

app.listen(APP_PORT, function () {
    console.log('Example app listening on port', APP_PORT);
});