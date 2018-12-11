import React, { Component } from 'react';
import Papa from 'papaparse';
import './App.css';

//move to file
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

//move to file
class SerialNumber {
  constructor(id, redeemed, dateRedeemed){
    this.id = id;
    this.redeemed = redeemed;
    this.dateRedeemed = dateRedeemed;
  }
  getSerial = () => {
    return this.id;
  }
  getStatus = () => {

  }
}

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
      //create array of SerialNumber objects
      let serialList = [];
      csvData.forEach(function(record){
        serialList.push(new SerialNumber(record[0], false, ''));
      });

      //add the new BarcodeList object to the state, stick the SerialNumber array in there
      let tempList = new BarcodeList(fileName, serialList, 0, 0);
      let newList = this.state.list.concat(tempList);

      this.setState({
        list: newList,
      });
    }
  }
  //search functions should be in a threadworker or something
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
      for(let k = 0; k < list.serials.length; k++){
        let serial = list.serials[k].id;
        if (serial === key){
          alert('key found');
          //update the serial so it remembers it has been redeemed
          list.serials[k].redeemed = true;
          return;
        }
      }
    }
  }
  render() {
    return (
      <div className='container'>
        <div className='columns col-6 col-mx-auto'>
          <div className='column'>
            <label htmlFor='serial-file-input' style={{ border: '1px solid #ccc', display: 'inline-block', padding: '6px 12px', cursor: 'pointer' }}>
              <i className='fa fa-cloud-upload'></i> Custom Upload
            </label>
            <input type='file' id='serial-file-input' accept='.csv' onChange={ event => this.loadData(event.target.files[0]) } style={{ display: 'none' }}/>
          </div>
          <div className='column col-6 col-mx-auto'>
            <input type='text' id='search-key-input' onChange={ event => this.updateSearchKey(event.target.value) }/>
            <button id='search-button' onClick={ event => this.findVoucher() }>Find Voucher</button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
