// imports
var Twitter = require('twitter');
var bigInt = require("big-integer");

var MAX_BIGINT = bigInt('99999999999999999999');
var MIN_BIGINT = bigInt('-99999999999999999999');

// static class definition
var twitterService = {
    getClient: new Promise(function (resolve) {
        resolve(new Twitter({
            consumer_key: process.env.TWITTER_CONSUMER_KEY,
            consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
            access_token_key: '',
            access_token_secret: ''
        }));
    }),

    getTweets: function (q, max_id, since_id) {
        if (max_id && MAX_BIGINT.minus(1).eq(max_id)) {
            max_id = undefined;
        } else if (max_id && max_id.toString) {
            max_id = max_id.toString();
        }
        if (since_id && MIN_BIGINT.plus(1).eq(since_id)) {
            since_id = undefined;
        } else if (since_id && since_id.toString) {
            since_id = since_id.toString();
        }

        return twitterService.getClient.then(function (client) {
            return new Promise(function (res, rej) {
                client.get('search/tweets', {
                    max_id: max_id,
                    since_id: since_id,
                    q: q,
                    count: 100,
                    result_type: 'recent'
                }, function (error, tweets) {
                    if (error) {
                        rej(error);
                        return;
                    }

                    tweets.statuses = tweets.statuses.map((v) => {
                        v.id = bigInt(v.id_str);
                        return v;
                    });

                    res(tweets);
                });
            });
        });
    }
};

// export
module.exports = twitterService;