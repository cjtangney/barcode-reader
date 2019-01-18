import React, { Component } from 'react';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';

class UploadModal extends Component {
	render(){
		return(
			<div className='modal' id='upload-modal'>
			  <a href='#close' className='modal-overlay' aria-label='Close' id='modal-overlay' onClick={ event => this.props.closeModal(event) }></a>
			  <div className='modal-container'>
			    <div className='modal-header'>
			      <a href='#close' className='btn btn-clear float-right' aria-label='Close' id='modal-close' onClick={ event => this.props.closeModal(event) }></a>
			      <div className='modal-title h5'>Upload List</div>
			    </div>
			    <div className='modal-body'>
			      <div className='content'>
			      	<label className='text-center' htmlFor='serial-list-name-input'>
	              Enter list name:
	            </label>
	            <input type='text' id='serial-list-name-input' style={{ width: '100%', marginBottom: '1em' }}/>
			        <label className='text-center' htmlFor='serial-file-input' style={{ border: '1px solid #ccc', display: 'inline-block', padding: '2em 4em', cursor: 'pointer', 'width': '100%' }}>
	              <i className='fa fa-cloud-upload'></i> Upload List
	            </label>
	            <input type='file' id='serial-file-input' accept='.csv' style={{ display: 'none' }}/>
			      </div>
			    </div>
			    <div className='modal-footer'>
			    	<button className='btn' id='load-button' onClick={ event => (
			    		this.props.loadData(document.getElementById('serial-file-input').files[0], document.getElementById('serial-list-name-input').value)
			    	)} style={{ 'marginTop': '1em' }}>Load List</button>
			    </div>
			  </div>
			</div>
		);
	}
}

class RedeemModal extends Component {
	render(){
		return(
			<div className='modal modal-lg' id='redeem-modal'>
			  <a href='#close' className='modal-overlay' aria-label='Close' id='modal-overlay' onClick={ event => this.props.closeModal(event) }></a>
			  <div className='modal-container'>
			    <div className='modal-header'>
			      <a href='#close' className='btn btn-clear float-right' aria-label='Close' id='modal-close' onClick={ event => this.props.closeModal(event) }></a>
			      <div className='modal-title h5'>Redeem Voucher</div>
			    </div>
			    <div className='modal-body'>
			      <div className='content'>
			      	<label htmlFor='search-key-input'>
			      		Enter serial number below
			      	</label>
			        <input type='text' id='search-key-input' onChange={ event => this.props.updateSearchKey(event.target.value) } style={{'width': '100%'}}/>
			      </div>
			    </div>
			    <div className='modal-footer'>
			    	<button className='btn' id='search-button' onClick={ event => this.props.findVoucher() } style={{'marginTop': '1em'}}>Find Voucher</button>
			    </div>
			  </div>
			</div>
		);
	}
}

class ImportModal extends Component {
	importData = (event) => {
		if(this.props.data){
			this.props.importData(this.props.data, document.getElementById('serial-list-name-input').value);
			this.props.closeModal(event);
		}else{
			alert('no data to import!');
			this.props.closeModal(event);
			return;
		}
	}
	render(){
		return(
			<div className='modal' id='import-modal'>
			  <a href='#close' className='modal-overlay' aria-label='Close' id='modal-overlay' onClick={ event => this.props.closeModal(event) }></a>
			  <div className='modal-container'>
			    <div className='modal-header'>
			      <a href='#close' className='btn btn-clear float-right' aria-label='Close' id='modal-close' onClick={ event => this.props.closeModal(event) }></a>
			      <div className='modal-title h5'>Import Data</div>
			    </div>
			    <div className='modal-body'>
			      <div className='content'>
			      	<label className='text-center' htmlFor='serial-list-name-input'>
	              Enter list name:
	            </label>
	            <input type='text' id='serial-list-name-input' style={{ width: '100%', marginBottom: '1em' }}/>
			      </div>
			    </div>
			    <div className='modal-footer'>
			    	<button className='btn' id='load-button' onClick={ event => {this.importData(event);} } style={{ 'marginTop': '1em' }}>Import List</button>
			    </div>
			  </div>
			</div>
		);
	}
}

class DatePickerModal extends Component {
	constructor(props){
		super(props);

		this.state = {
			selectedDay: null,
		}
	}
	handleDayClick = (day,{selected}) => {
		this.setState({
      selectedDay: selected ? undefined : day,
    });
	}
	render(){
		return(
			<div className='modal' id='date-modal'>
			  <a href='#close' className='modal-overlay' aria-label='Close' id='modal-overlay' onClick={ event => this.props.closeModal(event) }></a>
			  <div className='modal-container'>
			    <div className='modal-header'>
			      <a href='#close' className='btn btn-clear float-right' aria-label='Close' id='modal-close' onClick={ event => this.props.closeModal(event) }></a>
			      <div className='modal-title h5'>Select a date</div>
			    </div>
			    <div className='modal-body'>
			      <div className='content text-center'>
			      	<DayPicker fixedWeeks 
			      	todayButton="Go to Today" 
			      	onDayClick={this.handleDayClick}/>
			      </div>
			    </div>
			    <div className='modal-footer'>
			    	<button className='btn' id='load-button' onClick={ event => this.state.selectedDay ? console.log(this.state.selectedDay) : alert('select a date') } style={{ 'marginTop': '1em' }}>Find</button>
			    </div>
			  </div>
			</div>
		);
	}
}

export { UploadModal, RedeemModal, ImportModal, DatePickerModal };