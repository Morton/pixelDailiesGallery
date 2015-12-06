// imports
var pmongo = require('promised-mongo');

var url = process.env.MONGODB_URL;

// static class definition
var mongoDbService = {
    getConnection: Promise.resolve(pmongo(url)),
    getTweetsMaxId: function () {
        return mongoDbService.config.then((c) => c.findOne({key: 'tweets_max_id'})).then((v) => (v?parseInt(v.value):Number.MAX_VALUE));
    },
    getTweetsSinceId: function () {
        return mongoDbService.config.then((c) => c.findOne({key: 'tweets_since_id'})).then((v) => (v?parseInt(v.value):Number.MIN_VALUE));
    },
    getTopicsMaxId: function () {
        return mongoDbService.config.then((c) => c.findOne({key: 'topics_max_id'})).then((v) => (v?parseInt(v.value):Number.MAX_VALUE));
    },
    getTopicsSinceId: function () {
        return mongoDbService.config.then((c) => c.findOne({key: 'topics_since_id'})).then((v) => (v?parseInt(v.value):Number.MIN_VALUE));
    },
    setTweetsMaxId: function (newValue) {
        return mongoDbService.config.then((c) => c.update({key: 'tweets_max_id'}, {key: 'tweets_max_id', value: newValue}, {
            upsert: true,
            multi: false
        }))
            .then(newValue);
    },
    setTweetsSinceId: function (newValue) {
        return mongoDbService.config.then((c) => c.update({key: 'tweets_since_id'}, {key: 'tweets_since_id', value: newValue}, {
            upsert: true,
            multi: false
        }))
            .then(newValue);
    },
    setTopicsMaxId: function (newValue) {
        return mongoDbService.config.then((c) => c.update({key: 'topics_max_id'}, {key: 'topics_max_id', value: newValue}, {
            upsert: true,
            multi: false
        }))
            .then(newValue);
    },
    setTopicsSinceId: function (newValue) {
        return mongoDbService.config.then((c) => c.update({key: 'topics_since_id'}, {key: 'topics_since_id', value: newValue}, {
            upsert: true,
            multi: false
        }))
            .then(newValue);
    },
    getTweets: function () {
        return mongoDbService.tweets.then((c) => c.find().toArray());
    },
    getTweetsByTopic: function (topic) {
        return mongoDbService.tweets.then((c) => c.find({hashtags: topic}).toArray());
    },
    setTweets: function (newTweets) {
        return Promise.reject("mongoDbService.setTweets not implemented");
    },
    addTweets: function (addTweets) {
        if (!addTweets || !addTweets.length) {
            return addTweets;
        }
        //return mongoDbService.tweets.then((c) => Promise.all(addTweets.map((tweet) => c.insert(tweet))));
        return mongoDbService.tweets.then((c) => c.insert(addTweets));
    },
    getTopics: function () {
        return mongoDbService.topics.then((c) => c.find().toArray()).then((arr) => arr.map((v)=>v.name));
    },
    getRelevantTopics: function () {
        return mongoDbService.topics.then((c) => c.find().toArray()).then((arr) => arr.map((v)=> v.hashtags.filter((v) => v != 'pixel_dailies')).filter((v)=>v && v.length > 0));
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
        return mongoDbService.topics.then((c) => c.insert(addTopics));
    }
};

mongoDbService.tweets = mongoDbService.getConnection.then((db) => db.collection('tweets'));
mongoDbService.topics = mongoDbService.getConnection.then((db) => db.collection('topics'));
mongoDbService.config = mongoDbService.getConnection.then((db) => db.collection('config'));

// export
module.exports = mongoDbService;