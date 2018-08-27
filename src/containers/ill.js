import React, {Component} from 'react'
import Load from '../util/load'
import ContentSearch from '../util/search'
import Updates from '../util/updates'
import Messages from '../util/messages'
import excelToJson from 'convert-excel-to-json'
const electron = window.require('electron');
const fs = window.require('fs');
const path = window.require('path');
const fileName = 'ill.json';
const pagingFileName = 'paging.json'
const dataLocation = path.resolve(__dirname, '..','data', fileName);
const pagingLocation =  path.resolve(__dirname, '..','data', pagingFileName);

const {dialog} = require('electron').remote;


export default class ILL extends Component {

    state = {
        requests: {},
        searchResults: {},
        loading: false,
        file: '',
        paging: {},
        processed: false,
        alert: false
    }


  componentDidMount(){
    const searchResults = Load.loadFromFile(dataLocation)
    const paging = Load.loadFromFile(pagingLocation)
    this.setState({
        requests: searchResults,
        paging: paging
    })
  }


  handleSearch = async (type, searchValue) =>  {
    const search = await ContentSearch.ill(type, searchValue) 
    this.setState(prevState => ({
        searchResults:  [...prevState.searchResults, search]
    }), () => {
        console.log(this.state.searchResults)
    })
  }


  getILLRequests = () => {
    const file = this.state.file
    const results = excelToJson({ 
        sourceFile: file[0], 
        sheets: ['PrintQueue'], 
        columnToKey: {
            '*': '{{columnHeader}}'
        }, 
        header: {
            rows: 1
        }
    })
    this.setState({
        requests: results.PrintQueue
    })
  }

  processILL = () => {
      const data = this.state.requests
      Object.keys(data).map(key => {
         return this.handleSearch('oclc', data[key].Transactions_ESPNumber)
      })
      this.setState({
          processed: true
      })
  }


  handleClick = () => { 
    dialog.showOpenDialog({ properties: ["openFile"]},(fileName)  => {
        this.setState({
          file: fileName
        }, () => {
          this.getILLRequests()
        })
    });
  }

  handlePaging = () => {
    Object.keys(this.state.searchResults).map(items => {
        return this.handleUpdate(this.state.searchResults[items])
    })  
    this.updateAlert()
  }


  editOCLC(e, key) {
    const data = this.state.requests[key];
    const update = Object.assign({}, data, {[e.target.name]: e.target.value});
    data[key] = update
    this.setState({
        data
    })
  }

  handleClear = () => {
    this.setState({
      searchResults: {},
      requests: {}
    })
  }

  handleUpdate = (data) => {
    this.setState(prevState => ({
        paging: [...prevState.paging, data],
    }), () => 
        Updates.writeToFile(pagingLocation, this.state.paging,
    ))
  }

  updateAlert = () => {
      this.setState({ alert: true})
      setTimeout(() => {
          this.setState({alert: false })
      }, 3000)
  }

  componentDidUpdate = () => {
    Updates.writeToFile(dataLocation, this.state.requests)
  }


  renderDisplay = (key) => {
    const data = this.state.requests[key]
    return(
      <div className="card" key={key}>
        <div className="card-body">
         <div className="row card-text">
          <div className="col">
          <dl className="row">
            <dt className="col-sm-3">Title</dt>
            <dd className="col-sm-9"><strong>{data.Transactions_LoanTitle}</strong></dd>
            <dt className="col-sm-3">Author</dt>
            <dd className="col-sm-9">{data.Transactions_LoanAuthor}</dd>
            <dt className="col-sm-3">Call Number</dt>
            <dd className="col-sm-9">{data.Transactions_CallNumber}</dd>
            <dt className="col-sm-3">OCLC Number</dt>
            <dd className="col-sm-9">{data.Transactions_ESPNumber}</dd>
          </dl>
          </div>
        </div>
        <button className="btn btn-primary option-button" onClick={() => this.handleSearch('oclc', data.Transactions_ESPNumber)}>OCLC Search</button>
        <button className="btn btn-primary option-button" onClick={() => this.handleSearch('callnumber', data.Transactions_CallNumber)}>Call Number Search</button>
      </div>
      </div>
    )
  }

  renderItems = (key) => {
    const data = this.state.searchResults[key]
    return(
      <div className="card" key={key}>
        <div className="card-body">
         <div className="row card-text">
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
          <dt className="col-sm-3">Tray</dt>
          <dd className="col-sm-9">{data.tray_barcode}</dd>
          <dt className="col-sm-3">Shelf</dt>
          <dd className="col-sm-9">{data.shelf_barcode}</dd>
          </dl>
            <PagingButton 
                details={this.state.searchResults[key]}
                index={key}
                handleUpdate={this.handleUpdate}
            />
          </div>
        </div>
      </div>
      </div>
    )
  }

  render(){
    const data = this.state.requests
    const items = this.state.searchResults
    return(
      <div>
      {this.state.alert 
            ? Messages.success(`${this.state.searchResults.length} items have been added to your paging list`) : ''}
            : ''
      }
      <div className="row">
        <div className="col-md-10 form-wrapper">
          <nav className="navbar fixed-top navbar-light bg-light justify-content-end">
            {this.state.processed 
                ? <button className="btn btn-success option-button" onClick={() => this.handlePaging()}>Add all to paging</button>
                : ''
            }    
            <button className="btn btn-warning option-button" onClick={() => this.processILL()}>Process All</button>
            <button className="btn btn-info option-button" onClick={() => this.handleClick()}>Open File</button>
            <button className="btn btn-danger option-button" onClick={() => this.handleClear()}>Clear</button>
          </nav>
          <div className="row">
            <div className="col">
              <div className="content-wrapper slips-display">
              <br />
              <h1>Spread Sheet Results</h1>
              {
                Object
                  .keys(data)
                  .map(this.renderDisplay)
              }
              </div>
            </div>
            <div className="col">
            <div className="content-wrapper slips-display">
            <br />
            <h1>Paging Data</h1>
              {
                Object
                  .keys(items)
                  .map(this.renderItems)
              }
            </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    )
  }
}


class PagingButton extends Component {

    state = {
        status: "Add to Paging"
    }

    handleClick(){
        const { details, index } = this.props;
        this.setState({status: "Added"})
        this.props.handleUpdate(index, details);
    }

    render(){
        const { details, index } = this.props;
        return(
            <button type="button" key={index} className="btn btn-info" onClick={() => this.handleClick()}>
                {this.state.status}
            </button>        
        )
    }
}
