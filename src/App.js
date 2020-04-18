import React from 'react';
import Routing from './components/shared/routing';
import Header from './components/shared/header';
import './App.css';

function App() {
  return (
    <div className="App">
      <Header/>
      <Routing/>
    </div>
  );
}

export default App;
