// imports
var fs = require('fs');
var jsonfile = require('jsonfile');

var filename = 'data.json';

// static class definition
var jsonService = {
    getFileContent: new Promise(function (resolve, reject) {
        // function fileExists
        var fileExists = function (filePath) {
            try {
                return fs.statSync(filePath).isFile();
            }
            catch (err) {
                return false;
            }
        };

        // load file
        var allTweets = {};

        if (fileExists(filename)) {
            jsonfile.readFile(filename, (err, data) => (err ? reject(err) : resolve(data)));
        } else {
            resolve({
                meta: {
                    max_id: Number.MAX_VALUE,
                    since_id: undefined,
                    topics_max_id: Number.MAX_VALUE,
                    topics_since_id: undefined
                },
                tweets: [],
                topics: []
            });
        }
    }),
    setFileContent: function (data) {
        return new Promise(function (resolve, reject) {
            jsonfile.writeFile(filename, data, (err) => (err ? reject(err) : resolve(data)));
        });
    },
    getTweetsMaxId: function () {
        return jsonService.getFileContent.then((allTweets) => allTweets.meta.max_id);
    },
    getTweetsSinceId: function () {
        return jsonService.getFileContent.then((allTweets) => allTweets.meta.since_id);
    },
    getTopicsMaxId: function () {
        return jsonService.getFileContent.then((allTweets) => allTweets.meta.topics_max_id);
    },
    getTopicsSinceId: function () {
        return jsonService.getFileContent.then((allTweets) => allTweets.meta.topics_since_id);
    },
    setTweetsMaxId: function (newValue) {
        return jsonService.getFileContent.then((allTweets) => new Promise((res) => {
            allTweets.meta.max_id = newValue;
            res(allTweets);
        })).then(jsonService.setFileContent).then(newValue);
    },
    setTweetsSinceId: function (newValue) {
        return jsonService.getFileContent.then((allTweets) => new Promise((res) => {
            allTweets.meta.since_id = newValue;
            res(allTweets);
        })).then(jsonService.setFileContent).then(newValue);
    },
    setTopicsMaxId: function (newValue) {
        return jsonService.getFileContent.then((allTweets) => new Promise((res) => {
            allTweets.meta.topics_max_id = newValue;
            res(allTweets);
        })).then(jsonService.setFileContent).then(newValue);
    },
    setTopicsSinceId: function (newValue) {
        return jsonService.getFileContent.then((allTweets) => new Promise((res) => {
            allTweets.meta.topics_since_id = newValue;
            res(allTweets);
        })).then(jsonService.setFileContent).then(newValue);
    },
    getTweets: function () {
        return jsonService.getFileContent.then((allTweets) => allTweets.tweets);
    },
    getTweetsByTopic: function (topic) {
        return jsonService.getTweets().then((tweets) => tweets.filter((v)=> v.hashtags.indexOf(topic) > -1));
    },
    getTopicByHashtag: function (hashtag) {
        return jsonService.getTopics().then((topics) => topics.filter((v)=> v.hashtags.indexOf(hashtag) > -1)[0]);
    },
    setTweets: function (newTweets) {
        return jsonService.getFileContent.then((allTweets) => new Promise((res) => {
            allTweets.tweets = newTweets;
            res(allTweets);
        })).then(jsonService.setFileContent).then((allTweets) => allTweets.tweets);
    },
    addTweets: function (addTweets) {
        return jsonService.getTweets().then((oldTweets) => jsonService.setTweets(oldTweets.concat(addTweets)));
    },
    getTopics: function () {
        return jsonService.getFileContent.then((allTweets) => allTweets.topics);
    },
    getRelevantTopics: function () {
        return jsonService.getTopics().then((topics) =>
                topics.map((v)=> v.hashtags.filter((v) => v != 'pixel_dailies')).filter((v)=>v && v.length > 0)
        );
    },
    setTopics: function (newTopics) {
        return jsonService.getFileContent.then((allTweets) => new Promise((res) => {
            allTweets.topics = newTopics;
            res(allTweets);
        })).then(jsonService.setFileContent).then((allTweets) => allTweets.topics);
    },
    addTopics: function (addTopics) {
        return jsonService.getTopics().then((oldTopics) => jsonService.setTopics(oldTopics.concat(addTopics)));
    }
};

// export
module.exports = jsonService;