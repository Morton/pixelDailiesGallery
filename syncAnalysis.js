var persistenceService = require('./js/services/persistence.js');

// analyse topics
var duplicateService = {
    analyseTopics: function () {
        return persistenceService.getTopics()
            .then((topics) => topics.map((t) => {
                return {name: t.text, count: 1}
            }))
            .then((topics) => topics.reduce((p, t) => {
                (p[t.name] ? p[t.name] += +t.count : p[t.name] = t.count);
                return p;
            }, {}))
            .then((topics) => {
                return {
                    keys: Object.keys(topics).filter((t) => topics[t] > 1).sort((a, b) => topics[b] - topics[a]),
                    map: topics
                };
            })
            .then((data) => { data.keys.map((key) => console.log(key, data.map[key])); return data; })
            .then((data) => {
                var num = data.keys.reduce((p, key) => p + data.map[key] - 1, 0);
                console.log('Found', num, 'duplicates in topics.');
                if (num) process.exit(0);
            })
            .catch((err) => console.log(err));
    },
    analyseTweets: function () {
        return persistenceService.getTweets()
            .then((tweets) => tweets.map((t) => {
                return {name: t.text, count: 1}
            }))
            .then((tweets) => tweets.reduce((p, t) => {
                (p[t.name] ? p[t.name] += +t.count : p[t.name] = t.count);
                return p;
            }, {}))
            .then((tweets) => {
                return {
                    keys: Object.keys(tweets).filter((t) => tweets[t] > 1).sort((a, b) => tweets[b] - tweets[a]),
                    map: tweets
                };
            })
            .then((data) => { data.keys.map((key) => console.log(key, data.map[key])); return data; })
            //.then((data) => console.log('Found', data.keys.reduce((p, key) => p + data.map[key] - 1, 0), 'duplicates in tweets.'))
            .then((data) => {
                var num = data.keys.reduce((p, key) => p + data.map[key] - 1, 0);
                console.log('Found', num, 'duplicates in tweets.');
                if (num) process.exit(0);
            })
            .catch((err) => console.log(err));
    }
};

duplicateService.analyseTweets();
duplicateService.analyseTopics();

module.exports = duplicateService;