import * as React from 'react';
import Icon from './icon';

class App extends React.Component {
    render(){
        return (
            <main>
                <h1>Controller warz</h1>
                <h2>Pick yours</h2>
                <ControllerList data={this.props.data} />
            </main>
        );
    }
}

class ControllerList extends React.Component {
    constructor(props) {
        super(props);
        this.state = { selected: null };
    }
    render(){
        return (
            <ul className='controller-list'>
                {this.props.data.map((type) =>
                    <Controller key={type} type={type}
                        onClick={this.onControllerClick.bind(this, type)}
                        selected={this.state.selected === type} />
                )}
            </ul>
        );
    }
    onControllerClick(type, event) {
        this.setState({ selected: type !== this.state.selected ? type : null });
    }
}

class Controller extends React.Component {
    render(){
        return (
            <li className={`controller ${ this.props.selected ? 'selected' : '' }`}
                    onClick={this.props.onClick}>
                <Icon name={this.props.type} />
            </li>
        );
    }
}

export default App;
