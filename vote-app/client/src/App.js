import React, { Component } from 'react';
import './App.css';
import {Register} from './components/Register.jsx';
import {List} from './components/List.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="container">
        <h1 className="my-4 text-uppercase text-light">
        let's make <br/>Blockchain great again</h1>
        <hr className="bg-light py-1"/>
        </div>
        <Register/>
        <List/>
      </div>
    );
  }
}

export default App;
