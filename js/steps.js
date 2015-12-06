// imports
var persistenceService = require('./services/persistence.js');
var twitterService = require('./services/twitter.js');
var duplicateService = require('../syncAnalysis');
var bigInt = require("big-integer");

var MAX_BIGINT = bigInt('99999999999999999999');
var MIN_BIGINT = bigInt('-99999999999999999999');

var toString = (x) => (x&&x.toString?x.toString():x);

// static class definition
var steps = {
    errorHandler: function (err) {
        console.error(err);
        console.error(err.stack);
    },

    retrieveTweetsMaxAndSinceId: () => Promise.all([persistenceService.getTweetsMaxId(), persistenceService.getTweetsSinceId()]),
    calcTweetsMaxAndSinceId: function (args) {
        var _max_id = args[0];
        var _since_id = args[1];
        var max_id, since_id;

        if (_max_id) {
            max_id = _max_id.minus(1);
            since_id = undefined;
        } else {
            max_id = undefined;
            since_id = _since_id.plus(1);
        }

        console.log('tweets', toString(max_id), toString(since_id));

        return [max_id, since_id];
    },
    retrieveTweets: function (args) {
        var max_id = args[0];
        var since_id = args[1];

        return twitterService.getTweets('#pixel_dailies @Pixel_Dailies ', max_id, since_id);
    },
    filterSearchResult: function (data) {
        return new Promise(function (res) {
            var result = {};

            //var parsedMaxId = /.*?max_id=(.*?)&.*?/.exec(data.search_metadata.next_results);
            //var parsedSinceId = /.*?since_id=(.*?)&.*?/.exec(data.search_metadata.refresh_url);
            //result.meta = {
            //    max_id: (parsedMaxId && parsedMaxId.length > 1 ? parsedMaxId[1] : undefined),
            //    since_id: (parsedSinceId && parsedSinceId.length > 1 ? parsedSinceId[1] : undefined)
            //};
            result.meta = {
                max_id: data.statuses.reduce((p, v) =>(p.gt(v.id) ? v.id : p), MAX_BIGINT),
                since_id: data.statuses.reduce((p, v) =>(p.lt(v.id) ? v.id : p), MIN_BIGINT),
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
    },
    logTweetResult: function (tweets) {
        console.log("Got", tweets.tweets.length, "new", "tweets.");
        return tweets;
    },

    retrieveTopicsMaxAndSinceId: () => Promise.all([persistenceService.getTopicsMaxId(), persistenceService.getTopicsSinceId()]),
    calcTopicMaxAndSinceId: function (args) {
        var _max_id = args[0];
        var _since_id = args[1];
        var max_id, since_id;

        if (_max_id) {
            max_id = _max_id.minus(1);
            since_id = undefined;
        } else {
            max_id = undefined;
            since_id = _since_id.plus(1);
        }

        console.log('topics', toString(max_id), toString(since_id));

        return [max_id, since_id];
    },
    retrieveTopics: function (args) {
        var max_id = args[0];
        var since_id = args[1];

        return twitterService.getTweets('from:Pixel_Dailies ', max_id, since_id)
    },
    filterTopics: function (data) {
        return new Promise(function (res) {
            var result = {};

            //var parsedMaxId = /.*?max_id=(.*?)&.*?/.exec(data.search_metadata.next_results);
            //var parsedSinceId = /.*?since_id=(.*?)&.*?/.exec(data.search_metadata.refresh_url);
            //result.meta = {
            //    max_id: (parsedMaxId && parsedMaxId.length > 1 ? parsedMaxId[1] : undefined),
            //    since_id: (parsedSinceId && parsedSinceId.length > 1 ? parsedSinceId[1] : undefined)
            //};
            result.meta = {
                max_id: data.statuses.reduce((p, v) =>(p.gt(v.id) ? v.id : p), MAX_BIGINT),
                since_id: data.statuses.reduce((p, v) =>(p.lt(v.id) ? v.id : p), MIN_BIGINT),
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
    },
    logTopicResult: function (topics) {
        console.log("Got", topics.topics.length, "new", "topics.");
        return topics;
    },

    persistTweetsAndTopics: function (args) {
        var tweets = args[0];
        var topics = args[1];

        console.log(tweets.meta.max_id.toString(), tweets.meta.since_id.toString(), topics.meta.max_id.toString(), topics.meta.since_id.toString());

        return Promise.all([
            persistenceService.getTweetsMaxId().then((maxId) => (!tweets.meta.max_id || maxId.gt(tweets.meta.max_id) ? persistenceService.setTweetsMaxId(tweets.meta.max_id) : maxId)),
            persistenceService.getTweetsSinceId().then((sinceId) => (!tweets.meta.since_id || sinceId.lt(tweets.meta.since_id) ? persistenceService.setTweetsSinceId(tweets.meta.since_id) : sinceId)),
            persistenceService.getTopicsMaxId().then((maxId) => (!topics.meta.max_id || maxId.gt(topics.meta.max_id) ? persistenceService.setTopicsMaxId(topics.meta.max_id) : maxId)),
            persistenceService.getTopicsSinceId().then((sinceId) => (!topics.meta.since_id || sinceId.lt(topics.meta.since_id) ? persistenceService.setTopicsSinceId(topics.meta.since_id) : sinceId)),
            persistenceService.addTweets(tweets.tweets),
            persistenceService.addTopics(topics.topics)
        ]);
    },
    logProcessResults: function (args) {
        var tweets = args[4];
        var topics = args[5];
        console.log("Collection has", tweets.length, "tweets and", topics.length, "topics at all.");
    },
    analyseDuplicates: function () {
        return Promise.all([duplicateService.analyseTopics(), duplicateService.analyseTweets()]);
    }
};

// export
module.exports = steps;