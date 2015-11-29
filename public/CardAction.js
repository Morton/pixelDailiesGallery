import React from 'react';

var CardAction = React.createClass({
    render: function() {
        return <div className="card-action">
            <a href={this.props.href} target={this.props.target}>{this.props.children}</a>
        </div>;
    }
});

export default CardAction;