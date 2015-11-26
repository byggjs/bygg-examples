import React from 'react';

class Icon extends React.Component {
    render(){
        return (
            <svg className='icon' dangerouslySetInnerHTML={{
                __html: `<use xlink:href="/images/sprite.svg#${this.props.name}"></use>`
            }} />
        );
    }
}

export default Icon;
