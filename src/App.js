import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
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
  );
}

export default App;
