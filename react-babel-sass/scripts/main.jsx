import * as React from 'react';
import App from './app';

const controllers = ['nes', 'snes', 'wii', 'ps3', 'x360'];

React.render(
    <App data={controllers} />,
    document.getElementById('app')
);
