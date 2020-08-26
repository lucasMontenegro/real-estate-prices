import React, { Fragment } from 'react';
import logo from './logo.svg';
import './App.css';
import 'fontsource-roboto';
import CssBaseline from '@material-ui/core/CssBaseline';

function App() {
  return (
    <Fragment>
      <CssBaseline />
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            App en construcción. Visitá nuestra {' '}
            <a
              className="App-link"
              href="https://www.facebook.com/terrenos.charata"
              target="_blank"
              rel="noopener noreferrer"
            >
              página de Facebook
            </a>
            .
          </p>
        </header>
      </div>
    </Fragment>
  );
}

export default App;
