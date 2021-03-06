import React, { Component } from 'react'
import { getFormattedDate } from '../util/date'
import Process from '../components/process'
import Updates from '../util/updates'
import Load from '../util/load'
import Messages from '../util/messages'
import Alerts from '../components/alerts'
const electron = window.require('electron');
const fs = window.require('fs');
const path = window.require('path');
const fileName = 'shelf.json';
const dataLocation = path.resolve(__dirname, '..','data', fileName);

export default class Shelf extends Component {

    state = {
        validate: false,
        shelfBarcodes: {},
        loading: false,
    }

    componentDidMount = () => {
         const results = Load.loadFromFile(dataLocation)
         this.setState({
            shelfBarcodes: results
        })
    }

    addTrayToShelf = (item) => {
        const shelfSet = {...this.state.shelfBarcodes}
        shelfSet[item.boxbarcode] = item
        this.setState({
          shelfBarcodes: shelfSet
        }, () => {
            Updates.writeToFile(dataLocation, this.state.shelfBarcodes)
        })
    }

    updateShelf = (key, updatedShelf) => {
        const shelf = this.state.shelfBarcodes;
        shelf[key] = updatedShelf;
        this.setState({
          updatedShelf
        }, () => {
            Updates.writeToFile(dataLocation, this.state.shelfBarcodes)
        })
      }


    handleDelete = (key) => {
        const items = Object.keys(this.state.shelfBarcodes)
        let filter = items.filter(item => item !== key)
        this.setState({shelfBarcodes: filter}, () => {Updates.writeToFile(dataLocation, this.state.shelfBarcodes)})
        Alerts.success('Item deleted successfully')
    }

    processData = async (data) => {
        const values = {
            boxbarcode: data.boxbarcode,
            shelfbarcode: data.shelfbarcode,
            added: data.timestamp,
            shelf_depth: data.shelf_depth,
            shelf_position: data.shelf_position
        }

        const results = await Load.insertShelf(values) 
        if(results === 'true'){
            Alerts.success('All items have been processed successfully')
            this.setState({
                shelfBarcodes: {}
            }, () => { Updates.writeToFile(dataLocation, this.state.shelfBarcodes)})

        } else {
            results && results.message
                ? Alerts.error(results)
                : Alerts.duplicate(results[0].boxbarcode, results[0].barcode)
        }
    }  
  

      render(){
        return(
          <div>
            {this.state.message ? Messages.response(this.state.messageText, this.state.messageType) : ''}
            <div className="row">
              <div className="col-md-3 bg-light form-wrapper">
                <ShelfForm
                  addTray={this.addTrayToShelf}
                  data={this.state.shelfBarcodes} 
                  process={this.processData}
                  settings={this.props.settings}
                />
              </div>
            </div>
            <div className="row">
            {this.state.loading
              ?
              <div className="loading">Loading&#8230;</div>
              : ''
            }
              <div className="col-md-8 content-wrapper">
                <ShelfDisplay
                  data={this.state.shelfBarcodes}
                  updateShelf={this.updateShelf}
                  handleDelete={this.handleDelete}
                  settings={this.props.settings}
                />
              </div>
            </div>
          </div>
        )
      }
    }

 
    class ShelfForm extends Component {
        state = {
            boxbarcode: '',
            shelfbarcode: '',
            shelfposition: 1,
            formErrors: {tray: '', shelf: ''},
            trayValid: false,
            shelfValid: false,
            formValid: false
        }
        
        componentDidMount(){
            this.boxbarcode.focus();
        }
        
        handleDepth = (e) => {
            e.preventDefault();
            this.setState({
                shelfposition: 1
            })
        }
        
        addTrayToShelf = (e) => {
            e.preventDefault();
            const barcode = {
                boxbarcode: this.boxbarcode.value,
                shelfbarcode: this.shelfbarcode.value,
                shelf_depth: this.shelf_depth.value,
                shelf_position: this.state.shelfposition,
                timestamp: getFormattedDate()
            };
        
            this.props.addTray(barcode);
            this.boxbarcode.value = '';
            this.shelfbarcode.value = '';
            this.boxbarcode.focus();
        }
        
        
        handleUserInput = (e) => {
            const name = e.target.name;
            const value = e.target.value;
            this.setState({[name]: value},
                () => { this.validateField(name, value) });
        }
        
        validateField = (fieldName, value) => {
            let fieldValidationErrors = this.state.formErrors;
            let trayValid = this.state.trayValid;
            let shelfValid = this.state.shelfValid;
        
            switch(fieldName) {
                case 'shelfbarcode':
                    shelfValid = value.length === this.props.settings.shelfBarcodeLength;
                    fieldValidationErrors.shelf = shelfValid ? '': ' isn\'t the right length';
                break;
                case 'boxbarcode':
                    trayValid = value.length === this.props.settings.trayBarcodeLength;
                    fieldValidationErrors.tray = trayValid ? '': ' isn\'t the right length';
                break;
                default:
                break;
            }
            this.setState({formErrors: fieldValidationErrors,
                trayValid: trayValid,
            }, this.validateForm);
        }
        
        validateForm = () => {
            this.setState({formValid: this.state.trayValid});
        }
        
        errorClass = (error) => {
            return(error.length === 0 ? '' : 'has-error');
        }
        
        
        render(){
            return(
              <form ref={(input) => this.addTrayForm = input} id="barcode_data" name="barcode_data" className="form-horizontal" onSubmit={(e) => this.addTrayToShelf(e)}>
                  <fieldset>
                              <div className="form-group">
                                  <label className="col-lg-2 control-label">Depth</label>
                                  <div className="col-lg-10">
                                      <select className="form-control" ref={(input) => this.shelf_depth = input} name="shelf_depth">
                                          <option value="Front">Front</option>
                                          <option value="Middle">Middle</option>
                                          <option value="Rear">Rear</option>
                                      </select>
                                  </div>
                              </div>
                              <div className={`form-group ${this.errorClass(this.state.formErrors.tray)}`}>
                                  <label className="col-lg-2 control-label">Tray Barcode*</label>
                                  <div className="col-lg-10">
                                      <input type="number" ref={(input) => this.boxbarcode = input} onChange={this.handleUserInput} className="form-control" id="box_barcode" name="boxbarcode" placeholder="" required />
                                  </div>
                              </div>
                              <div className={`form-group ${this.errorClass(this.state.formErrors.shelf)}`}>
                                  <label className="col-lg-2 control-label">Shelf Barcode*</label>
                                  <div className="col-lg-10">
                                      <input type="text" ref={(input) => this.shelfbarcode = input} onChange={this.handleUserInput} className="form-control" id="shelf_barcode" name="shelfbarcode" placeholder="" required />
                                  </div>
                              </div>
                              <div className="form-group">
                                  <div className="col-lg-10 col-lg-offset-2">
                                      <button id="submit" type="submit" className="btn btn-primary" disabled={!this.state.formValid}>Submit</button>
                                      <br />
                                      <Process
                                        data={this.props.data}
                                        process={this.props.process}
                                      />
                                  </div>
                              </div>
                          </fieldset>
                      </form>
            )
          }
    }


    class ShelfDisplay extends Component {
        
        handleChange = (e, key) => {
            const shelf = this.props.data[key];
            const values = {
                [e.target.name]: e.target.value.trim()
            }
            const updateShelves = {...shelf, ...values}
            this.props.updateShelf(key, updateShelves)
        }

        handleDelete = key => {
            this.props.handleDelete(key)
        }
    
        renderShelf = (key) => {
            const shelf = this.props.data[key];
            return(
                <div className="card" key={key}>
                <div className="card-body">
                    <dl className="row" key={key}>
                        <dt className="col-sm-3">Tray Barcode</dt>
                        <dd className="col-sm-9">
                            <input value={shelf.boxbarcode} className="form-control" name="boxbarcode" placeholder="Box Barcode" onChange={(e) => this.handleChange(e, key)} />
                        </dd>
                        <dt className="col-sm-3">Shelf Barcode</dt>
                        <dd className="col-sm-9">  
                            <input value={shelf.shelfbarcode} className="form-control" name="shelfbarcode" placeholder="Shelf Barcode" onChange={(e) => this.handleChange(e, key)} />
                        </dd>
                        <dt className="col-sm-3">Shelf Depth</dt>
                        <dd className="col-sm-9">
                            <select className="form-control" value={shelf.shelf_depth} onChange={(e) => this.handleChange(e, key)} name="shelf_depth">
                                <option value="">Depth</option>
                                <option value="Front">Front</option>
                                <option value="Middle">Middle</option>
                                <option value="Rear">Rear</option>
                            </select>
                        </dd>
                        <dt className="col-sm-3">Shelf Position</dt>
                        <dd className="col-sm-9">
                        <select className="form-control" value={shelf.shelf_position} onChange={(e) => this.handleChange(e, key)} name="shelf_position">
                            <option value="">Position</option>
                            {[...Array(this.props.settings.shelfPositions)].map((x, i) =>
                                <option key={i} value={i + 1}>{i + 1}</option>
                            )}
                        </select>
                        </dd>
                        <dt className="col-sm-3">Added</dt>
                        <dd className="col-sm-9">
                            <input className="form-control" id="disabledInput" type="text" value={shelf.timestamp} disabled />
                        </dd>
                        <dt className="col-sm-3"></dt>
                        <dd className="col-sm-9">
                            <button className="btn btn-danger" onClick={() => this.handleDelete(key)}>Delete</button>
                        </dd>
                    </dl>
                </div>
             </div>   
            )
        }
    
        render(){
            const data = this.props.data || {}
            return (
                <div>
                    {
                        Object
                            .keys(data)
                            .map(this.renderShelf)
                    }
                </div>
            )
        }
    }