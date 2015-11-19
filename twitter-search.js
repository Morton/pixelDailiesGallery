/**
 * Created by morton on 18/11/15.
 */

var Twitter = require('twitter');
var fs = require('fs');
var jsonfile = require('jsonfile');

// init
var client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: '',
    access_token_secret: ''
});

function loadTweets(q, max_id, since_id) {
    return new Promise(function (res, rej) {
        client.get('search/tweets', {max_id: max_id, since_id: since_id, q: q, count: 100, result_type: 'recent'}, function (error, tweets) {
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
                hashtags: (v.entities.hashtags ? v.entities.hashtags.map(function (v) { return v.text }) : []),
                mentions: (v.entities.user_mentions ? v.entities.user_mentions.map(function (v) { return v.screen_name }) : []),
                medias: (v.entities.media ? v.entities.media.map(function (v) { return { url: v.media_url, type: v.type } }) : []),
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
                hashtags: (v.entities.hashtags ? v.entities.hashtags.map(function (v) { return v.text }) : []),
                id: v.id
            };
        });

        res(result);
    });
}

function fileExists(filePath) {
    try {
        return fs.statSync(filePath).isFile();
    }
    catch (err) {
        return false;
    }
}

// load file
var filename = 'data.json';
var allTweets = {};

if (fileExists(filename)) {
    allTweets = jsonfile.readFileSync(filename);
} else {
    allTweets = {
        meta: {
            max_id: Number.MAX_VALUE,
            since_id: undefined,
            topics_max_id: Number.MAX_VALUE,
            topics_since_id: undefined
        },
        tweets: [],
        topics: []
    };
}

// define correct tweet-range
var max_id, since_id, topics_max_id, topics_since_id;
if (allTweets.meta.max_id) {
    max_id = allTweets.meta.max_id;
    since_id = undefined;
} else {
    max_id = undefined;
    since_id = allTweets.meta.since_id;
}
if (allTweets.meta.topics_max_id) {
    topics_max_id = allTweets.meta.topics_max_id;
    topics_since_id = undefined;
} else {
    topics_max_id = undefined;
    topics_since_id = allTweets.meta.topics_since_id;
}

// process tweets
loadTweets('#pixel_dailies @Pixel_Dailies ', max_id, since_id)
    .then(filterSearchResult)
    .then((tweets) => new Promise((res, rej) => {
        loadTweets('from:Pixel_Dailies ', topics_max_id, topics_since_id)
            .then(filterTopics)
            .then(function (topics) {
                console.log("Got", topics.topics.length, "new", (topics_max_id?"tail":"head"), "topics.");

                tweets.meta.topics_max_id = topics.meta.max_id;
                tweets.meta.topics_since_id = topics.meta.since_id;
                tweets.topics = topics.topics;
                res(tweets);
            })
            .catch(function (err) {
                rej(err);
            });
    }))
    .then(function (tweets) {
        console.log("Got", tweets.tweets.length, "new", (max_id?"tail":"head"), "tweets.");

        // Merge new tweets
        if (tweets.meta.max_id < allTweets.meta.max_id) {
            allTweets.meta.max_id = tweets.meta.max_id;
        }
        if (tweets.meta.since_id > allTweets.meta.since_id) {
            allTweets.meta.since_id = tweets.meta.since_id;
        }
        if (tweets.meta.topics_max_id < allTweets.meta.topics_max_id) {
            allTweets.meta.topics_max_id = tweets.meta.topics_max_id;
        }
        if (tweets.meta.topics_since_id > allTweets.meta.topics_since_id) {
            allTweets.meta.topics_since_id = tweets.meta.topics_since_id;
        }
        allTweets.tweets = allTweets.tweets.concat(tweets.tweets);
        allTweets.topics = allTweets.topics.concat(tweets.topics);

        console.log("Collection has", allTweets.tweets.length, "tweets and", allTweets.topics.length, "topics at all.");

        // write to file
        jsonfile.writeFileSync(filename, allTweets);
    })
    .catch(function (err) {
        console.error(err);
    });