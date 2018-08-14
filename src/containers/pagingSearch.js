import React, { Component } from 'react'
import Load from '../util/load'
import ContentSearch from '../util/search'
import Updates from '../util/updates'
import queryString from 'query-string'
import _ from 'lodash'
const electron = window.require('electron');
const fs = window.require('fs');
const path = window.require('path');
const fileName = 'paging.json';
const dataLocation = path.resolve(__dirname, '..','data', fileName);

export default class PagingSearch extends Component {

    state = {
        slips : {},
        searchObject: {},
        pick: {},
        loading: false
    }

    componentDidMount(){
        const results = Load.loadFromFile(dataLocation)
        this.setState({
            pick: results
        })
    }

    getPagingSlips = async (day) => {
        const search = await ContentSearch.pagingSlips(day)
        const data = this.state.pick
        data['items'] = search
        this.setState({data}, () => 
            this.order()
        )
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

    addPick = (key, update) => {
        const data = this.state.pick
        data['items'] = update
        this.setState({
          update
        }, () => {
            this.order()
            // this.props.addPaging(this.props.pagingCount + 1)
        })
      }

    getRecords = async () => {
        const data = this.state.slips
        const search = await ContentSearch.recordData(queryString.stringify(this.state.searchObject))
        this.setState({ slips: search })
    }

    order(){
        const list = this.state.pick['items']
        const item = _.orderBy(list,
          ['shelf.row', 'shelf.ladder', 'shelf.shelf_number'],
          ['asc', 'asc', 'asc']);
        const data = {
            'items': item
        } 
        this.setState({ pick: data}, () => { Updates.writeToFile(dataLocation, this.state.pick) })
      }

    render(){
        return(
          <div>
          {this.state.loading
            ? <div className="loading">Loading&#8230;</div>
            : ''
          }
            <span>
            <div className="row">
              <div className="col-md-3 bg-light form-wrapper">
                <RequestForm
                  addItems={this.addSlips}
                  getPagingSlips={this.getPagingSlips}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-8 content-wrapper">
                <PagingDisplay
                  data={this.state.slips}
                  slips={this.state.pick}
                  add={this.addPick}
                />
              </div>
            </div>
            </span>
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
    }
    
    getPagingSlips = (e, day) => {
        e.preventDefault();
        this.props.getPagingSlips(day)
    }
    
    render(){
        return(
          <div>
          <form id="barcode_data" name="barcode_data" className="form-horizontal" onSubmit={(e) => this.handleSubmit(e)}>
          <fieldset>
              <div className='form-group'>
                  <label id="bc" className="col-md-8 control-label">Paging Slips</label>
                  <div className="col-lg-10">
                      <textarea ref={(input) => this.barcodes = input} className="form-control" rows="15" id="barcodes" name="barcodes" required></textarea>
                      <div className="help-block with-errors"></div>
                  </div>
              </div>
          </fieldset>
          <div className="form-group">
              <div className="col-lg-10 col-lg-offset-2">
                  <button id="submit" type="submit" className="btn btn-primary">Submit</button>
                  <br />
                  <button className="btn btn-success slips-button" onClick={(e) => this.getPagingSlips(e, 'morning')}>Morning Slips</button>
                  <br />
                  <button className="btn btn-success slips-button" onClick={(e) => this.getPagingSlips(e, 'evening')}>Evening Slips</button>
              </div>
          </div>
          </form>
          </div>
        )
      }
}


class PagingDisplay extends Component {
        
    state = {
        status: 'Add'
    }
    
    add = (key, data) => {
        this.props.add(key, data)
        this.setState({status: "Added"})
    }
    
    renderDisplay = (key) => {
        const data = this.props.data[key];
        return(
          <tr key={key}>
            <td>
                <PagingDisplayButton
                    index={data.id}
                    details={this.props.data[key]}
                    addThis={this.add}
                />
            </td>
            <td>{data.barcode}</td>
            <td>{data.call_number}</td>
            <td>{data.shelf.shelf}</td>
            {data.shelf.shelf_number >= 8
              ? <td className="requires-truck">Requires Lift Truck</td>
              : <td className="no-truck">Does not require truck</td>
            }
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
              <th>Add</th>
              <th>Barcode</th>
              <th>Call Number</th>
              <th>Shelf</th>
              <th>Height</th>
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


class PagingDisplayButton extends Component {
    state = {
          status : "Add"
    }

    handleClick = () => {
        const { details, index } = this.props;
        this.setState({status: "Added"})
        this.props.addThis(index, details);
    }

    render(){
        const { details, index} = this.props;
        return(
            <button type="button" key={details.id} className="btn btn-info" onClick={() => this.handleClick()}>
                {this.state.status}
            </button>
        );
    }
}
