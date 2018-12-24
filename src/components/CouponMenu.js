import React, { Component } from 'react';
import './CouponMenu.css';

class CouponMenu extends Component {
  render(){
    return(
      <div className='off-canvas' id='off-canvas-menu'>
        <a className='off-canvas-toggle btn btn-action' href='#coupon-menu'>
          <i className='icon icon-arrow-right'></i>
        </a>
        
        <div id='coupon-menu' className='off-canvas-sidebar'>
          <ul className='nav'>
            <li className='nav-item'>
              <a href='#' onClick={this.props.redeemClicked}>Redeem Coupon</a>
            </li>
            <li className='nav-item'>
              <a href='#' onClick={this.props.uploadClicked}>Upload List</a>
            </li>
            <li className='nav-item'>
              <a href='#' onClick={this.props.createClicked}>Create List</a>
            </li>
          </ul>
        </div>

        <a className='off-canvas-overlay' href='#close'></a>

        <div className='off-canvas-content'>
        </div>
      </div>
    );
  }
}      

export { CouponMenu };