/*
CSC3916 final project api
Description: Web API for currency cost conversion
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

        let original_amount = req.body.amount;
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
                    console.log(final_rate + ' final rate');
                    let final_amount = amount * final_rate;
                    final_amount = Math.round(final_amount * 100)/100;
                    console.log(final_amount + ' final amount');
                    end_result = final_amount;
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
            res.json({status: 200, success: true, message: 'use post (for body)'});
    }
    )
;





app.use('/', router);
app.listen(process.env.PORT || 8080);
module.exports = app; // for testing only


