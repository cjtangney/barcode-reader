import React, { Component } from 'react';
import { RedeemModal } from './Modal';

class Redeem extends Component {
  render(){
    return(
      <div>
        <div className='columns'>
          <div className='column col-12 text-center' style={{'marginTop': '5em'}}>
            <h1>CoupON Redemption Module</h1>
            <div className='columns'>
              <div className='column col-6 col-mx-auto text-center'>
                <p>Validating coupons has never been easier, thanks to CoupON. To validate a coupon, start by selecting the button below. When prompted, scan the coupon's code into the text field, and click search. CoupON will then automatically locate and redeem the coupon, ensuring that double-usage on coupons is a thing of the past!</p>
              </div>
            </div>
          </div>
        </div>
        <div className='columns hero text-center' style={{'marginTop': '5em'}}>
          <div className='hero-body'>
            <div className='columns'>
              <div className='column col-12 col-mx-auto'>
                <button className='btn btn-success' id='redeem-button' onClick={ event => document.getElementById('redeem-modal').classList.add('active') } style={{'padding': '2em 5em', 'height': 'auto'}}>Redeem Voucher</button>
              </div>
            </div>
          </div>
        </div>
        <RedeemModal updateSearchKey={this.props.updateSearchKey} findVoucher={this.props.findVoucher} closeModal={this.props.closeModal} />
      </div>
    );
  }
}      

export { Redeem };