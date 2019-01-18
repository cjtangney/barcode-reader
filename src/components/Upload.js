import React, { Component } from 'react';
import { UploadModal } from './Modal';

class Upload extends Component {
  render(){
    return(
      <div>
        <div className='columns'>
          <div className='column col-12 text-center' style={{'marginTop': '5em'}}>
            <h1>CoupON Upload Module</h1>
            <div className='columns'>
              <div className='column col-6 col-mx-auto text-center'>
                <p>This feature has been disabled temporarily, and will be re-enabled soon!</p>
              </div>
            </div>
          </div>
        </div>
        <div className='columns hero text-center' style={{'marginTop': '5em'}}>
          <div className='hero-body'>
            <div className='columns'>
              <div className='column col-12 col-mx-auto'>
                <button className='btn btn-primary disabled' id='upload-button' onClick={ event => document.getElementById('upload-modal').classList.add('active') } style={{'padding': '2em 5em', 'height': 'auto'}}>Upload List</button>
              </div>
            </div>
          </div>
        </div>
        <UploadModal loadData={this.props.loadData} closeModal={this.props.closeModal} />
      </div>
    );
  }
}      

export { Upload };