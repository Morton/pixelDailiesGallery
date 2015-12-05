/**
 * Created by morton on 18/11/15.
 */

var persistenceService = require('./persistence.js');
var Twitter = require('twitter');

// init
var client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: '',
    access_token_secret: ''
});

function loadTweets(q, max_id, since_id) {
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
}
function filterSearchResult(data) {
    return new Promise(function (res) {
        var result = {};

        var parsedMaxId = /.*?max_id=(.*?)&.*?/.exec(data.search_metadata.next_results);
        var parsedSinceId = /.*?since_id=(.*?)&.*?/.exec(data.search_metadata.refresh_url);
        result.meta = {
            max_id: (parsedMaxId && parsedMaxId.length > 1 ? parsedMaxId[1] : undefined),
            since_id: (parsedSinceId && parsedSinceId.length > 1 ? parsedSinceId[1] : undefined)
        };
        result.topics = data.statuses.filter(function (v) {
            // ignore RTs
            if (v.text.substr(0, 3) === "RT ") {
                return false;
            }

            // only tweets by pixel_dailies can contain topics
            return v.user.screen_name.toLowerCase() == 'pixel_dailies';
        })/*.map(function (v) {
         return {
         text: v.text,
         creation_date: v.created_at,
         hashtags: (v.entities.hashtags ? v.entities.hashtags.map(function (v) { return v.text }) : []),
         mentions: (v.entities.user_mentions ? v.entities.user_mentions.map(function (v) { return v.screen_name }) : []),
         medias: (v.entities.media ? v.entities.media.map(function (v) { return { url: v.media_url, type: v.type } }) : []),
         id: v.id,
         user_id: v.user.screen_name,
         user_name: v.user.name
         };
         })*/;
        result.tweets = data.statuses.filter(function (v) {
            // ignore RTs
            if (v.text.substr(0, 3) === "RT ") {
                return false;
            }
            // remove all without media
            return !(!v.entities.media || v.entities.media.length === 0);
        }).map(function (v) {
            return {
                text: v.text,
                creation_date: v.created_at,
                hashtags: (v.entities.hashtags ? v.entities.hashtags.map(function (v) {
                    return v.text
                }) : []),
                mentions: (v.entities.user_mentions ? v.entities.user_mentions.map(function (v) {
                    return v.screen_name
                }) : []),
                medias: (v.entities.media ? v.entities.media.map(function (v) {
                    return {url: v.media_url, type: v.type}
                }) : []),
                id: v.id,
                user_id: v.user.screen_name,
                user_name: v.user.name
            };
        });

        res(result);
    });
}
function filterTopics(data) {
    return new Promise(function (res) {
        var result = {};

        var parsedMaxId = /.*?max_id=(.*?)&.*?/.exec(data.search_metadata.next_results);
        var parsedSinceId = /.*?since_id=(.*?)&.*?/.exec(data.search_metadata.refresh_url);
        result.meta = {
            max_id: (parsedMaxId && parsedMaxId.length > 1 ? parsedMaxId[1] : undefined),
            since_id: (parsedSinceId && parsedSinceId.length > 1 ? parsedSinceId[1] : undefined)
        };
        result.topics = data.statuses.filter(function (v) {
            // ignore RTs
            if (v.text.substr(0, 3) === "RT ") {
                return false;
            }

            // only tweets by pixel_dailies can contain topics
            return v.user.screen_name.toLowerCase() == 'pixel_dailies';
        }).map(function (v) {
            return {
                text: v.text,
                creation_date: v.created_at,
                hashtags: (v.entities.hashtags ? v.entities.hashtags.map(function (v) {
                    return v.text
                }) : []),
                id: v.id
            };
        });

        res(result);
    });
}


// process
Promise.all([
    Promise.all([persistenceService.getTweetsMaxId(), persistenceService.getTweetsSinceId()])
        .then(function (args) {
            var _max_id = args[0];
            var _since_id = args[1];

            if (_max_id) {
                max_id = _max_id;
                since_id = undefined;
            } else {
                max_id = undefined;
                since_id = _since_id;
            }

            console.log('tweets', max_id, since_id);

            return [max_id, since_id];
        })
        .then(function (args) {
            var max_id = args[0];
            var since_id = args[1];

            return loadTweets('#pixel_dailies @Pixel_Dailies ', max_id, since_id)
        })
        .then(filterSearchResult)
        .then(function (tweets) {
            console.log("Got", tweets.tweets.length, "new", "tweets.");
            return tweets;
        }),
    Promise.all([persistenceService.getTopicsMaxId(), persistenceService.getTopicsSinceId()])
        .then(function (args) {
            var _max_id = args[0];
            var _since_id = args[1];

            if (_max_id) {
                max_id = _max_id;
                since_id = undefined;
            } else {
                max_id = undefined;
                since_id = _since_id;
            }

            console.log('topics', max_id, since_id);

            return [max_id, since_id];
        })
        .then(function (args) {
            var max_id = args[0];
            var since_id = args[1];

            return loadTweets('from:Pixel_Dailies ', max_id, since_id)
        })
        .then(filterTopics)
        .then(function (topics) {
            console.log("Got", topics.topics.length, "new", "topics.");
            return topics;
        })
])
    .then(function (args) {
        var tweets = args[0];
        var topics = args[1];

        return Promise.all([
            persistenceService.setTweetsMaxId(tweets.meta.max_id),
            persistenceService.setTweetsSinceId(tweets.meta.since_id),
            persistenceService.setTopicsMaxId(topics.meta.max_id),
            persistenceService.setTopicsSinceId(topics.meta.since_id),
            persistenceService.getTweets().then((oldTweets) => persistenceService.setTweets(oldTweets.concat(tweets.tweets))),
            persistenceService.getTopics().then((oldTopics) => persistenceService.setTopics(oldTopics.concat(topics.topics)))
        ]);
    })
    .then(function (args) {
        var tweets = args[4];
        var topics = args[5];
        console.log("Collection has", tweets.length, "tweets and", topics.length, "topics at all.");
    })
    .catch(function (err) {
        console.error(err);
    });