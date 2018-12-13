import React, { Component } from 'react';

class UploadModal extends Component {
	closeModal = (e) => {
		e.preventDefault();
		let modal = document.getElementById('upload-modal');
  	modal.classList.remove('active');
	}
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
			        <label className='text-center' htmlFor='serial-file-input' style={{ border: '1px solid #ccc', display: 'inline-block', padding: '2em 4em', cursor: 'pointer', 'width': '100%' }}>
	              <i className='fa fa-cloud-upload'></i> Upload List
	            </label>
	            <input type='file' id='serial-file-input' accept='.csv' onChange={ event => (this.props.loadData(event.target.files[0])) } style={{ display: 'none' }}/>
			      </div>
			    </div>
			    <div className='modal-footer'>
			    </div>
			  </div>
			</div>
		);
	}
}

class RedeemModal extends Component {
	closeModal = (e) => {
		e.preventDefault();
		let modal = document.getElementById('redeem-modal');
  	modal.classList.remove('active');
	}
	render(){
		return(
			<div className='modal' id='redeem-modal'>
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

export { UploadModal, RedeemModal };