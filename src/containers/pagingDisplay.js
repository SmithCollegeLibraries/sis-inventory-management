import React, { Component } from 'react'
import Load from '../util/load'
import ContentSearch from '../util/search'
import Updates from '../util/updates'
import Alerts from '../components/alerts'
import queryString from 'query-string'
import _ from 'lodash'
import { getFormattedDate } from '../util/date';
const {remote} = require('electron');
const {BrowserWindow, dialog, shell} = remote;
const fs = window.require('fs');
const path = window.require('path');
const fileName = 'paging.json';
const printFileName = 'print.html';
const dataLocation = path.resolve(__dirname, '..','data', fileName);
const printLocation = path.resolve(__dirname, '..', 'print', printFileName);


export default class PagingDisplay extends Component {

    state = {
        pick: {},
        pickBackup: {},
        loading: false,
    }

    componentDidMount = async () => {
        const results = await Load.loadFromFile(dataLocation)
        this.setState({
            pick: results,
        }, () => {
          this.order()
        })
    }

    updateStatus = (key, data) => {
      const items = this.state.pick
      const back = this.state.pickBackup
      items[key] = data;
      back[key] = data
      this.setState({
        items,
        back
      })
    }

    handleMarkAll = (e) => {
        const item  = this.state.pick.map((items, index) => {
            return {...items, 'status': e.target.value}
        })
        this.setState({pick: item}, () => {Updates.writeToFile(dataLocation, this.state.pick)})    
    }

    handleDelete = (e, key, barcode) =>{
        const data = this.state.pick
        this.setState((prevState) => ({
          pick: prevState.pick.filter((_, i) => i != key)
        }), () => 
        this.order()
      );
    }

    clearPicks = () => {
        this.setState({
            pick : {},
            count: 0
        })
    }


    sort = (e) => {
      if(e.target.value === 'reset') { 
        this.order() 
      } else {
       const list = this.state.pick
       const item = _.orderBy(list, [e.target.value], ['asc'])
       this.setState({pick: item})
      }
    }

    order = () => {
      const list = this.state.pick
      const item = _.orderBy(list,
        ['shelf.row', 'shelf.ladder', 'shelf.shelf_number'],
        ['asc', 'asc', 'asc']);
      this.setState({ pick: item, count: item.length, loading: false, pickBackup: item})
    }

    handleFilter = (data) => {
      const list = this.state.pick
      let items
      switch(data.type){
        case 'row':
          items = _.filter(list, el => el.shelf.row > data.filter)
         break;  
      }
      this.setState({pick: items})
    }

    clearFilters = (e) => {
      e.preventDefault()
      this.setState({
        pick: this.state.pickBackup
      })
    }

    componentDidUpdate = () => {
      Updates.writeToFile(dataLocation, this.state.pick)
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
                reOrder={this.sort}
                getPagingSlips={this.getPagingSlips}
                addSlips={this.addSlips}
                count={this.state.count}
                morningCount={this.state.morningCount}
                eveningCount={this.state.eveningCount}
                loading={this.state.loading}
                handleFilter={this.handleFilter}
                clearFilters={this.clearFilters}
                handleMarkAll={this.handleMarkAll}
                settings={this.props.settings}
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
        win.loadURL(`file://${printLocation}`)
        win.webContents.on('did-finish-load', () => {
          // Use default printing options
          win.webContents.print({}, (error, data) => {
            if (error) throw error
          })
        })
    }

    handleFilter = (e) => {
      e.preventDefault()
      const data = {
        filter: this.filter.value.trim(),
        type: this.type.value
      }
      this.props.handleFilter(data)
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
              settings={this.props.settings}
          />
        )
    }
  
  
    render(){
      return(
        <div>
          <br />
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <SlipDisplayOptions
              results={this.props.data}
              clearPicks={this.props.clearPicks}
              print={this.print}
              handleChange={this.props.reOrder}
              getPagingSlips={this.props.getPagingSlips}
              count={this.props.count}
              morningCount={this.props.morningCount}
              eveningCount={this.props.eveningCount}
              loading={this.props.loading}
              handleMarkAll={this.props.handleMarkAll}
            />
          </nav>
          <div className="slips-display">
          <div>
            </div> 
            {
              this.props.data 
                ? Object.keys(this.props.data).map(this.renderDisplay) 
                : 'Nothing to pull.'
            }
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
            <dl className="row">
              <dt className="col-sm-3">Status</dt>
              <dd className="col-sm-9"><strong>{data.status}</strong></dd>
              <dt className="col-sm-3">Height</dt>
              {data && data.shelf && data.shelf.shelf_depth ? 
                data.shelf.shelf_number >= this.props.settings.liftHeight
                    ? <dd className="requires-truck col-sm-9">Requires Lift Truck</dd>
                    : <dd className="no-truck col-sm-9">Does not require truck</dd>
                : ''    
              }
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
              <dt className="col-sm-3">Title</dt>
              <dd className="col-sm-9">{data.title}</dd>
              <dt className="col-sm-3">Call Number</dt>
              <dd className="col-sm-9">{data.call_number}</dd>
              <dt className="col-sm-3">Description</dt>
              <dd className="col-sm-9">{data.description}</dd>
              <dt className="col-sm-3">Old Location</dt>
              <dd className="col-sm-9">{data.old_location}</dd>
              <dt className="col-sm-3">Last Update</dt>
              <dd className="col-sm-9">{data.timestamp}</dd>
              </dl>
            <button className="btn btn-primary btn option-button" onClick={(e) => this.updateStatus(e, index, 'Off Campus')}>Found</button>
            <button className="btn btn-primary btn option-button" onClick={(e) => this.updateStatus(e, index, 'Missing')}>Missing</button>
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

    processBarcodes = async (key) => {
      const data = this.props.results[key]
      const values = {
        status: data.status,
        timestamp: getFormattedDate()
      }
      if(data.tray_id){
        const results = await Load.processBarcodes(data.tray_id, data.barcode, data)
      }
      this.props.clearPicks()
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
           {this.props.loading
            ?
            <div className="loading">Loading&#8230;</div>
            : ''
          }
            <nav className="navbar fixed-top navbar-light bg-light justify-content-end">
                <button className="btn btn-secondary option-button" disabled>Items to be paged ({this.props.count})</button>
                <button className="btn btn-info option-button" onClick={() => {if(confirm('This will process all records and send them to the server.  It will also erase the local paging slip file.  Are you sure you want to continue?')) {this.getBarcodes()}}}>Process Data</button>
                <button className="btn btn-info option-button" onClick={() => this.print()}>Print</button>
                <button className="btn btn-danger option-button" onClick={() => {if(confirm('This will clear all the records from your display. You will not be able to recover these once they are cleared. Are you sure you want to continue?')) {this.clearLocal()}}}>Clear</button>
                <div className="col-auto">
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
                <div className="col-auto">
                <select className="form-control pickDisplaySort" onChange={(e) => this.props.handleMarkAll(e)}>
                    <option value="">Mark All</option>
                    <option value="Available">Available</option>
                    <option value="Off Campus">Found</option>
                </select>
                </div>
          </nav>
        </div>
        )
    }
}
