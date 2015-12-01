import Dispatcher from '../dispatcher/Dispatcher.js';
import TopicConstants from '../constants/TopicConstants.js';

class TopicAction {
    static loadAllTopics() {
        "use strict";
        Dispatcher.dispatch({
            actionType: TopicConstants.LOAD_ALL_TOPICS
        });
    }

    static changeTopic(topicName) {
        "use strict";
        Dispatcher.dispatch({
            actionType: TopicConstants.CHANGE_TOPIC,
            name: topicName
        });
    }
}

export default TopicAction;