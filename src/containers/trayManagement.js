import React, { Component } from 'react'
import ContentSearch from '../util/search'
import {getFormattedDate} from '../util/date'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default class TrayManagement extends Component {

    state = {
        loading: false,
        searchResults: {},
        collections: {},
        collapse: false
    }

    componentDidMount(){
        this.collections()
    }
    
    handleTraySearch = async (searchValue) => {
        const search = await ContentSearch.traymanagement(searchValue)
        this.setState({
            searchResults: search,
        })
    }

    collections = async () => {
        const search = await ContentSearch.collections()
        this.setState({ collections: search })
    }

    handleUpdate = (key, data) => {
        const results = this.state.searchResults
        results[key] = data
        this.setState({ results })
    }
    
    //   handleUpdate(key, updated){
    //     const updatedValues = this.state.searchResults;
    //     updatedValues[key] = updated;
    //     fetch(managetrayupdate + 'update/' + updated.id, {
    //         method: 'put',
    //         headers: {
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/json',
    //             'Access-Control-Allow-Origin': '*'
    //         },
    //         body: JSON.stringify(updated)
    //     })
    //     this.setState({
    //         updatedValues
    //     })
    //   }
    
    handleDelete = (key, id, index) =>{
        this.setState((prevState) => ({
          searchResults: prevState.searchResults.filter((_, i) => i != index)
        }));
    }

    updateItem = (key, id, index) => {
        console.log(this.state.searchResults[index])
    }

    handleCollapse = () => {
        this.setState(prevState => ({
            collapse: !prevState.collapse
        }));
    }
    
    //   deleteItem(id){
    //     const updated = this.state.searchResults;
    //     fetch(managetrayupdate + 'delete/' + id, {
    //         method: 'delete',
    //         headers: {
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/json',
    //             'Access-Control-Allow-Origin': '*'
    //         },
    //         body: JSON.stringify(updated)
    //     })
    //   }
    
      render(){
          console.log(this.state.searchResults)
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
                  collections={this.state.collections}
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
    
      deleteItem = (key, id, index) => {
        this.props.deleteItem(key, id, index)
      }

      updateItem = (key, id, index) => {
          this.props.updateItem(key, id, index)
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
            <button className="btn btn-danger" onClick={() => {if(confirm('Delete this item?')) {this.deleteItem(key, data.id, index)}}}>Delete</button>
          </td>
          <td>
            <button className="btn btn-primary" onClick={() =>this.updateItem(key, data.id, index)}>Update</button>
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
                <th>Option</th>
                <th>Update</th>
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