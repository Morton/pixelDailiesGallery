import React from 'react';

System.import('materialize-css/dist/css/materialize.min.css!');
System.import('materialize-css');

import Card from './materialize-css/Card.js';
import CardImage from './materialize-css/CardImage.js';
import CardContent from './materialize-css/CardContent.js';
import CardAction from './materialize-css/CardAction.js';
import Navbar from './materialize-css/Navbar.js';
import TopicList from './TopicList.js';
import TopicStore from './stores/TopicStore.js';
import TopicAction from './actions/TopicAction.js';

var Pixel_dailies = React.createClass({
    getState: function () {
        "use strict";

        return {
            topics: TopicStore.getTopics(),
            currentTopic: {
                name: TopicStore.getCurrentTopic(),
                theme: TopicStore.getCurrentTheme(),
                tweets: TopicStore.getCurrentTweets()
            }
        }
    },

    getInitialState: function () {
        "use strict";
        return this.getState();
        //return {
        //    topics: [
        //        "Lich", "raccoon", "battletoads", "blight", "darkness"
        //    ],
        //    currentTopic: {
        //        name: "Lich",
        //        theme: "Today's theme is #Lich, #pixel_dailies.",
        //        tweets: [{
        //            id: 667315173061881900,
        //            image: "http://pbs.twimg.com/media/CUMfAjeVEAAa7XE.png",
        //            text: "99 problems but a #lich ain’t one @Pixel_Dailies #pixel_dailies #pixelart https://t.co/ha5pjfxsEg",
        //            author: "DustinInTN"
        //        }, {
        //            id: 435,
        //            image: "http://pbs.twimg.com/media/CUMfAjeVEAAa7XE.png",
        //            text: "99 problems but a #lich ain’t one @Pixel_Dailies #pixel_dailies #pixelart https://t.co/ha5pjfxsEg",
        //            author: "DustinInTN"
        //        }, {
        //            id: 2364,
        //            image: "http://pbs.twimg.com/media/CUMfAjeVEAAa7XE.png",
        //            text: "99 problems but a #lich ain’t one @Pixel_Dailies #pixel_dailies #pixelart https://t.co/ha5pjfxsEg",
        //            author: "DustinInTN"
        //        }, {
        //            id: 3456,
        //            image: "http://pbs.twimg.com/media/CUMfAjeVEAAa7XE.png",
        //            text: "99 problems but a #lich ain’t one @Pixel_Dailies #pixel_dailies #pixelart https://t.co/ha5pjfxsEg",
        //            author: "DustinInTN"
        //        }]
        //    }
        //};
    },

    componentDidMount: function () {
        TopicStore.addChangeListener(this._onChange);
        TopicAction.loadAllTopics();
    },

    componentWillUnmount: function () {
        TopicStore.removeChangeListener(this._onChange);
    },

    _onChange: function () {
        this.setState(this.getState());
    },

    render: function () {
        return <div>
            <Navbar title={this.state.currentTopic.theme}/>

            {(this.state.topics&&this.state.topics.length==0 ? <div className="preloader-wrapper big active">
                <div className="spinner-layer spinner-red-only">
                    <div className="circle-clipper left">
                        <div className="circle"></div>
                    </div>
                    <div className="gap-patch">
                        <div className="circle"></div>
                    </div>
                    <div className="circle-clipper right">
                        <div className="circle"></div>
                    </div>
                </div>
            </div> :
                <div className="row">
                    <div className="col l3 menu">
                        <TopicList topics={this.state.topics} selectedTopic={this.state.currentTopic.name}/>
                    </div>
                    <div className="col l9 push-l3">
                        <div className="row">
                            {[0, 1, 2].map((vi)=>
                                <div key={'col'+vi} className="col l4 m6 s12">
                                    {(this.state.currentTopic.tweets || []).filter((v, i) => (i%3 == vi)).map((tweet) => (
                                        <Card key={tweet.id}>
                                            <CardImage src={tweet.image}/>
                                            <CardContent>{tweet.text}</CardContent>
                                            <CardAction href={'http://www.twitter.com/'+tweet.author}
                                                        target="_blank">{'@' + tweet.author}</CardAction>
                                        </Card>
                                    ), this)}
                                </div>
                            )}
                        </div>
                    </div>
                </div>)}
        </div>;
    }
});


export default Pixel_dailies;