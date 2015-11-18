/**
 * Created by morton on 18/11/15.
 */

var Twitter = require('twitter');

// init
var client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: '',
    access_token_secret: ''
});

function loadTweets(q, max_id, since_id) {
    return new Promise(function (res, rej) {
        client.get('search/tweets', {max_id: max_id, since_id: since_id, q: q, count: 100, result_type: 'recent'}, function (error, tweets) {
            if (error) {
                rej(error);
            }

            res(tweets);
        });
    });
}
function filterSearchResult(data) {
    return new Promise(function (res, rej) {
        var result = {};

        var parsedMaxId = /.*?max_id=(.*?)&.*?/.exec(data.search_metadata.next_results);
        var parsedSinceId = /.*?since_id=(.*?)&.*?/.exec(data.search_metadata.refresh_url);
        result.meta = {
            max_id: (parsedMaxId && parsedMaxId.length > 1 ? parsedMaxId[1] : undefined),
            since_id: (parsedSinceId && parsedSinceId.length > 1 ? parsedSinceId[1] : undefined)
        };
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
                hashtags: (v.entities.hashtags ? v.entities.hashtags.map(function (v) { return v.text }) : []),
                mentions: (v.entities.user_mentions ? v.entities.user_mentions.map(function (v) { return v.screen_name }) : []),
                medias: (v.entities.media ? v.entities.media.map(function (v) { return { url: v.media_url, type: v.type } }) : []),
                id: v.id,
                user_id: v.user.screen_name,
                user_name: v.user.name
            };
        });

        res(result);
    });
}

loadTweets('#pixel_dailies @Pixel_Dailies ')//, 87938423)//undefined, 667087427480264705)//666968495817670657)
    .then(filterSearchResult)
    .then(function (tweets) {
        console.log(tweets);
    })
    .catch(function (err) {
        console.error(err);
    });