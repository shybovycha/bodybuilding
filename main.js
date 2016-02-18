var express = require('express');
var moment = require('moment');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;

var app = express();

var DB_URL = 'mongodb://localhost:27017/bodybuilding';
var APP_PORT = 3000;

var dbPromise = MongoClient.connect(DB_URL);

function getTodayDate() {
    return moment().format('DD.MM.YYYY');
}

app.get('/meals', function (req, res) {
    dbPromise
        .then(function (db) {
            return db.collection('meals').find({}).toArray();
        })
        .then(function (meals) {
            res.json({ meals: meals });
        })
        .catch(function (err) {
            res.status(500).text(err);
        });
});

app.get('/items', function (req, res) {
    dbPromise
        .then(function (db) {
            return db.collection('items').find({}).toArray();
        })
        .then(function (items) {
            res.json({ items: items });
        })
        .catch(function (err) {
            res.status(500).text(err);
        });
});

app.get('/stats', function (req, res) {
    dbPromise
        .then(function (db) {
            return db.collection('stats').findOne({});
        })
        .then(function (stats) {
            res.json({ stats: stats });
        })
        .catch(function (err) {
            res.status(500).text(err);
        });
});

app.post('/items', function (req, res) {
    var today = getTodayDate();

    dbPromise
        .then(function (db) {
            return db.collection('items').findOneAndReplace({ date: today }, { date: today, items: req.body.items }, { upsert: true });
        })
        .then(function () {
            res.json({});
        })
        .catch(function (err) {
            res.status(500).text(err);
        });
});

app.post('/stats', function (req, res) {
    var today = getTodayDate();

    var stats = req.body.stats;
    stats.date = today;

    dbPromise
        .then(function (db) {
            return db.collection('stats').findOneAndReplace({ date: today }, stats, { upsert: true });
        })
        .then(function () {
            res.json({});
        })
        .catch(function (err) {
            res.status(500).text(err);
        });
});

app.use(bodyParser.json());

app.listen(APP_PORT, function () {
    console.log('Example app listening on port', APP_PORT);
});