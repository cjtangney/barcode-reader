import React, { Component } from 'react';

import './DataViewer.css';

class DataViewer extends Component {
  getData = () => {
    console.log(this.props.couponData);
  }
  render(){
    return(
      <div>
        <div className='columns'>
          <div className='column col-12 text-center' style={{'marginTop': '5em'}}>
            <h1>CoupON Data Viewer</h1>
            <div className='columns'>
              <div className='column col-6 col-mx-auto text-center'>
                <p>In the Data Viewer module, you can review information like which total number of barcodes issued, total number of barcodes redeemed, information by date, and more. If you need an additional data view, please contact your administrator with your request.</p>
              </div>
            </div>
            {this.props.couponData.map( list =>
              <div className='columns' key={list._id}>
                <div className='column panel col-10 col-mx-auto list-info'>
                  <span className='coupon-info-label'>List Name</span>
                  <br />
                  <span className='coupon-info-name'>{list.name}</span>
                  <div className='columns coupon-details'>
                    <div className='column col-5 col-mx-auto text-center'>
                      <span className='coupon-info-label'>Total Vouchers</span>
                      <br />
                      <span className='coupon-info-text'>{list.totalQty}</span>
                    </div>
                    <div className='column col-5 col-mx-auto text-center'>
                      <span className='coupon-info-label'>Num Redeemed</span>
                      <br />
                      <span className='coupon-info-text'>{list.redeemQty}</span>
                    </div>
                  </div>
                  <div className='columns'>
                    <div className='column col-10 col-mx-auto text-center'>
                      <button className='btn btn-action btn-expand'><i className='icon icon-arrow-down'></i></button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}      

export { DataViewer };