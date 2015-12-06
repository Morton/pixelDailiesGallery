/**
 * Created by morton on 18/11/15.
 */

var steps = require('./js/steps.js');

function generateProcess() {
    return Promise.all([
        steps.retrieveTweetsMaxAndSinceId()
            .then(steps.calcTweetsMaxAndSinceId)
            .then(steps.retrieveTweets)
            .then(steps.filterSearchResult)
            .then(steps.logTweetResult),
        steps.retrieveTopicsMaxAndSinceId()
            .then(steps.calcTopicMaxAndSinceId)
            .then(steps.retrieveTopics)
            .then(steps.filterTopics)
            .then(steps.logTopicResult)
    ])
        .then(steps.persistTweetsAndTopics)
//.then(steps.logProcessResults)
        .catch(steps.errorHandler)
        .then(() => generateProcess());
}

generateProcess();

// process
//Promise.all([
//    steps.retrieveTweetsMaxAndSinceId
//        .then(steps.calcTweetsMaxAndSinceId)
//        .then(steps.retrieveTweets)
//        .then(steps.filterSearchResult)
//        .then(steps.logTweetResult),
//    steps.retrieveTopicsMaxAndSinceId
//        .then(steps.calcTopicMaxAndSinceId)
//        .then(steps.retrieveTopics)
//        .then(steps.filterTopics)
//        .then(steps.logTopicResult)
//])
//.then(steps.persistTweetsAndTopics)
////.then(steps.logProcessResults)
//.catch(steps.errorHandler);