import React from 'react';
import Collections from './materialize-css/Collections.js';
import CollectionItem from './materialize-css/CollectionItem.js';
import TopicAction from './actions/TopicAction.js';

var TopicList = React.createClass({
    clickHandler: function (topic) {
        "use strict";
        return (e)=>TopicAction.changeTopic(topic);
    },
    render: function () {
        return <Collections>
            {(this.props.topics ||[]).map((name) => <CollectionItem onClick={this.clickHandler(name)} href="#!" key={name}
                                                             active={name==this.props.selectedTopic}>
                {name}
            </CollectionItem>, this)}
        </Collections>;
    }
});

export default TopicList;