import React from 'react';

var Navbar = React.createClass({
    render: function() {
        return <nav className="fixed hover">
            <div className="nav-wrapper">
                <a className="brand-logo center">{this.props.title}</a>
            </div>
        </nav>;
    }
});

export default Navbar;