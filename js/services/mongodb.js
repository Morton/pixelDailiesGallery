// imports
var pmongo = require('promised-mongo');
var bigInt = require("big-integer");

var url = process.env.MONGODB_URL;

var MAX_BIGINT = bigInt('99999999999999999999');
var MIN_BIGINT = bigInt('-99999999999999999999');

// static class definition
var mongoDbService = {
    getConnection: Promise.resolve(pmongo(url)),
    getTweetsMaxId: function () {
        return mongoDbService.config.then((c) => c.find({key: 'tweets_max_id'})).then((v) => (v[0] ? bigInt(v[0].value) : MAX_BIGINT));
    },
    getTweetsSinceId: function () {
        return mongoDbService.config.then((c) => c.find({key: 'tweets_since_id'})).then((v) => (v[0] ? bigInt(v[0].value) : MIN_BIGINT));
    },
    getTopicsMaxId: function () {
        return mongoDbService.config.then((c) => c.find({key: 'topics_max_id'})).then((v) => (v[0] ? bigInt(v[0].value) : MAX_BIGINT));
    },
    getTopicsSinceId: function () {
        return mongoDbService.config.then((c) => c.find({key: 'topics_since_id'})).then((v) => (v[0] ? bigInt(v[0].value) : MIN_BIGINT));
    },
    setTweetsMaxId: function (newValue) {
        return mongoDbService.config.then((c) => c.update({key: 'tweets_max_id'}, {
            key: 'tweets_max_id',
            value: (newValue && newValue.toString ? newValue.toString() : newValue)
        }, {
            upsert: true,
            multi: false
        }))
            .then(newValue);
    },
    setTweetsSinceId: function (newValue) {
        return mongoDbService.config.then((c) => c.update({key: 'tweets_since_id'}, {
            key: 'tweets_since_id',
            value: (newValue && newValue.toString ? newValue.toString() : newValue)
        }, {
            upsert: true,
            multi: false
        }))
            .then(newValue);
    },
    setTopicsMaxId: function (newValue) {
        return mongoDbService.config.then((c) => c.update({key: 'topics_max_id'}, {
            key: 'topics_max_id',
            value: (newValue && newValue.toString ? newValue.toString() : newValue)
        }, {
            upsert: true,
            multi: false
        }))
            .then(newValue);
    },
    setTopicsSinceId: function (newValue) {
        return mongoDbService.config.then((c) => c.update({key: 'topics_since_id'}, {
            key: 'topics_since_id',
            value: (newValue && newValue.toString ? newValue.toString() : newValue)
        }, {
            upsert: true,
            multi: false
        }))
            .then(newValue);
    },
    getTweets: function () {
        return mongoDbService.tweets.then((c) => c.find().toArray()).then((arr) => arr.map((v) => {
            v.id = bigInt(v.id);
            return v;
        }));
    },
    getTweetsByTopic: function (topic) {
        return mongoDbService.tweets.then((c) => c.find({hashtags: topic}).toArray()).then((arr) => arr.map((v) => {
            v.id = bigInt(v.id);
            return v;
        }));
    },
    setTweets: function (newTweets) {
        return Promise.reject("mongoDbService.setTweets not implemented");
    },
    addTweets: function (addTweets) {
        if (!addTweets || !addTweets.length) {
            return addTweets;
        }
        //return mongoDbService.tweets.then((c) => Promise.all(addTweets.map((tweet) => c.insert(tweet))));
        return mongoDbService.tweets.then((c) => c.insert(addTweets.map((v) => {
            if (v.id.toString) {
                v.id = v.id.toString();
            }
            return v;
        })));
    },
    getTopics: function () {
        return mongoDbService.topics.then((c) => c.find().toArray()).then((arr) => arr.map((v) => {
            v.id = bigInt(v.id);
            return v;
        }));
    },
    getRelevantTopics: function () {
        return mongoDbService.topics.then((c) => c.find().toArray()).then((arr) => arr.map((v) => {
            v.id = bigInt(v.id);
            return v;
        })).then((arr) => arr.map((v)=> v.hashtags.filter((v) => v != 'pixel_dailies')).filter((v)=>v && v.length > 0));
    },
    getTopicByHashtag: function (hashtag) {
        return mongoDbService.topics.then((c) => c.findOne({hashtags: hashtag}));
    },
    setTopics: function (newTopics) {
        return Promise.reject("mongoDbService.setTopics not implemented");
    },
    addTopics: function (addTopics) {
        if (!addTopics || !addTopics.length) {
            return addTopics;
        }
        //return jsonService.getTopics
        // ().then((oldTopics) => jsonService.setTopics(oldTopics.concat(addTopics)));
        return mongoDbService.topics.then((c) => c.insert(addTopics.map((v) => {
            if (v.id.toString) {
                v.id = v.id.toString();
            }
            return v;
        })));
    }
};

mongoDbService.tweets = mongoDbService.getConnection.then((db) => db.collection('tweets'));
mongoDbService.topics = mongoDbService.getConnection.then((db) => db.collection('topics'));
mongoDbService.config = mongoDbService.getConnection.then((db) => db.collection('config'));

// export
module.exports = mongoDbService;