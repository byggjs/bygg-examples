import * as React from 'react';

let Icon = React.createClass({
    render(){
        return (
            <svg className='icon' dangerouslySetInnerHTML={{
                __html: `<use xlink:href="/images/sprite.svg#${this.props.name}"></use>`
            }} />
        );
    }
});

export default Icon;
