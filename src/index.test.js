import React from 'react';
import ReactDOM from 'react-dom';
import OxheyHall from './OxheyHall.js';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<OxheyHall />, div);
  ReactDOM.unmountComponentAtNode(div);
});
