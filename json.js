// imports
var fs = require('fs');
var jsonfile = require('jsonfile');

// function fileExists
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

// static class definition
var jsonService = {
    getTweetsMaxId: function () {
        return Promise.resolve(allTweets.meta.max_id);
    },
    getTweetsSinceId: function () {
        return Promise.resolve(allTweets.meta.since_id);
    },
    getTopicsMaxId: function () {
        return Promise.resolve(allTweets.meta.topics_max_id);
    },
    getTopicsSinceId: function () {
        return Promise.resolve(allTweets.meta.topics_since_id);
    },
    setTweetsMaxId: function (newValue) {
        return new Promise((res) => {
            allTweets.meta.max_id = newValue;
            jsonfile.writeFileSync(filename, allTweets);
            res(newValue);
        });
    },
    setTweetsSinceId: function (newValue) {
        return new Promise((res) => {
            allTweets.meta.since_id = newValue;
            jsonfile.writeFileSync(filename, allTweets);
            res(newValue);
        });
    },
    setTopicsMaxId: function (newValue) {
        return new Promise((res) => {
            allTweets.meta.topics_max_id = newValue;
            jsonfile.writeFileSync(filename, allTweets);
            res(newValue);
        });
    },
    setTopicsSinceId: function (newValue) {
        return new Promise((res) => {
            allTweets.meta.topics_since_id = newValue;
            jsonfile.writeFileSync(filename, allTweets);
            res(newValue);
        });
    },
    getTweets: function () {
        return Promise.resolve(allTweets.tweets);
    },
    setTweets: function (newTweets) {
        return new Promise((res) => {
            allTweets.tweets = newTweets;
            jsonfile.writeFileSync(filename, allTweets);
            res(newTweets);
        });
    },
    getTopics: function () {
        return Promise.resolve(allTweets.topics);
    },
    setTopics: function (newTopics) {
        return new Promise((res) => {
            allTweets.topics = newTopics;
            jsonfile.writeFileSync(filename, allTweets);
            res(newTopics);
        });
    }
};

// export
module.exports = jsonService;