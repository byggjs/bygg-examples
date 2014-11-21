import * as React from 'react';

let MyComponent = React.createClass({
    render(){
        return (
            <div>
                <h1>Loading...</h1>
                <img src='/images/loading.gif' />
            </div>
        );
    }
});

export default MyComponent;
