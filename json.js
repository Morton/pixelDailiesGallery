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
        return allTweets.meta.max_id;
    },
    getTweetsSinceId: function () {
        return allTweets.meta.since_id;
    },
    getTopicsMaxId: function () {
        return allTweets.meta.topics_max_id;
    },
    getTopicsSinceId: function () {
        return allTweets.meta.topics_since_id;
    },
    setTweetsMaxId: function (newValue) {
        allTweets.meta.max_id = newValue;
        jsonfile.writeFileSync(filename, allTweets);
    },
    setTweetsSinceId: function (newValue) {
        allTweets.meta.since_id = newValue;
        jsonfile.writeFileSync(filename, allTweets);
    },
    setTopicsMaxId: function (newValue) {
        allTweets.meta.topics_max_id = newValue;
        jsonfile.writeFileSync(filename, allTweets);
    },
    setTopicsSinceId: function (newValue) {
        allTweets.meta.topics_since_id = newValue;
        jsonfile.writeFileSync(filename, allTweets);
    },
    getTweets: function () {
        return allTweets.tweets;
    },
    setTweets: function (newTweets) {
        allTweets.tweets = newTweets;
        jsonfile.writeFileSync(filename, allTweets);
    },
    getTopics: function () {
        return allTweets.topics;
    },
    setTopics: function (newTopics) {
        allTweets.topics = newTopics;
        jsonfile.writeFileSync(filename, allTweets);
    }
};

// export
module.exports = jsonService;