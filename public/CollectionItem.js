/**
 * Created by morton on 26/11/15.
 */
import React from 'react';

var CollectionItem = React.createClass({
    render: function() {
        return <li className={['collection-item', (this.props.active?'active':'')].join(' ')} {...this.props}>
            {this.props.children}
        </li>;
    }
});

export default CollectionItem;