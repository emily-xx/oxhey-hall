import { Proptypes } from 'react';
import React from 'react';
import ReactDOM from 'react-dom';
import OxheyHall from './OxheyHall';
import './index.css';
import 'react-table/react-table.css';

// ========================================
ReactDOM.render(
  <div className="oxheyhall">
    <div className="app-display">
      <OxheyHall />
    </div>
  </div>,
  document.getElementById('root')
);
