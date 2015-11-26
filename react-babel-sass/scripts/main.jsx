import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';

const controllers = ['nes', 'snes', 'wii', 'ps3', 'x360'];

ReactDOM.render(
    <App data={controllers} />,
    document.getElementById('app')
);
