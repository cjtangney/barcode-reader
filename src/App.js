import React, { Component } from 'react';
import Papa from 'papaparse';
import './App.css';

class App extends Component {
  //app will keep track of the lists that have been loaded
  constructor(props) {
    super(props);

    this.state = {
      list: [],
      searchKey: '',
    }
  }
  //load the data, then hand it off to be parsed
  loadData = (e) => {
    let csvFile = e;
    Papa.parse(csvFile, {
      header: false,
      download: true,
      skipEmptyLines: true,
      complete: (result) => {
        const data = result.data;
        this.parseData(data, e.name);
      }
    });
  }
  //parse data into list objects, then stick it into the app state
  /*
    -> you will need to store the app state (specifically list information) in some kind of external file or database
    -> you will need to set up a way to confirm that the list you are loading is not already in the app's "memory"
  */
  parseData = (csvData, fileName) => {
    if(csvData !== undefined){
      //define the BarcodeList object
      class BarcodeList {
        constructor(name, serials, totalQty, redeemQty){
          this.name = name;
          this.serials = serials;
          this.totalQty = totalQty;
          this.redeemQty = redeemQty;
        }
        getName = () => {
          return this.name;
        }
        getQty = () => {
          return this.totalQty;
        }
        getRedeemed = () => {
          return this.redeemQty;
        }
      }

      //add the new BarcodeList object to the state
      let tempList = new BarcodeList(fileName, csvData, 0, 0);
      let newList = this.state.list.concat(tempList);

      this.setState({
        list: newList,
      });
    }
  }
  updateSearchKey = (key) => {
    this.setState({
      searchKey: key,
    });
  }
  findVoucher = () => {
    (this.state.list.length > 0) ? 
      this.serialSearch() : 
      alert('no data has been loaded');
  }
  serialSearch = () => {
    let key = this.state.searchKey;
    for(let i = 0; i < this.state.list.length; i++){
      let list = this.state.list[i];
      console.log(list);
      for(let k = 0; k < list.serials.length; k++){
        let serial = list.serials[k];
        if (serial[0] === key){
          alert('key found');
          return;
        }
      }
    }
  }
  render() {
    return (
      <div>
        <div>
          <input type="file" id="serial-file-input" accept=".csv" onChange={ event => this.loadData(event.target.files[0]) } />
          <input type="text" id="search-key-input" onChange={ event => this.updateSearchKey(event.target.value) }/>
        </div>
        <div>
          <button id="search-button" onClick={ event => this.findVoucher() }>Find Voucher</button>
        </div>
      </div>
    );
  }
}

export default App;
