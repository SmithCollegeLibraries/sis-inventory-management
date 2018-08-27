import React, { Component } from 'react'
import { FormControl, Button } from 'react-bootstrap'
import Process from '../components/process'
import ContentSearch from '../util/search'
import Updates from '../util/updates'
import Load from '../util/load'
import Messages from '../util/messages'
import Alerts from '../components/alerts'
import { getFormattedDate } from '../util/date'
const electron = window.require('electron');
const fs = window.require('fs');
const path = window.require('path');
const fileName = 'trays.json';
const dataLocation = path.resolve(__dirname, '..','data', fileName);

export default class Trays extends Component {

    state = {
        validate: false,
        barcode: {},
        verifiedBarcodes: {},
        loading: false, 
        message: false,
        messageType: 'success',
        messageText: ''
    }

    componentDidMount = () => {
        const results = Load.loadFromFile(dataLocation)
         this.setState({
            verifiedBarcodes: results
        })
    }

    addBarcode = (data) => {
        this.setState({
          barcode: data,
          validate: true
        }, () => {
          console.log(this.state.barcode)
        })
        Alerts.info('Please validate barcodes')
      }

      verifiedBarcodes = (item, status) => {
        if(status === true){
          let barcodeSet = {...this.state.verifiedBarcodes}
          barcodeSet[item.boxbarcode] = item;
          this.setState({
            verifiedBarcodes: barcodeSet
          }, () => {
            Updates.writeToFile(dataLocation, this.state.verifiedBarcodes)
            this.setState({
              validate: false
            })
          })
        }
      }
      
      updateBarcode = (key, updatedBarcode) => {
        const barcodes = this.state.verifiedBarcodes
        barcodes[key] = updatedBarcode;
        this.setState({
          updatedBarcode
        }, () => {
            Updates.writeToFile(dataLocation, this.state.verifiedBarcodes)
        })
      }  


    
    handleDelete = (key) => {
        const items = Object.keys(this.state.verifiedBarcodes)
        let filter = items.filter(item => item !== key)
        this.setState({
            verifiedBarcodes: filter
        }, () => {
            Updates.writeToFile(dataLocation, this.state.verifiedBarcodes)
        })
        Alerts.success('Item deleted successfully')
    }

    processData = async (data) => {
        const values = {
            boxbarcode: data.boxbarcode.trim(),
            barcodes: data.barcodes.trim(),
            location: data.location,
            initials: data.initials,
            added: data.timestamp
        }

        const results = await Load.insertTrays(values) 
        if(results === 'true'){
            Alerts.success('All items have been processed successfully')
            this.setState({
                verifiedBarcodes: {}
            }, () => { Updates.writeToFile(dataLocation, this.state.verifiedBarcodes)})

        } else {
            results.message
                ? Alerts.error(results)
                : Alerts.duplicate(results[0].boxbarcode, results[0].barcode)
        }
    }    

    render(){
        return(
            <div>
                <div className="row">
                    <div className="col-md-3 bg-light form-wrapper">
                        <TrayForm 
                            validate={this.state.validate}
                            addBarcode={this.addBarcode}
                            barcode={this.state.barcode}
                            verifiedBarcodes={this.verifiedBarcodes}
                            collections={this.props.collections}
                            data={this.state.verifiedBarcodes}
                            process={this.processData}
                            settings={this.props.settings}
                        />
                     </div>
                </div>
                <div className="row">
                    <div className="col-md-8 content-wrapper">
                         <TrayDisplay
                            data={this.state.verifiedBarcodes}
                            updateBarcode={this.updateBarcode}
                            collections={this.props.collections}
                            handleDelete={this.handleDelete}
                            loading={this.state.loading}
                        />
                    </div>
                </div>
            </div>         
        )
    }
}



//Handles Process Tray data
class TrayForm extends Component {

    state = {
        boxbarcode: '',
        formErrors: {tray: ''},
        trayValid: false,
    }
    
    componentDidMount(){
        this.boxbarcode.focus();
    }

    addBarcodes = (e) => {
        e.preventDefault();
        const barcode = {
            boxbarcode: this.boxbarcode.value.trim(),
            barcodes: this.barcodes.value.trim(),
            location: this.location.value,
            timestamp: getFormattedDate()
        };
        this.props.addBarcode(barcode);
        this.boxbarcode.value='';
        this.barcodes.value='';
        this.boxbarcode.focus();
    }

    verifyBarcodes = (e) => {
        const barcode = this.props.barcode
        e.preventDefault();
        if(barcode.boxbarcode.trim() !== this.boxbarcode.value.trim()){
          this.sendAlert('Mismatch! \n Original Tray: \n' + barcode.boxbarcode + ' \n Verify Tray: \n' + this.boxbarcode.value)
        }
    
        if(barcode.barcodes.trim() !== this.barcodes.value.trim()) {
          this.sendAlert('Mismatch! \n Original Barcodes: \n' + barcode.barcodes + ' \n Verify Barcodes: \n' + this.barcodes.value)
        }
    
        if(barcode.boxbarcode.trim() === this.boxbarcode.value.trim() && barcode.barcodes.trim() === this.barcodes.value.trim()) {
          this.props.verifiedBarcodes(barcode, true)
          this.boxbarcode.value='';
          this.barcodes.value='';
        }
    }

    sendAlert = (message) => {
        alert(message)
    }
    
    handleUserInput = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({
            [name]: value
        },() => { 
            this.validateField(name, value) 
        });
    }

    validateField = (fieldName, value) => {
        let fieldValidationErrors = this.state.formErrors;
        let trayValid = this.state.trayValid;
    
        switch(fieldName) {
            case 'boxbarcode':
                trayValid = value.length === this.props.settings.trayBarcodeLength;
                fieldValidationErrors.tray = trayValid ? '': ' is too long';
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
    
      handleSubmit = (e) => {
        if(this.props.validate){
          this.verifyBarcodes(e)
        } else {
          this.addBarcodes(e)
        }
      }
    
    render(){

        const collections = this.props.collections || {}

        return(
            <form ref={(input) => this.addBarcodeForm = input} id="barcode_data" name="barcode_data" className="form-horizontal" onSubmit={(e) => this.handleSubmit(e)}>
                <fieldset>
                    <div className="form-group">
                        <label className="col-lg-2 control-label">Collection</label>
                        <div className="col-lg-10">
                            <select ref={(input) => this.location = input} className="form-control" id="select" name="stream">
                            {
                                Object.keys(collections).map((items, key)  => {
                                    return <option key={key} value={collections[items].name}>{collections[items].name}</option>
                                })
                            }
                            </select>
                        </div>
                    </div>
                    <div className={`form-group ${this.errorClass(this.state.formErrors.tray)}`}>
                        <label className="col-lg-2 control-label">Tray</label>
                        <div className="col-lg-10">
                            <input type="number" ref={(input) => this.boxbarcode = input} onChange={this.handleUserInput}  className="form-control" id="box_barcode" name="boxbarcode" placeholder="" required />
                        </div>
                    </div>
                    <div className='form-group'>
                        <label id="bc" className="col-lg-2 control-label">Items</label>
                        <div className="col-lg-10">
                            <textarea ref={(input) => this.barcodes = input} className="form-control" rows="10" id="barcodes" name="barcodes" required></textarea>
                            <div className="help-block with-errors"></div>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="col-lg-10 col-lg-offset-2">
                            <button id="submit" type="submit" className="btn btn-primary" disabled={!this.state.formValid}>
                                {this.props.validate ? 'Validate' : 'Submit' }
                            </button>
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

class TrayDisplay extends Component {
    

      handleChange = (e, key, index) => {
        const values = {
          ...this.props.data[key],
          [e.currentTarget.name]: e.currentTarget.value,
        }
        this.props.updateBarcode(key, values)
    }

    handleDelete = key => {
        this.props.handleDelete(key)
    }
    
      renderDisplay = (key, index) =>{
        const bar = this.props.data[key];
        const collections = this.props.collections
        return(
        <tr key={key}>
            <td><input type="numbers" className="form-control" value={bar.boxbarcode} name="boxbarcode" placeholder="Box Barcode" onChange={(e) => this.handleChange(e, key, index)} /></td>
            <td><textarea className="form-control" name="barcodes" value={bar.barcodes} onChange={(e) => this.handleChange(e, key, index)}></textarea></td>
            <td>
            <select className="form-control" value={bar.location} onChange={(e) => this.handleChange(e, key, index)} name="location">
            {
              Object
              .keys(collections)
              .map(function(items, key) {
                return <option key={key} value={collections[items].name}>{collections[items].name}</option>
              })
            }
            </select></td>
            <td><input className="form-control" id="disabledInput" type="text" value={bar.timestamp} disabled /></td>
            <td><button className="btn btn-danger" onClick={() => this.handleDelete(key)}>Delete</button></td>
        </tr>
        )
      }
    
    
      render(){
        const data = this.props.data || {}  
        return(
          <span>
          <table className="table table-hover tray-table">
            <thead>
            <tr>
              <th>Box Barcode</th>
              <th>Barcodes</th>
              <th>Location</th>
              <th>Added</th>
              <th></th>
            </tr>
            </thead>
            <tbody>
            {
              Object
              .keys(data)
              .map(this.renderDisplay)
            }
            </tbody>
          </table>
          </span>
        )
      }
    }