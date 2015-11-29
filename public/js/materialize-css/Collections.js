/**
 * Created by morton on 26/11/15.
 */
import React from 'react';

var Collections = React.createClass({
    render: function() {
        return <ul className="collection">
            {this.props.children}
        </ul>;
    }
});

export default Collections;