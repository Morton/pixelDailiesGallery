import React from 'react';

var CardContent = React.createClass({
    render: function() {
        return <div className="card-content">
            {this.props.children}
        </div>;
    }
});

export default CardContent;