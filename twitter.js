// imports
var Twitter = require('twitter');

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
                    }

                    res(tweets);
                });
            });
        });
    }
};

// export
module.exports = twitterService;