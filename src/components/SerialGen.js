import React from 'react';
import { ImportModal } from './Modal';

import './SerialGen.css';

class SerialGen extends React.Component {
  constructor(props){
    super(props)

    this.state={
      generatedData: '',
    }
  }
  makeSerialNumbers = () => {
    //get dom elements
    let output = document.getElementById('result');
    let voucherID = document.getElementById('voucher-id').value;
    let voucherType = document.getElementById('voucher-type').value;
    let quantity = document.getElementById('quantity').value;
    let sliceString = '';
    sliceString = sliceString.padEnd(quantity.length, "0");

    //reset the output
    output.value = '';

    //setup final output string to determine max length
    
    let result = '';
    let listData = [];
    for(let i = 0; i < quantity; i++){
      result += voucherID + voucherType + (sliceString + i).slice(-(sliceString.length)) + ',\n';
      listData.push(voucherID + voucherType + (sliceString + i).slice(-(sliceString.length)));
    }
    output.value = result;
    this.setState({
      generatedData: listData
    })    
  }
  render() {
    return (
      <div>
        <div className='columns'>
          <div className='column col-12 text-center' style={{'marginTop': '5em'}}>
            <h1>CoupON Basic Serial Generator</h1>
            <br />
            <div className='columns'>
              <div className='column col-5 col-mx-auto'>
                <br />
                <p>This basic serial number generator was made in order to produce barcodes. Enter some basic shit below in order to get a number of unique strings that you can use as serial numbers.</p>
                <p>The result will be dumped into the textarea below in a coma delimited list. This should suffice for most needs, but if you need the values to be wrapped in quotes, I can probably add functionality for that... That said, you could also just add them using your favorite text editor, but I digress.</p>
              </div>
              <div className='column col-5 col-mx-auto'>
                <div className='form-group'>
                  <label className='form-label text-left' htmlFor='voucher-id'>Voucher ID</label>
                  <input className='form-input' type='text' id='voucher-id' placeholder='ABC'></input>
                  <label className='form-label text-left' htmlFor='voucher-type'>Voucher Type</label>
                  <input className='form-input' type='text' id='voucher-type' placeholder='2HR'></input>
                  <label className='form-label text-left' htmlFor='quantity'>Quantity</label>
                  <input className='form-input' type='number' id='quantity' placeholder='500'></input>
                  <br />
                </div>
              </div>
              <div className='column col-6 col-mx-auto text-center'>
                <button className="btn btn-primary input-group-btn" onClick={this.makeSerialNumbers}>&nbsp;Go&nbsp;</button>
              </div>
            </div>
            <br />
            <div className='columns'>
              <div className='column col-10 col-mx-auto'>
                <h4>Output</h4>
              </div>
              <textarea className='column col-10 col-mx-auto' id='result' rows='12'>
              </textarea>
            </div>
            <br />
          </div>
          <div className='column col-8 text-center col-mx-auto'>
            <button className='btn btn-primary' onClick={ event => document.getElementById('import-modal').classList.add('active') }>Import Data</button>
          </div>
        </div>
        <br />
        <ImportModal closeModal={this.props.closeModal} data={this.state.generatedData} importData={this.props.importData} />
      </div>
    );
  }
}

export { SerialGen };
