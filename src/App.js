import React, { Component } from 'react';
import Papa from 'papaparse';
import Axios from 'axios';
import { UploadModal, RedeemModal } from './components/Modal';

//move to class file
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

//move to class file
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
      modalTitle: '',
      modalBody: '',
    }
  }
  /*
  async componentDidMount() {
    let roomResponse = await fetch("http://localhost:1337/rooms");
    let suiteResponse = await fetch("http://localhost:1337/suites");
    if(!roomResponse.ok) return;
    if(!suiteResponse.ok) return;

    let rooms = await roomResponse.json();
    this.setState({ loading: false, rooms: rooms });

    let suites = await suiteResponse.json();
    this.setState({suites: suites});
  }
  */
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
        document.getElementById('upload-modal').classList.remove('active');
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
    let keyFound = false;
    for(let i = 0; i < this.state.list.length; i++){
      let list = this.state.list[i];
      for(let k = 0; k < list.serials.length; k++){
        let serial = list.serials[k].id;
        if (serial === key){
          if(list.serials[k].redeemed){ 
            alert('this voucher has been previously redeemed.');
            keyFound = true; 
            break; 
          }else if(!list.serials[k].redeemed){
            alert('this voucher is valid');
            list.serials[k].redeemed = true;
            keyFound = true;
            this.setState({
              searchKey: '',
            });
            document.getElementById('redeem-modal').classList.remove('active');
            break;
          }
        }
      }
    }
    if(!keyFound){ alert('this voucher is invalid.'); }
    document.getElementById('search-key-input').value = ''
  }
  saveState = () => {
    for(let i = 0; i < this.state.list.length; i++){
      Axios.post('api/putData', {
        name: this.state.list[i].name,
        serials: this.state.list[i].serials,
        totalQty: this.state.list[i].totalQty,
        redeemQty: this.state.list[i].redeemQty
      });
    }
  }
  closeModal = (e) => {
    e.preventDefault();
    let elements = document.getElementsByClassName('modal');
    for (var i = 0; i < elements.length; i++) {
      elements[i].classList.remove('active');
    }
  }
  render() {
    return (
      <div className='container'>
        <div className='panel columns'>
          <div className='column col-12 text-center' style={{'marginTop': '5em'}}>
            <h1>Ragged Mountain Resort Voucher Redemption Applicaton</h1>
            <p>To redeem a voucher, select the button below. When prompted, scan the barcode into the provided text field and hit search.</p>
          </div>
        </div>
        <div className='columns hero bg-dark text-center' style={{'marginTop': '10em'}}> 
          <div className='hero-body'>
            <div className='columns'>
              <div className='column col-3 col-mx-auto'>
                <button className='btn btn-primary' style={{'minWidth': '12em', 'minHeight': '5em'}} id='upload-button' onClick={ event => document.getElementById('upload-modal').classList.add('active') }>Upload List</button>
              </div>
              <div className='column col-6 col-mx-auto'>
                <button className='btn btn-success' style={{'minWidth': '24em', 'minHeight': '5em'}} id='redeem-button' onClick={ event => document.getElementById('redeem-modal').classList.add('active') }>Redeem Voucher</button>
              </div>
              <div className='column col-3 col-mx-auto'>
                <button className='btn btn-primary' style={{'minWidth': '12em', 'minHeight': '5em'}} id='save-button' onClick={ event => this.saveState() }>Save State</button>
              </div>
            </div>
          </div>
        </div>
        <UploadModal loadData={this.loadData} closeModal={this.closeModal} />
        <RedeemModal updateSearchKey={this.updateSearchKey} findVoucher={this.findVoucher} closeModal={this.closeModal} />
      </div>
    );
  }
}

export default App;
