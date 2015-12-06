// imports
var persistenceService = require('./services/persistence.js');

// static class definition
var routes = {
    getTweets: function (req, res) {
        Promise.all([persistenceService.getTweetsByTopic(req.params.topic), persistenceService.getTopicByHashtag(req.params.topic)]).then(function (data) {
            var tweets = data[0];
            var topic = data[1];

            res.send({
                tweets: tweets,
                text: topic.text,
                creation_date: topic.creation_date
            });
        }).catch(function (err) {
            res.status(500).send(err);
        });
    },
    getTopics: function (req, res) {
        persistenceService.getRelevantTopics().then(function (topics) {
            res.send(topics);
        }).catch(function (err) {
            res.status(500).send(err);
        });
    }
};

// export
module.exports = routes;