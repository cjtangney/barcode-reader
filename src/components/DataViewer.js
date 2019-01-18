import React, { Component } from 'react';
import { DatePickerModal } from './Modal';

import './DataViewer.css';

class DataViewer extends Component {
  constructor(props){
    super(props);

    this.state = {
      redeemedList: <tr></tr>,
    }
  }
  getData = () => {
    console.log(this.props.couponData);
  }
  getAllRedeemed = () => {
    for(let i = 0; i < document.getElementsByClassName('advanced-query-output').length; i++){
      document.getElementsByClassName('advanced-query-output')[i].classList.remove('open');
    }
    document.getElementById('cumulative-query-results').classList.toggle('open');
    let redeemedList = [];
    this.props.couponData.forEach((list) => {
      list.serials.forEach((voucher) => {
        if(voucher.redeemed){ 
          redeemedList.push(
            <tr key={voucher.id}>
              <td>{list.name}</td>
              <td>{voucher.id}</td>
              <td>{voucher.dateRedeemed}</td>
            </tr>
          );
        }
      });
    })
    this.setState({
      redeemedList: redeemedList
    })
  }
  getRedeemed = (list) => {
    for(let i = 0; i < document.getElementsByClassName('advanced-query-output').length; i++){
      document.getElementsByClassName('advanced-query-output')[i].classList.remove('open');
    }
    document.getElementById(list._id+'result').classList.toggle('open');
    let redeemedList = [];
    list.serials.forEach((voucher) => {
      if(voucher.redeemed){ 
        redeemedList.push(
          <tr key={voucher.id}>
            <td>{voucher.id}</td>
            <td>{voucher.dateRedeemed}</td>
          </tr>
        );
      }
    });
    this.setState({
      redeemedList: redeemedList
    })
  }
  openAdvancedQuery = (event, id) => {
    this.setState({
      redeemedList: <tr></tr>
    });
    for(let i = 0; i < document.getElementsByClassName('advanced-query').length; i++){
      document.getElementsByClassName('advanced-query')[i].classList.remove('open');
    }
    document.getElementById('query'+id).classList.toggle('open');
  }
  render(){
    return(
      <div>
        <div className='columns'>
          <div className='column col-12 text-center' style={{'marginTop': '5em'}}>
            <h1>CoupON Data Viewer</h1>
            <div className='columns'>
              <div className='column col-6 col-mx-auto text-center'>
                <p>In the Data Viewer module, you can review information like the total number of barcodes issued, total number of barcodes redeemed, information by date, and more. If you need an additional data view, please contact your administrator with your request.</p>
              </div>
            </div>
            <div className='columns'>
              <div className='column col-8 col-mx-auto text-center'>
                <a className='cumulative' onClick={event => this.openAdvancedQuery(event, 'main')}><span className='coupon-info-label'>Cumulative Data View</span>&nbsp;<span id='icon-cumulative'><i className='icon icon-arrow-down'></i></span></a>
                <div className='advanced-query' id='querymain'>
                  <p>This feature will allow you to query information stored in all lists.</p>
                  <button className='btn mx-1' onClick={ event => this.getAllRedeemed() }>View all redeemed</button>
                  <button className='btn mx-1' onClick={ event => document.getElementById('date-modal').classList.add('active') }>View by date</button>
                  <div id='cumulative-query-results' className='panel advanced-query-output'>
                    <table className='table text-center'>
                      <tbody>
                        <tr>
                          <th>List</th>
                          <th>Voucher ID</th>
                          <th>Date Redeemed</th>
                        </tr>
                        {this.state.redeemedList}
                      </tbody>
                    </table>
                  </div>
                </div>
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
                    <div className='column col-8 col-mx-auto text-center'>
                      <button className='btn btn-action btn-expand' onClick={event => this.openAdvancedQuery(event, list._id)}><i className='icon icon-plus'></i></button>
                      <div className='advanced-query text-left' id={'query'+list._id}>
                        <span className='coupon-info-label'>Advanced Data Selector</span>
                        <p>Use the advanced data selector to view more specific information pertaining to a given list.</p>
                        <button className='btn' onClick={event => this.getRedeemed(list)}>View all redeemed</button>
                        <div id={list._id+'result'} className='panel advanced-query-output'>
                          <table className='table text-center'>
                            <tbody>
                              <tr>
                                <th>Voucher ID</th>
                                <th>Date Redeemed</th>
                              </tr>
                              {this.state.redeemedList}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <DatePickerModal closeModal={this.props.closeModal} />
      </div>
    );
  }
}      

export { DataViewer };