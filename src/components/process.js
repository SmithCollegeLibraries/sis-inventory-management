import React, { Component } from 'react'

export default class Process extends Component {
    
    processData = (key) => {
        const items = this.props.data[key];
        this.props.process(items);
    }
  
    getData = () => {
        {
            Object
                .keys(this.props.data)
                .map(this.processData)
        }
    }
  
    render(){
      return(
        <button id="process" className="btn btn-success process-data" onClick={() => this.getData()}>
          Process requests
        </button>
      )
    }
}