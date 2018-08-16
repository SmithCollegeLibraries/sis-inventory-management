import React, { Component } from 'react'
import Load from '../util/load'
import ContentSearch from '../util/search'
import Updates from '../util/updates'
import queryString from 'query-string'
import _ from 'lodash'
const electron = window.require('electron');
const fs = window.require('fs');
const path = window.require('path');
const fileName = 'return.json';
const dataLocation = path.resolve(__dirname, '..','data', fileName);

export default class Return extends Component {

    state = {
        return: {},
        loading: false,
        searchObject: {},
        count: 0,
    }

    componentDidMount = async () => {
        const results = Load.loadFromFile(dataLocation)
        this.setState({
            return: results,
            count: results.length,
        })
    }

    updateStatus = (key, data) => {
      const items = this.state.return
      items[key] = data;
      this.setState({
        items
      })
    }

    handleDelete = (e, key, barcode) =>{
        const data = this.state.return
        this.setState((prevState) => ({
          return: prevState.return.filter((_, i) => i != key)
        }), () => 
        this.order()
      );
    }

    clearPicks = () => {
        this.setState({
            return : ''
        })
    }

    addSlips = slip => {
      let string = this.state.searchObject
      let slips = Object.keys(slip).map(item => {
          return slip[item]
      });
      let set = slips.join(',')
      let update = {...string, 'barcode' : set}
      this.setState({
        searchObject: update
      }, () => {
        this.getRecords()
      })
    }

    getRecords = async () => {
      const data = this.state.return
      const search = await ContentSearch.recordData(queryString.stringify(this.state.searchObject))
      this.setState(prevState => ({
        return: [...prevState.return, ...search]
      }), () => {
        this.order()
      })
    }

    sort = (e) => {
      console.log(e.target.value)
      if(e.target.value === 'reset') { 
        this.order() 
      } else {
       const list = this.state.return
       const item = _.orderBy(list, [e.target.value], ['asc'])
       this.setState({return: item})
      }
    }

    order = () => {
      const list = this.state.return
      const item = _.orderBy(list,
        ['shelf.row', 'shelf.ladder', 'shelf.shelf_number'],
        ['asc', 'asc', 'asc']);
      this.setState({ return: item, count: item.length})
    }

    componentDidUpdate = () => {
      Updates.writeToFile(dataLocation, this.state.return)
    }

    render(){
        console.log(this.state.return)
        return(
          <div className="row">
            <div className="col-md-10 form-wrapper">
              <Slips
                data={this.state.return}
                handleDelete={this.handleDelete}
                updateStatus={this.updateStatus}
                order={this.order}
                clearPicks={this.clearPicks}
                reOrder={this.sort}
                getPagingSlips={this.getPagingSlips}
                addSlips={this.addSlips}
                count={this.state.count}
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
      return(
          <SlipsData
              data={data}
              key={key}
              index={key}
              handleDelete={this.props.handleDelete}
              updateStatus={this.props.updateStatus}
          />
        )
    }
  
  
    render(){
      return(
        <div>
          <div className="row">
            <div className="col-md-3 bg-light form-wrapper">
            <br />
              <RequestForm
                addItems={this.props.addSlips}
                getPagingSlips={this.props.getPagingSlips}
              />
            </div>
        </div>
        <div className="row">
          <div className="col-md-9 content-wrapper">
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <SlipDisplayOptions
              results={this.props.data}
              clearPicks={this.props.clearPicks}
              print={this.print}
              handleChange={this.props.reOrder}
              count={this.props.count}
            />
          </nav>
          <div className="slips-display">
            {
              this.props.data 
                ? Object.keys(this.props.data).map(this.renderDisplay) 
                : 'Nothing to return.'
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
        const values = {
          ...this.props.data,
          status: status
      }
      this.props.updateStatus(key, values)
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
            <button className="btn btn-primary btn option-button" onClick={(e) => this.updateStatus(e, index, 'Available')}>Available</button>
            <button className="btn btn-danger btn option-button" onClick={(e) => this.props.handleDelete(e, index, data.barcode)}>Remove</button>
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

    render(){
        return(
          <div>
          {this.state.loading
            ?
            <div className="loading">Loading&#8230;</div>
            : ''
          }
            <nav className="navbar fixed-top navbar-light bg-light justify-content-end">
                <button className="btn btn-secondary option-button" disabled>Items to be returned ({this.props.count})</button>
                <button className="btn btn-info option-button" onClick={() => {if(confirm('This will process all records and send them to the server.  It will also erase the local paging slip file.  Are you sure you want to continue?')) {this.getBarcodes()}}}>Process Data</button>
                <button className="btn btn-info option-button" onClick={() => this.print()}>Print</button>
                <button className="btn btn-danger option-button" onClick={() => {if(confirm('This will clear all the records from your display. You will not be able to recover these once they are cleared. Are you sure you want to continue?')) {this.clearLocal()}}}>Clear</button>
                <div className="col-md-2">
                <select className="form-control pickDisplaySort" onChange={(e) => this.props.handleChange(e)}>
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


class RequestForm extends Component {

  handleSubmit = (e) => {
      e.preventDefault();
      const data = {
          barcodes: this.barcodes.value.trim(),
      };
      this.props.addItems(data);
      this.requestForm.reset();
  }
  
  
  render(){
      return(
        <div>
        <form ref={(e) => this.requestForm = e} id="barcode_data" name="barcode_data" className="form-horizontal" onSubmit={(e) => this.handleSubmit(e)}>
        <fieldset>
            <div className='form-group'>
                <label id="bc" className="col-md-8 control-label">Add items to return</label>
                <div className="col-lg-10">
                    <textarea ref={(input) => this.barcodes = input} className="form-control" rows="15" id="barcodes" name="barcodes" required></textarea>
                    <div className="help-block with-errors"></div>
                </div>
            </div>
        </fieldset>
        <div className="form-group">
            <div className="col-lg-10 col-lg-offset-2">
                <button id="submit" type="submit" className="btn btn-primary">Submit</button>
            </div>
        </div>
        </form>
        </div>
      )
    }
}
