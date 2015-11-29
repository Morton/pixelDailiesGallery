import React from 'react';

var Card = React.createClass({
    render: function() {
        return <div className="card">
            {this.props.children}
        </div>;
    }
});

export default Card;