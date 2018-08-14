import React, { Component } from 'react'
import Load from '../util/load'
import ContentSearch from '../util/search'
import Updates from '../util/updates'
const fs = window.require('fs');
const path = window.require('path');
const fileName = 'paging.json';
const dataLocation = path.resolve(__dirname, '..','data', fileName);

export default class PagingDisplay extends Component {

    state = {
        pick: {},
        loading: false
    }

    componentDidMount(){
        const results = Load.loadFromFile(dataLocation)
        this.setState({
            pick: results.items
        })
    }

    handleDelete = (key, barcode) =>{
        const data = {
            'items': this.state.pick
        }
        this.setState((prevState) => ({
          pick: prevState.pick.filter((_, i) => i != key)
        }), () => Updates.writeToFile(dataLocation, data));
    }

    clearPicks = () => {
        this.setState({
            pick : {}
        }, () => {
            Updates.writeToFile(dataLocation, this.state.picks) 
        })
    }

    render(){
        return(
          <div className="row">
            <div className="col-md-10 form-wrapper">
              <Slips
                data={this.state.pick}
                handleDelete={this.handleDelete}
                updateStatus={this.updateStatus}
                order={this.order}
                clearPicks={this.clearPicks}
                reOrder={this.orderBy}
              />
            </div>
          </div>
        )
    }
}


class Slips extends Component {

    state = {
        height: 'all'
    }
  
    print = () => {
        let win = new BrowserWindow({width: 1100, height: 600})
        win.loadURL('file://' + __dirname + '/print/print.html')
        win.webContents.on('did-finish-load', () => {
          // Use default printing options
          win.webContents.print({}, (error, data) => {
            if (error) throw error
          })
        })
    }
  
  
    showHeight = (height) => {
      this.setState({
        height: height
      })
    }
  
    order = (e) => {
      this.props.order()
    }
  
  
    renderDisplay = (key) => {
      const data = this.props.data[key]
      if(data){
            return(
              <SlipsData
                data={data}
                key={key}
                index={key}
                removeThis={this.props.handleDelete}
                updateStatus={this.props.updateStatus}
                />
              )
    } else {
        return(
          <tr key={key}>
            <td></td>
          </tr>
        )
    }
    }
  
  
    render(){
      return(
        <div>
        <div className="row">
          <div className="col-md-10 form-wrapper">
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <SlipDisplayOptions
              results={this.props.data}
              clearPicks={this.props.clearPicks}
              print={this.print}
              reOrder={this.props.reOrder}
            />
          </nav>
          <div className="slips-display">
            {
              this.props.data ? Object.keys(this.props.data).map(this.renderDisplay) : 'Nothing to pull.  Add some items in Paging > Search'
            }
          </div>
          </div>
        </div>
        </div>
      )
    }
  }


class SlipsData extends Component {

    updateStatus = (e, key, status) => {
      const data = this.props.data
      const update = Object.assign({}, data, {'status': status});
      this.props.updateStatus(key, update)
    }
  
    handleDelete = (e, key, barcode) => {
      this.props.removeThis(key, barcode)
    }
  
    render(){
      const {data, index} = this.props
      return(
        <div className="card">
          <div className="card-body">
           <div className="row card-text">
            <div className="col">
            <dl className="row">
              <dt className="col-sm-3">Status</dt>
              <dd className="col-sm-9"><strong>{data.status}</strong></dd>
              <dt className="col-sm-3">Barcode</dt>
              <dd className="col-sm-9">{data.barcode}</dd>
              <dt className="col-sm-3">Tray Barcode</dt>
              <dd className="col-sm-9">{data.tray_barcode}</dd>
              <dt className="col-sm-3">Shelf Barcode</dt>
              <dd className="col-sm-9">{data.shelf_barcode}</dd>
              <dt className="col-sm-3">Shelf Depth</dt>
              <dd className="col-sm-9">{data && data.shelf && data.shelf.shelf_depth ? data.shelf.shelf_depth :''}</dd>
              <dt className="col-sm-3">Shelf Position</dt>
              <dd className="col-sm-9">{data && data.shelf && data.shelf.shelf_depth ? data.shelf.shelf_position: ''}</dd>
              <dt className="col-sm-3">Collection</dt>
              <dd className="col-sm-9">{data.stream}</dd>
  
            </dl>
            </div>
            <div className="col">
            <dl className="row">
              <dt className="col-sm-3">Title</dt>
              <dd className="col-sm-9">{data.title}</dd>
              <dt className="col-sm-3">Call Number</dt>
              <dd className="col-sm-9">{data.call_number}</dd>
              <dt className="col-sm-3">Description</dt>
              <dd className="col-sm-9">{data.description}</dd>
              <dt className="col-sm-3">Old Location</dt>
              <dd className="col-sm-9">{data.old_location}</dd>
              <dt className="col-sm-3">Height</dt>
              {data && data.shelf && data.shelf.shelf_depth ? 
                data.shelf.shelf_number >= 8
                    ? <dd className="requires-truck col-sm-9">Requires Lift Truck</dd>
                    : <dd className="no-truck col-sm-9">Does not require truck</dd>
                : ''    
              }
              <dt className="col-sm-3">Last Update</dt>
              <dd className="col-sm-9">{data.timestamp}</dd>
            </dl>
            </div>
            </div>
            <button className="btn btn-primary btn option-button" onClick={(e) => this.updateStatus(e, index, 'Off Campus')}>Found</button>
            <button className="btn btn-primary btn option-button" onClick={(e) => this.updateStatus(e, index, 'Missing')}>Missing</button>
            <button className="btn btn-primary btn option-button" onClick={(e) => this.updateStatus(e, index, 'Available')}>Available</button>
            <button className="btn btn-danger btn option-button" onClick={(e) => this.handleDelete(e, index, data.barcode)}>Remove</button>
          </div>
        </div>
      )
    }
  }


  class SlipDisplayOptions extends Component{
    
    state = {
        show: false,
        showBarcodes: false,
        loading: false
    }

    getBarcodes(){
        Object.keys(this.props.results).map(this.processBarcodes)
    }

    print(){
      this.props.print()
    }

    clearLocal(){
      this.props.clearPicks()
    }

    handleChange(e){
      this.props.reOrder(e.currentTarget.value)
    }

    render(){
        return(
          <div>
          {this.state.loading
            ?
            <div className="loading">Loading&#8230;</div>
            : ''
          }
            <nav className="navbar fixed-top navbar-light bg-light justify-content-end">
                <button className="btn btn-info option-button" onClick={() => {if(confirm('This will process all records and send them to the server.  It will also erase the local paging slip file.  Are you sure you want to continue?')) {this.getBarcodes()}}}>Process Data</button>
                <button className="btn btn-info option-button" onClick={() => this.print()}>Print</button>
                <button className="btn btn-danger option-button" onClick={() => {if(confirm('This will clear all the records from your display. You will not be able to recover these once they are cleared. Are you sure you want to continue?')) {this.clearLocal()}}}>Clear</button>
                <div className="col-md-2">
                <select className="form-control pickDisplaySort" onChange={(e) => this.handleChange(e)}>
                    <option value="">Sort</option>
                    <option value="reset">Reset Sort</option>
                    <option value="call_number">Call Number</option>
                    <option value="tray_barcode">Tray Barcode</option>
                    <option value="stream">Collection</option>
                    <option value="title">Title</option>
                    <option value="shelf.row">Row</option>
                    <option value="shelf.ladder">Ladder</option>
                </select>
                </div>
          </nav>
        </div>
        )
    }
}
