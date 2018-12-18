import React, { Component } from 'react';
import './Toast.css';

class Toast extends Component {
	render(){
		return(
			<div className='toast toast-success d-hide' id='notify-toast'>
			  <h2>Voucher Successfully Redeemed</h2>
			</div>
		);
	}
}

export { Toast };