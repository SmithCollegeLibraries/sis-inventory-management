import React, { Component } from 'react'
import Load from '../util/load'
import ContentSearch from '../util/search'
import Alerts from '../components/alerts'
import {getFormattedDate} from '../util/date'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default class TrayManagement extends Component {

    state = {
        loading: false,
        searchResults: {},
        collections: {},
        collapse: false,
    }
    
    handleTraySearch = async (searchValue) => {
        this.setState({ 
          loading: true
        })
        const search = await ContentSearch.traymanagement(searchValue)
        if(search && !search.length){ Alerts.info('No search results found')}
        this.setState({ 
          searchResults: search ? search : {} , 
          loading: false
        })
    }

    handleUpdate = (key, data) => {
        const results = this.state.searchResults
        results[key] = data
        this.setState({ results })
    }

    updateItem = (e, key, id, index) => {
      e.preventDefault()
      const results = Load.updateTrays(this.state.searchResults[index], this.state.searchResults[index].id)
      Alerts.success('Tray updated successfully')
    }
    
    handleDelete = (key, id, index) =>{
        this.setState((prevState) => ({
          searchResults: prevState.searchResults.filter((_, i) => i != index)
        }), async () => {
          const results = await Load.deleteTrays(this.state.searchResults, id)
          Alerts.success('Tray item was deleted succesfully')
      })
    }

    handleCollapse = () => {
        this.setState(prevState => ({
            collapse: !prevState.collapse
        }));
    }  
    
      render(){
        return(
          <div>
            <div className="row">
              <div className={!this.state.collapse ? "col-md-3 bg-light form-wrapper" : "col-md-1 bg-light form-wrapper"}>
                <a href="#" className="d-flex justify-content-end expand" onClick={() => this.handleCollapse()}>{!this.state.collapse ? <FontAwesomeIcon icon="minus-square" /> : <FontAwesomeIcon icon="plus-square" />}</a>
                <TraySearch
                  handleTraySearch={this.handleTraySearch}
                />
              </div>
            }
            </div>
            <div className="row">
            {this.state.loading
              ?
              <div className="loading">Loading&#8230;</div>
              : ''
            }
              <div className={!this.state.collapse ? "col-md-8 content-wrapper" : "col-md-10 content-wrapper"}>
                <TrayEdit
                  data={this.state.searchResults}
                  collections={this.props.collections}
                  handleUpdate={this.handleUpdate}
                  deleteItem={this.handleDelete}
                  updateItem={this.updateItem}
                />
              </div>
            </div>
          </div>
        )
      }
}


class TraySearch extends Component {
    handleSearch = (e) => {
        e.preventDefault();
        this.props.handleTraySearch(this.boxbarcode.value.trim())
    }
  
  
    render(){
      return(
        <form id="search_boxbarcode" name="search_boxbarcode" onSubmit={(e) => this.handleSearch(e)}>
            <fieldset>
                <div className="form-group">
                    <label>Tray Search</label>
                        <input ref={(input) => this.boxbarcode = input} className="form-control"
                               id="box_barcode" name="boxbarcode" placeholder="Tray Search"/>
                </div>
            </fieldset>
            <button id="submit" type="submit" className="btn btn-primary">Search</button>
        </form>
      )
    }
}

class TrayEdit extends Component {
    
      handleChange = (e, key, index) => {
          const values = {
            ...this.props.data[key],
            [e.currentTarget.name]: e.currentTarget.value,
            timestamp: getFormattedDate()
          }
          this.props.handleUpdate(index, values)
      }
    
      deleteItem = (e, key, id, index) => {
        this.props.deleteItem(key, id, index)
      }

      updateItem = (e, key, id, index) => {
          this.props.updateItem(e, key, id, index)
      }
    
      renderDisplay = (key, index) => {
        const data = this.props.data[key]
        const collections = this.props.collections
        return(
        <tr key={key}>
          <td>
            <input className="form-control" disabled value={data.id}
                name="id" placeholder="ID"
                onChange={(e) => this.handleChange(e, key, index)}/>
          </td>
          <td><input className="form-control" value={data.boxbarcode}
                name="boxbarcode" placeholder="Box Barcode"
                onChange={(e) => this.handleChange(e, key, index)}/>
          </td>
          <td><input className="form-control" value={data.barcode}
                name="barcode" placeholder="Barcode"
                onChange={(e) => this.handleChange(e, key, index)}/>
          </td>
          <td>
              <select className="form-control" value={data.stream} onChange={(e) => this.handleChange(e, key, index)} name="stream">
              {
                Object
                .keys(collections)
                .map(function(items, key) {
                  return <option key={key} value={collections[items].name}>{collections[items].name}</option>
                })
              }
              </select>
          </td>
          <td>
            <button className="btn btn-primary" onClick={(e) =>this.updateItem(e, key, data.id, index)}>Update</button>
          </td>  
          <td>
            <button className="btn btn-danger" onClick={(e) => {if(confirm('Delete this item?')) {this.deleteItem(e, key, data.id, index)}}}>Delete</button>
          </td>  
        </tr>
      )
      }
    
      render(){
        return(
            <table className="table table-hover tray-table">
            <thead>
              <tr>
                <th>Id</th>
                <th>Tray Barcode</th>
                <th>Barcodes</th>
                <th>Collection</th>
                <th>Update</th>
                <th>Option</th>
              </tr>
            </thead>
            <tbody>
            {
              Object
              .keys(this.props.data)
              .map(this.renderDisplay)
            }
            </tbody>
          </table>
        )
      }
}