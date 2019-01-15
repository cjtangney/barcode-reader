import React, { Component } from 'react';
import Papa from 'papaparse';
import Axios from 'axios';

import { Toast } from './components/Toast';
import { CouponMenu } from './components/CouponMenu';
import { Redeem } from './components/Redeem';
import { Upload } from './components/Upload';
import { DataViewer } from './components/DataViewer';

import IO from 'socket.io-client';

//move to class file
class BarcodeList {
  constructor(name, fileName, serials, totalQty, redeemQty){
    this.name = name;
    this.fileName = fileName;
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
      loading: true,
      activePane: '',
      searchResult: '',
    }

    // get all data from the back end
    this.syncLists = () => {
      Axios.get('/api/getData')
      .then(res=> {
        let lists = res.data.data;
        this.setState({ list: lists, loading: false, });
      });
    }
    this.syncData = () => {
      Axios.get('/api/getData')
      .then(res=> {
        let lists = res.data.data;
        this.setState({ list: lists, loading: false, });
      });
    }

    // application socket
    this.socket = IO.connect('ws://localhost:3001', {transports: ['websocket']});

    // handling socket communication
    this.socket.on('sync-lists', () => {
      this.syncLists();
    });
    this.socket.on('sync-data', () => {
      this.syncData();
    })
  }
  async componentDidMount() {
    this.syncLists();
  }
  loadData = (file, name) => {
    if(file && name){
      let csvFile = file;
      Papa.parse(csvFile, {
        header: false,
        download: true,
        skipEmptyLines: true,
        complete: (result) => {
          const data = result.data;
          this.parseData(data, file.name, name);
          document.getElementById('upload-modal').classList.remove('active');
        }
      });
    } else { 
      if(!name && !file){ alert('both fields required'); }
      else if(!file){ alert('please select a file'); }
      else if(!name){ alert('enter a list title'); }
    }
  }
  //parse data into list objects, then stick it into the app state / backend
  parseData = (csvData, fileName, name) => {
    if(csvData !== undefined){
      //create array of SerialNumber objects
      let serialList = [];
      csvData.forEach(function(record){
        serialList.push(new SerialNumber(record[0], false, ''));
      });

      //add the new BarcodeList object to the state, stick the SerialNumber array in there
      let tempList = new BarcodeList(name, fileName, serialList, serialList.length, 0);
      let listExists = false;
      let i;
      for(i = 0; i < this.state.list.length; i++){
        if(tempList.fileName === this.state.list[i].fileName){ 
          alert('this list exists already');
          document.getElementById('serial-list-name-input').value = '';
          listExists = true;
          return;
        }
      }
      if(!listExists){
        document.getElementById('serial-list-name-input').value = '';
        let newList = this.state.list.concat(tempList);
        this.setState({
          list: newList,
        });
        this.saveState(tempList);
      }
    }
  }
  updateSearchKey = (key) => {
    this.setState({
      searchKey: key,
    });
  }
  findVoucher = () => {
    if(this.state.list.length > 0){ 
      this.serialSearch()
    }else{
      this.setState({
        searchResult: 'error',
      })
      this.showToast('No data has been uploaded to the database.');
    }
  }
  //search functions should be in a threadworker or something
  serialSearch = () => {
    let key = this.state.searchKey;
    let keyFound = false;
    let keyValid = false;
    let today = new Date();
    let day = today.getDate();
    let month = today.getMonth()+1;
    let year = today.getFullYear();
    today = day + '/' + month + '/' + year;
    let i, tempList;
    for(i = 0; i < this.state.list.length; i++){
      let list = this.state.list[i];
      for(let k = 0; k < list.serials.length; k++){
        let serial = list.serials[k].id;
        if (serial === key){
          if(list.serials[k].redeemed){
            this.setState({
              searchResult: 'error',
            })
            this.showToast('This voucher has been previously redeemed.');
            keyFound = true; 
            break; 
          }else if(!list.serials[k].redeemed){
            tempList = list;
            list.serials[k].redeemed = true;
            list.serials[k].dateRedeemed = today;
            list.redeemQty++;
            keyFound = true;
            keyValid = true;
            this.setState({
              searchKey: '',
            });
            break;
          }
        }
      }
    }
    if(!keyFound){
      this.setState({
        searchResult: 'error',
      })
      this.showToast('This voucher is not valid.');
    }else if (keyFound && keyValid) this.updateState(tempList);
    this.setState({ searchKey: '', }); 
    document.getElementById('search-key-input').value = '';
  }
  updateState = (list) => {
    let newList = {
      name: list.name,
      fileName: list.fileName,
      serials: list.serials,
      totalQty: list.totalQty,
      redeemQty: list.redeemQty
    }
    Axios.post('api/updateData', newList).then(() => {
      this.setState({
        searchResult: 'success'
      })
      this.showToast('This voucher is valid!');
      this.socket.emit('update-data');
    });
  }
  saveState = (list) => {
    let newList = {
      name: list.name,
      fileName: list.fileName,
      serials: list.serials,
      totalQty: list.totalQty,
      redeemQty: list.redeemQty
    }
    Axios.post('api/putData', newList).then(this.socket.emit('update-list'));
  }
  closeModal = (e) => {
    e.preventDefault();
    let elements = document.getElementsByClassName('modal');
    for (var i = 0; i < elements.length; i++) {
      elements[i].classList.remove('active');
    }
  }
  showToast = (msg) => {
    let toast = document.getElementById('notify-toast');
    toast.innerHTML = '<h2>' + msg + '</h2>';
    toast.classList.remove('d-hide');
    toast.classList.add('show');
    setTimeout(function(){ 
      toast.classList.remove('show');
      toast.classList.add('d-hide'); 
    }, 3000);
  }
  redeemClicked = () => {
    this.setState({
      activePane: 'redeem'
    });
  }
  uploadClicked = () => {
    this.setState({
      activePane: 'upload'
    });
  }
  createClicked = () => {
    this.setState({
      activePane: 'create'
    });
  }
  viewClicked = () => {
    this.setState({
      activePane: 'view'
    });
  }
  render() {
    if(this.state.activePane === ''){
      return(
        <div className='container'>
          <div className='columns'>
            <div className='column col-1'>
              <CouponMenu redeemClicked={this.redeemClicked} uploadClicked={this.uploadClicked} createClicked={this.createClicked} viewClicked={this.viewClicked} />
            </div>
            <div className='column col-10'>
              <div className='columns'>
                <div className='column col-12 text-center' style={{'marginTop': '5em'}}>
                  <h1>CoupON</h1>
                  <div className='columns'>
                    <div className='column col-6 col-mx-auto text-center'>
                      <p>Welcome to CoupON -- the online, coupon redemption and management utility! To get started, open the menu at the left and select an option.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Toast searchResult={this.state.searchResult} />
        </div>
      );
    }else if(this.state.activePane === 'redeem'){
      return(
        <div className='container'>
          <div className='columns'>
            <div className='column col-1'>
              <CouponMenu redeemClicked={this.redeemClicked} uploadClicked={this.uploadClicked} createClicked={this.createClicked} viewClicked={this.viewClicked} />
            </div>
            <div className='column col-10'>
              <Redeem updateSearchKey={this.updateSearchKey} findVoucher={this.findVoucher} closeModal={this.closeModal} />
            </div>
          </div>
          <Toast searchResult={this.state.searchResult} />
        </div>
      );
    }else if(this.state.activePane === 'upload'){
      return(
        <div className='container'>
          <div className='columns'>
            <div className='column col-1'>
              <CouponMenu redeemClicked={this.redeemClicked} uploadClicked={this.uploadClicked} createClicked={this.createClicked} viewClicked={this.viewClicked} />
            </div>
            <div className='column col-10'>
              <Upload />
            </div>
          </div>
          <Toast searchResult={this.state.searchResult} />
        </div>
      );
    }else if(this.state.activePane === 'view'){
      return(
        <div className='container'>
          <div className='columns'>
            <div className='column col-1'>
              <CouponMenu redeemClicked={this.redeemClicked} uploadClicked={this.uploadClicked} createClicked={this.createClicked} viewClicked={this.viewClicked} />
            </div>
            <div className='column col-10'>
              <DataViewer couponData={this.state.list}/>
            </div>
          </div>
          <Toast searchResult={this.state.searchResult} />
        </div>
      );
    }/*else if(this.state.activePane === 'create'){
      return(
        <div className='container'>
          <div className='columns'>
            <div className='column col-1'>
              <CouponMenu redeemClicked={this.redeemClicked} uploadClicked={this.uploadClicked} createClicked={this.createClicked} />
            </div>
            <div className='column col-10'>
              <h2>Create list</h2>
            </div>
          </div>
          <Toast searchResult={this.state.searchResult} />
        </div>
      );
    }*/
  }
}

export default App;
