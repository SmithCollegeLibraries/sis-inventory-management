import React, { Component } from 'react'
import Load from '../util/load'
import ContentSearch from '../util/search'
import Updates from '../util/updates'
import Alerts from '../components/alerts'
import queryString from 'query-string'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import _ from 'lodash'
const fs = window.require('fs');
const path = window.require('path');
const fileName = 'return.json';
const fileNameSlips = 'returnslips.json'
const dataLocation = path.resolve(__dirname, '..','data', fileName);
const dataLocationSlips = path.resolve(__dirname, '..','data', fileNameSlips);

export default class AddPaging extends Component {

    state = {
        add: {},
        return: {},
        count: 0,
        loading: false,
        searchObject: {}
    }

    componentDidMount = async () => {
        const results = await Load.loadFromFile(dataLocationSlips)
        const returns = await Load.loadFromFile(dataLocation)
        this.setState({
            add: results,
            return: returns,
        }, () => {
          this.order()
        })
    }

    addSlip = (values) => {
        const data = this.state.add
        this.setState(prevState => ({
            add: [...prevState.add, ...values]
      }))
    }  
    
    handleChange = (e, values, index) => {
        if(e.target.checked === true) {
            this.addReturn(values)
        } else {
            this.removeReturn(values, index)
        }
    } 

    addReturn = (values) => { 
        const data = this.state.return
        this.setState(prevState => ({
            return: [...prevState.return, values]
      }), () => {
            Updates.writeToFile(dataLocation, this.state.return)
            Alerts.success(`Added ${values.barcode} to return list`)
      })
    }

    addItems = slip => {
        this.setState({loading: true})
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
        const data = this.state.add
        const search = await ContentSearch.recordData(queryString.stringify(this.state.searchObject))
        this.setState(prevState => ({
          add: [...prevState.add, ...search],
        }), () => {
          this.order()
        })
      }

    removeReturn = (values, index) => {
        this.setState((prevState) => ({
            return: prevState.return.filter((_, i) => i != index)
        }), () => {
            Updates.writeToFile(dataLocation, this.state.return)
            Alerts.info(`Removed ${values.barcode} from return list`)
        })
    }

    handleOptions = (e, option) => {
        e.preventDefault()
        const list = this.state.add
        const pick = this.state.return

        switch(option){
            case 'onlyFloor':
                this.handlePickUpdate(_.filter(list, el => parseInt(el.shelf.shelf_number, 10) < this.props.settings.liftHeight))
                this.handleAddUpdate(_.filter(list, el => parseInt(el.shelf.shelf_number, 10) >= this.props.settings.liftHeight)) 
                Alerts.success(`Added items below shelf ${this.props.settings.liftHeight} to paging list`)
            break;
            case 'onlyLift': 
                this.handlePickUpdate(_.filter(list, el => parseInt(el.shelf.shelf_number, 10) >= this.props.settings.liftHeight))  
                this.handleAddUpdate(_.filter(list, el => parseInt(el.shelf.shelf_number, 10) < this.props.settings.liftHeight))
                Alerts.success(`Added items at shelf ${this.props.settings.liftHeight} and above to paging list`)
            break;
            case "addAll":
                this.handleReturnUpdate(list)
                this.handleAddUpdate({})
                Alerts.success('Added all items to return list')
            break;
            case "removeAll":
                this.handleAddUpdate({})
                Alerts.success('Removed all items')
            break;
            default: 
            break; 
        }

    }  

    handleReturnUpdate = (items) => {
        this.setState(prevState => ({
            return: [...prevState.return, ...items]
        }), () => {
            Updates.writeToFile(dataLocation, this.state.return)
        })
    }

    handleAddUpdate = (add) => {
        this.setState({
            add: add
        }, () => {
            Updates.writeToFile(dataLocationSlips, this.state.add) 
        })
    }

    order = () => {
        const list = this.state.add
        const item = _.orderBy(list,
          ['call_number'],
          ['asc']);
        this.setState({ 
            add: item, 
            count: item.length, 
            loading: false
        }, () => {
            Updates.writeToFile(dataLocationSlips, this.state.add)
        })
    }
    
    sort = (target, order) => {
         const list = this.state.add
         const item = _.orderBy(list, target, [order])
         this.setState({add: item})
    }


    render(){
        return(
            <div>
              {this.state.loading
              ?
              <div className="loading">Loading&#8230;</div>
              : ''
            }
             <div className="row">
                <div className="col-md-3 bg-light form-wrapper">
                        <RequestForm 
                            add={this.state.add}
                            addItems={this.addItems}
                        /> 
                    <OptionGroup
                        getPagingSlips={this.getPagingSlips}
                        handleOptions={this.handleOptions}
                    />
                </div>
              </div>  
               <div className="row">
                    <div className="col-md-8 content-wrapper">
                    <SlipDisplay
                        data={this.state.add}
                        sort={this.sort}
                        handleChange={this.handleChange}
                        settings={this.props.settings}
                    />
                </div>
               </div> 
            </div>    
        )
    }
}

class OptionGroup extends Component {
    render(){
        return(
            <div className="btn-group-vertical" style={{marginLeft: '10px'}}>
                <button className="btn btn-info option-button" style={{marginBottom: '20px'}} onClick={(e) => this.props.handleOptions(e, 'onlyFloor')}>Add Non-Lift items</button>
                <button className="btn btn-info option-button" style={{marginBottom: '20px'}} onClick={(e) => this.props.handleOptions(e, 'onlyLift')}>Add Lift items</button>
                <button className="btn btn-info option-button" style={{marginBottom: '20px'}} onClick={(e) => this.props.handleOptions(e, 'addAll')}>Add All</button>
                <button className="btn btn-danger option-button" style={{marginBottom: '20px'}} onClick={(e) => this.props.handleOptions(e, 'removeAll')}>Remove All</button>
            </div>
        )
    }
}

class SlipDisplay extends Component {
    render(){
        return(
            <table className="table">
                <thead>
                    <tr>
                        <th></th>
                        <th>Barcode</th>
                        <th>Height 
                            <a href="#" style={{padding: '10px'}} onClick={() => this.props.sort('shelf.shelf_number', 'asc')}><FontAwesomeIcon icon="caret-up" /></a> 
                            <a href="#" onClick={() => this.props.sort('shelf.shelf_number', 'desc')}><FontAwesomeIcon icon="caret-down" /></a></th>
                        <th>Title</th>
                        <th>Call Number</th>
                    </tr>  
                </thead>
                <tbody>    
                {Object.keys(this.props.data).map((items, index) => {
                    return(
                    <tr key={index}>
                        <td>
                            <div className="input-group-text">
                                <input type="checkbox" onClick={(e) => this.props.handleChange(e, this.props.data[items], index)}/>
                            </div>
                        </td>
                        <td>{this.props.data[items].barcode}</td> 
                        {this.props.data[items].shelf.shelf_number ?
                            this.props.data[items].shelf.shelf_number >= this.props.settings.liftHeight
                            ? <td className="requires-truck">Requires Lift Truck</td>
                            : <td className="no-truck">Does not require truck</td>
                         : <td></td>  
                        } 
                        <td>{this.props.data[items].title}</td>    
                        <td>{this.props.data[items].call_number}</td>
                    </tr>
                    )
                })}
            </tbody>
           </table>     
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
          <p style={{marginLeft: '20px'}}>Number of items <strong>{this.props.add.length}</strong></p>    
          <form ref={(e) => this.requestForm = e} id="barcode_data" name="barcode_data" className="form-horizontal" onSubmit={(e) => this.handleSubmit(e)}>
          <fieldset>
              <div className='form-group'>
                  <label id="bc" className="col-md-8 control-label">Add to return list</label>
                  <div className="col-lg-10">
                      <textarea ref={(input) => this.barcodes = input} className="form-control" rows="8" id="barcodes" name="barcodes" required></textarea>
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