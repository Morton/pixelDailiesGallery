// imports
var persistenceService = require('./persistence.js');

// static class definition
var routes = {
    getTweets: function (req, res) {
        Promise.all([persistenceService.getTweets(), persistenceService.getTopics()]).then(function (data) {
            var tweets = data[0].filter((v)=> v.hashtags.indexOf(req.params.topic) > -1);
            var topic = data[1].filter((v)=> v.hashtags.indexOf(req.params.topic) > -1)[0];

            res.send({
                tweets: tweets,
                text: topic.text,
                creation_date: topic.creation_date
            });
        })
    },
    getTopics: function (req, res) {
        persistenceService.getTopics().then(function (topics) {
            topics = topics.map((v)=> v.hashtags.filter((v) => v != 'pixel_dailies'));
            topics = topics.filter((v)=>v && v.length > 0);

            res.send(topics);
        })
    }
};

// export
module.exports = routes;