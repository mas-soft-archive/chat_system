import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'react-chat-elements/dist/main.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ApplicationProvider } from './AppContainer';

ReactDOM.render(
  <React.Fragment>
    <ApplicationProvider>
      <App />
    </ApplicationProvider>
  </React.Fragment>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();