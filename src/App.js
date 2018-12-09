import React, { Component } from 'react';
import Papa from 'papaparse';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    let csvFile = require('./data/ski-nh-barcodes-all-access.csv');
    Papa.parse(csvFile, {
      header: true,
      download: true,
      skipEmptyLines: true,
      complete: (result) => {
        const data = result.data;
        this.parseData(data);
      }
    });
  }
  parseData = (csvData) => {
    if(csvData !== undefined){

      let codes = [];
      codes = csvData;

      console.log(codes);   
    }
  }
  render() {
    return (
      <div>
        
      </div>
    );
  }
}

export default App;
