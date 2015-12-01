import Dispatcher from '../dispatcher/Dispatcher.js';
import TopicConstants from '../constants/TopicConstants.js';
import assign from 'object-assign';
import EventEmitter from 'events';
import $ from 'jquery';

var CHANGE_EVENT = 'CHANGE_EVENT';
var store = {
    //topics: [
    //    {name: "Lich", theme: "Today's theme is #Lich, #pixel_dailies."}, {
    //        name: "raccoon",
    //        theme: "Today's theme is #raccoon, #pixel_dailies."
    //    }, {name: "battletoads", theme: "Today's theme is #battletoads, #pixel_dailies."}, {
    //        name: "blight",
    //        theme: "Today's theme is #blight #pixel_dailies"
    //    }, {name: "darkness", theme: "Today's theme is #darkness. #pixel_dailies"}
    //],
    //currentTopic: "Lich",
    //currentTweets: [{
    //    id: 667315173061881900,
    //    image: "http://pbs.twimg.com/media/CUMfAjeVEAAa7XE.png",
    //    text: "99 problems but a #lich ain’t one @Pixel_Dailies #pixel_dailies #pixelart https://t.co/ha5pjfxsEg",
    //    author: "DustinInTN"
    //}, {
    //    id: 435,
    //    image: "http://pbs.twimg.com/media/CUMfAjeVEAAa7XE.png",
    //    text: "99 problems but a #lich ain’t one @Pixel_Dailies #pixel_dailies #pixelart https://t.co/ha5pjfxsEg",
    //    author: "DustinInTN"
    //}, {
    //    id: 2364,
    //    image: "http://pbs.twimg.com/media/CUMfAjeVEAAa7XE.png",
    //    text: "99 problems but a #lich ain’t one @Pixel_Dailies #pixel_dailies #pixelart https://t.co/ha5pjfxsEg",
    //    author: "DustinInTN"
    //}, {
    //    id: 3456,
    //    image: "http://pbs.twimg.com/media/CUMfAjeVEAAa7XE.png",
    //    text: "99 problems but a #lich ain’t one @Pixel_Dailies #pixel_dailies #pixelart https://t.co/ha5pjfxsEg",
    //    author: "DustinInTN"
    //}]
};

var TopicStore = assign({}, EventEmitter.prototype, {
    // event handler
    changeTopic: function (newTopic) {
        "use strict";
        store.currentTopic = newTopic;
        this.emit(CHANGE_EVENT);

        $.ajax('/api/tweets/' + newTopic, {
            dataType: 'json',
            success: function (data) {
                store.currentTheme = data.text;
                store.currentTweets = data.tweets.map((v) => {
                    return {
                        id: v.id,
                        image: v.medias.reduce((p, v)=>(v.type == 'photo' ? v.url : p), ''),
                        text: v.text,
                        author: v.user_id
                    };
                });
                this.emit(CHANGE_EVENT);
            },
            context: this
        });
    },
    loadAllTopics: function () {
        "use strict";
        $.ajax('/api/topics/', {
            dataType: 'json',
            success: function (data) {
                store.topics = data;
                this.emit(CHANGE_EVENT);
                TopicStore.changeTopic(store.topics[0]);
            },
            context: this
        });
    },

    // storage getter
    getTopics: () => store.topics,
    getCurrentTopic: () => store.currentTopic,
    getCurrentTheme: () => store.currentTheme,
    getCurrentTweets: () => store.currentTweets,

    addChangeListener: function (callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function (callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }
});

Dispatcher.register((action) => {
    "use strict";
    switch (action.actionType) {
        case TopicConstants.CHANGE_TOPIC:
            TopicStore.changeTopic(action.name);
            break;
        case TopicConstants.LOAD_ALL_TOPICS:
            TopicStore.loadAllTopics();
            break;
    }
});

export default TopicStore;