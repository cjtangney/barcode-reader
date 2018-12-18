import React, { Component } from 'react';
import Papa from 'papaparse';
import Axios from 'axios';
import { UploadModal, RedeemModal } from './components/Modal';
import { Toast } from './components/Toast';
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
    this.socket = IO.connect('http://localhost:3000');

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
      let tempList = new BarcodeList(name, fileName, serialList, 0, 0);
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
    (this.state.list.length > 0) ? 
      this.serialSearch() : 
      alert('no data has been loaded');
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
            alert('this voucher has been previously redeemed.');
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
            document.getElementById('redeem-modal').classList.remove('active');
            break;
          }
        }
      }
    }
    if(!keyFound){
      alert('this voucher is invalid.')
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
      this.showToast();
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
  showToast = () => {
    let toast = document.getElementById('notify-toast');
    toast.classList.remove('d-hide');
    toast.classList.add('show');
    setTimeout(function(){ 
      toast.classList.remove('show');
      toast.classList.add('d-hide'); 
    }, 3000);
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
        {/*<button className='btn btn-primary' id='upload-button' onClick={ event => document.getElementById('upload-modal').classList.add('active') }>Upload List</button>*/}
        <div className='columns hero bg-dark text-center' style={{'marginTop': '10em'}}>
          <div className='hero-body'>
            <div className='columns'>
              <div className='column col-12 col-mx-auto'>
                <button className='btn btn-success' id='redeem-button' onClick={ event => document.getElementById('redeem-modal').classList.add('active') } style={{'padding': '2em 5em', 'height': 'auto'}}>Redeem Voucher</button>
              </div>
            </div>
          </div>
          <Toast />
        </div>
        <UploadModal loadData={this.loadData} closeModal={this.closeModal} />
        <RedeemModal updateSearchKey={this.updateSearchKey} findVoucher={this.findVoucher} closeModal={this.closeModal} />
      </div>
    );
  }
}

export default App;
