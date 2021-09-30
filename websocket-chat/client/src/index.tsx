import React from 'react';
import ReactDOM from 'react-dom';
import 'react-chat-elements/dist/main.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ApplicationProvider } from './containers/app-container';
import { MapApp } from './map-app';

ReactDOM.render(
  <React.Fragment>
    <ApplicationProvider>
      <MapApp />
    </ApplicationProvider>
  </React.Fragment>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
