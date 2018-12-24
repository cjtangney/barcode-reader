import React, { Component } from 'react';
import './Toast.css';

class Toast extends Component {
	render(){
		if(this.props.searchResult === 'error'){
			return(
				<div className='toast toast-error d-show text-center' id='notify-toast'>
				  
				</div>
			);
		}else if(this.props.searchResult === 'success'){
			return(
				<div className='toast toast-success d-show text-center' id='notify-toast'>
				  
				</div>
			);
		}else{
			return(
				<div className='toast d-hide text-center' id='notify-toast'>				  
				</div>
			);
		}
	}
}

export { Toast };