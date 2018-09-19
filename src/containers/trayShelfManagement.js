import React, { Component } from 'react'
import Load from '../util/load'
import ContentSearch from '../util/search'
import Alerts from '../components/alerts'
import {getFormattedDate} from '../util/date'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default class TrayShelfManagement extends Component {
    state = {
      loading: false,
      formValues : {
        id: '',
        boxbarcode: '',
        shelf: '',
        shelf_depth: '',
        shelf_position: '',
        added: '',
        timestamp: ''
      }
    }

  handleShelfSearch = async (value) => {
    this.setState({loading: true})
    const search = await ContentSearch.trayShelfSearch(value)
    this.setState({
        formValues: {
            id: search.id,
            boxbarcode: search.boxbarcode,
            shelf: search.shelf,
            shelf_depth: search.shelf_depth,
            shelf_position: search.shelf_position,
            added: search.added,
            timestamp: search.timestamp
        },
        loading: false
    })
  }

handleUpdate = (data) => {
    this.setState({ formValues: data })
}

updateItem = (e, id) => {
    e.preventDefault()
    const results = Load.updateShelf(this.state.formValues, id)
    Alerts.success('Shelf updated successfully')
  }

  handleDelete = (e, key, id, index) =>{
    this.setState((prevState) => ({
      searchResults: prevState.searchResults.filter((_, i) => i != index)
    }), async () => {
      const results = await Load.deleteShelf(this.state.searchResults, id)
      Alerts.success('Tray item was deleted succesfully')
  })
}


  render(){
    return(
      <div>
        <div className="row">
          <div className="col-md-3 bg-light form-wrapper">
            <ShelfSearch
              handleShelfSearch={this.handleShelfSearch}
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
            <ShelfEdit
                  data={this.state.formValues}
                  collections={this.state.collections}
                  handleUpdate={this.handleUpdate}
                  updateItem={this.updateItem}
                  handleDelete={this.handleDelete}
            />
          </div>
        </div>
      </div>
    )
  }
}


class ShelfSearch extends Component {

    handleSearch = (e) => {
        e.preventDefault();
        this.props.handleShelfSearch(this.shelf.value.trim())
    }
  
  
    render(){
      return(
        <form id="search_shelf" name="search_shelf"
              onSubmit={(e) => this.handleSearch(e)}>
            <fieldset>
                <div className="form-group">
                    <label>Shelf search by tray barcode</label>
                        <input ref={(input) => this.shelf = input} className="form-control" id="shelf"
                               name="shelf"/>
                </div>
            </fieldset>
            <button id="submit" type="submit" className="btn btn-primary">Search</button>
        </form>
      )
    }
  }


  class ShelfEdit extends Component {


    handleChange = (e) => {
        const values = {
          ...this.props.data,
          [e.currentTarget.name]: e.currentTarget.value,
          timestamp: getFormattedDate()
        }

        this.props.handleUpdate(values)
    }

    render(){
        const data = this.props.data || {}
        let options = []
        for(let i = 1; i <= 10; i++){
          options.push(<option key={i} value={i}>{i}</option>)
        }
      return(
        <div className="card">
          <div className="card-body">
            <dl className="row">
              <dt className="col-sm-3">Id</dt>
              <dd className="col-sm-9">
                <input className="form-control" disabled 
                  value={data.id}
                  name="id" 
                  placeholder="ID"
                  onChange={(e) => this.handleChange(e)}/>
              </dd>            
              <dt className="col-sm-3">Tray Barcode</dt>
              <dd className="col-sm-9">
                <input className="form-control" 
                  value={data.boxbarcode}
                  name="boxbarcode" 
                  placeholder="Box Barcode"
                  onChange={(e) => this.handleChange(e)}/>
              </dd>
              <dt className="col-sm-3">Shelf</dt>
              <dd className="col-sm-9">
                <input className="form-control" 
                  value={data.shelf}
                  name="shelf" placeholder="Shelf"
                  onChange={(e) => this.handleChange(e)}/>
              </dd>
              <dt className="col-sm-3">Depth</dt>
              <dd className="col-sm-9">
                <select className="form-control" value={data.shelf_depth}
                  onChange={(e) => this.handleChange(e)} name="shelf_depth">
                  <option value="Front">Front</option>
                  <option value="Middle">Middle</option>
                  <option value="Rear">Rear</option>
                </select>
              </dd>
              <dt className="col-sm-3">Position</dt>
              <dd className="col-sm-9">
                <select className="form-control" value={data.shelf_position}
                  onChange={(e) => this.handleChange(e)} name="shelf_position">
                    {options}
                </select>
              </dd>
              <dt className="col-sm-3">Added</dt>
              <dd className="col-sm-9">
               <input className="form-control" disabled value={data.added} />
              </dd>
              <dt className="col-sm-3">Updated</dt>
              <dd className="col-sm-9">
               <input className="form-control" disabled value={data.timestamp} />
            </dd>
            <dt className="col-sm-3"></dt>
            <dd className="col-sm-9 d-flex justify-content-end" style={{marginTop: '20px'}}>
            <div className="btn-group" role="group" aria-label="Option buttons">
              <button className="btn btn-primary" style={{marginRight: '10px'}} onClick={(e) => this.props.updateItem(e, data.id)}>Update</button>
              <button className="btn btn-danger" style={{marginRight: '10px'}} onClick={(e) => {if(confirm('Delete this item?')) {this.props.handleDelete(e, data.id)}}}>Delete</button>
            </div>
            </dd>
          </dl>
        </div>
       </div>     
      )
    }
  }