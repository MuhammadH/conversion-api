/*
CSC3916 HW2
File: Server.js
Description: Web API scaffolding for Movie API
 */

var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var cors = require('cors');
const fetch = require("node-fetch");
var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(passport.initialize());

var router = express.Router();

function getJSONObjectForMovieRequirement(req) {
    var json = {
        headers: "No headers",
        // key: process.env.UNIQUE_KEY,
        body: "No body"
    };

    if (req.body != null) {
        json.body = req.body;
    }

    if (req.headers != null) {
        json.headers = req.headers;
    }

    return json;
}

router.route('/conversion')
    .post(function(req, res) {
        if (!req.body.amount || !req.body.currency) {
            res.json({success: false, msg: 'Please include all data.'});
            return;
        }

        let original_amount = !req.body.amount;
        let to_currency = req.body.currency;

        async function fetchRate(symb, amount) {
            let end_result = 0;
            await fetch(`http://data.fixer.io/api/latest?access_key=c7600905a5e8c73a1e3b9e87c6c9da8e&symbols=` + symb)
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    let rate = data.rates;
                    console.log(rate);
                    let final_rate = rate[Object.keys(rate)[0]];
                    console.log(final_rate);
                    let final_amount = amount * final_rate;
                    final_amount = Math.round(final_amount * 100)/100;
                    end_result = final_amount;
                    console.log(final_amount);
                })
            console.log(end_result + ' here');
            return end_result;
        }

        fetchRate(to_currency, original_amount).then(result => {
            console.log(result + ' js is weird');
            res.json({status: 200, success: true, new_amount: result});
        })

        }
    )
    .get(function(req, res) {
            console.log(req.body);
            // set status code

            let id = " ";
            if (req.body.movie) {
                id = req.body.movie;
            }
            if (req.headers.movie) {
                id = req.headers.movie;
            }

    }
    )
;




router.route('/reviews')
    .post(function(req, res) {
        if (!req.body.reviewer_name || !req.body.rating || !req.body.movie || !req.body.review) {
            res.json({success: false, msg: 'Please include all data.'});
            return;
        }

        var new_rev = new Review();

        new_rev.reviewer_name = req.body.reviewer_name;
        new_rev.rating = req.body.rating;
        new_rev.movie = req.body.movie;
        new_rev.review = req.body.review;

        let id = req.body.movie;

        Movie.findOne({ title: id }).select('title year genre cast').exec(function(err, movie) {
            // Movie.findById(id, function(err, movie) {
            if (!movie) {
                return res.json({ success: false, message: 'movie does not exist.'});
            } else if (movie) {
                new_rev.save(function(err){
                    if (err) {
                        if (err.code == 11000)
                            return res.json({ success: false, message: 'review failed to save.'});
                        else
                            return res.json(err);
                    }

                    res.json({success: true, msg: 'Successfully created new review.'})
                });
            }
        })

        }
    )
    .get(function(req, res) {
        if (!req.body.id) {
            res.json({success: false, msg: 'Please include all data.'});
            return;
        }

        // check if movie exists
        let id = req.body.id;
        Movie.findOne({ title: id }).select('title year genre cast').exec(function(err, movie) {
            // Movie.findById(id, function(err, movie) {
            if (movie) {
                Review.findOne({ movie: id }).select('reviewer_name rating movie review').exec(function(err, review) {
                    if(review) {
                        //var review_json = JSON.stringify(review);
                        res.json({status: 200, success: true, reviews: review});
                    } else {

                    }
                });
            } else {
                return res.json({ success: false, message: 'movie does not exist.'});
            }
        })



        }
    )
;





app.use('/', router);
app.listen(process.env.PORT || 8080);
module.exports = app; // for testing only


