import React, { Component } from 'react'
import ContentSearch from '../util/search'
import Load from '../util/load'
import Alerts from '../components/alerts'
import {getFormattedDate} from '../util/date'
import Messages from '../util/messages'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ReactLoading from 'react-loading';


export default class ShelfManagement extends Component {
    state = {
        loading: false,
        searchResults: {},
        collections: this.props.collections,
        collapse: false,
        updated: false
    }


    handleShelfSearch = async (searchValue) => {
        this.setState({
          loading: true
        })
        const search = await ContentSearch.shelfmanagement(searchValue)
        if(search && !search.length){ Alerts.info('No search results found')}
        this.setState({
            searchResults: search ? search : {},
            loading: false
        })
    }

    handleCollapse = () => {
        this.setState(prevState => ({
            collapse: !prevState.collapse
        }));
    }

    handleUpdate = (key, data) => {
        const results = this.state.searchResults
        results[key] = data
        this.setState({ results })
    }

    updateItem = (e, key, id, index) => {
      e.preventDefault()
      const results = Load.updateShelf(this.state.searchResults[index], this.state.searchResults[index].id)
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
            {this.state.updated ?  Messages.success(`Item was updated`) : ''}
            <div className="row">
            <div className={!this.state.collapse ? "col-md-3 bg-light form-wrapper" : "col-md-1 bg-light form-wrapper"}>
                <a href="#" className="d-flex justify-content-end expand" onClick={() => this.handleCollapse()}>{!this.state.collapse ? <FontAwesomeIcon style={{fontSize: '32px'}}  icon="minus-square" /> : <FontAwesomeIcon style={{fontSize: '32px'}}  icon="plus-square" />}</a>
                <ShelfAllSearch
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
              <div className={!this.state.collapse ? "col-md-8 content-wrapper" : "col-md-10 content-wrapper"}>
                <ShelfAllEdit
                  data={this.state.searchResults}
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


class ShelfAllSearch extends Component {

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
                    <label>Shelf (Example 10R2001)</label>
                        <input ref={(input) => this.shelf = input} className="form-control" id="shelf"
                               name="shelf" placeholder="Shelf search"/>
                </div>
            </fieldset>
            <button id="submit" type="submit" className="btn btn-primary">Search</button>
        </form>
      )
    }
  }


class ShelfAllEdit extends Component {


    handleChange = (e, key, index) => {
        const values = {
          ...this.props.data[key],
          [e.currentTarget.name]: e.currentTarget.value,
          timestamp: getFormattedDate()
        }

        this.props.handleUpdate(index, values)
    }

    updateItem = (key, id, index) => {
        this.props.updateItem(key, id, index)
    }
  
    renderDisplay = (key, index) => {
      const data = this.props.data[key]
      let options = []
      for(let i = 1; i <= 10; i++){
        options.push(<option key={i} value={i}>{i}</option>)
      }
      return(
        <div className="card" key={key}>
          <div className="card-body">
            <dl className="row" key={key}>
              <dt className="col-sm-3">Id</dt>
              <dd className="col-sm-9">
                <input className="form-control" disabled value={data.id}
                  name="id" placeholder="ID"
                  onChange={(e) => this.handleChange(e, key, index)}/>
              </dd>            
              <dt className="col-sm-3">Tray Barcode</dt>
              <dd className="col-sm-9">
                <input className="form-control" value={data.boxbarcode}
                  name="boxbarcode" placeholder="Box Barcode"
                  onChange={(e) => this.handleChange(e, key, index)}/>
              </dd>
              <dt className="col-sm-3">Shelf</dt>
              <dd className="col-sm-9">
                <input className="form-control" value={data.shelf}
                  name="shelf" placeholder="Shelf"
                  onChange={(e) => this.handleChange(e, key, index)}/>
              </dd>
              <dt className="col-sm-3">Depth</dt>
              <dd className="col-sm-9">
                <select className="form-control" value={data.shelf_depth}
                  onChange={(e) => this.handleChange(e, key, index)} name="shelf_depth">
                  <option value="Front">Front</option>
                  <option value="Middle">Middle</option>
                  <option value="Rear">Rear</option>
                </select>
              </dd>
              <dt className="col-sm-3">Position</dt>
              <dd className="col-sm-9">
                <select className="form-control" value={data.shelf_position}
                  onChange={(e) => this.handleChange(e, key, index)} name="shelf_position">
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
              <button className="btn btn-primary" style={{marginRight: '10px'}} onClick={(e) => this.props.updateItem(e, key, data.id, index)}>Update</button>
              <button className="btn btn-danger" style={{marginRight: '10px'}} onClick={(e) => {if(confirm('Delete this item?')) {this.props.handleDelete(e, key, data.id, index)}}}>Delete</button>
            </div>
            </dd>
          </dl>
        </div>
       </div>     
      )
    }
  
  
    render(){
      const data = this.props.data
      return(
        <div>
        {
          Object
          .keys(this.props.data)
          .map(this.renderDisplay)
        }
      </div>
      )
    }
  }