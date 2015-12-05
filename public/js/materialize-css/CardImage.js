import React from 'react';

var CardImage = React.createClass({
    render: function () {
        return <div className="card-image">
            <img src={this.props.src}/>
        </div>;
    }
});

export default CardImage;