import React, { Component } from 'react'
import ContentSearch from '../util/search'
import {getFormattedDate} from '../util/date'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default class CollectionManagement extends Component {

    state = {
        collections: {}
    }

    componentDidMount(){
        this.collections()
    }

    collections = async () => {
        const search = await ContentSearch.collections()
        this.setState({ collections: search })
    }

    handleDelete = (e, key, id, index) =>{
        e.preventDefault()
        this.setState((prevState) => ({
          collections: prevState.collections.filter((_, i) => i != index)
        }));
    }

    handleChange = (e, key, index) => {
        const values = {
          ...this.state.collections[key],
          [e.currentTarget.name]: e.currentTarget.value,
          timestamp: getFormattedDate()
        }
        const collections = this.state.collections
        collections[index] = values
        this.setState({
            collections
        }, () => {

        })
    }

    updateItem = (e, key, id, index) => {
        e.preventDefault()
        console.log(this.state.collections[index])
    }

    handleSubmit = (e) => {
        e.preventDefault()
        const idValue = this.state.collections[this.state.collections.length - 1]
        const values = [{
            id: idValue.id + 1,
            name: this.collection.value
        }]

        let update = {...this.state.collections, ...values}
        this.setState({collections: update}, () => {console.log(this.state.collections)})
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

    renderDisplay = (key, index) => {
        const data = this.state.collections[key]
        return(
          <div className="form-row align-items-center collection-management" key={key}>
            <div className="col-md-8">
              <input type="text" className="form-control" id="collection"
                value={data.name}  placeholder="Edit Collection" name="name"
                onChange={(e) => this.handleChange(e, key, index)}
                />
            </div>
            <div className="col-md-4">
                <button className="btn btn-primary option-button" onClick={(e) =>this.updateItem(e, key, data.id, index)}>Update</button>
                <button className="btn btn-danger option-button"
                onClick={() => {if(confirm('Delete this item?')) {this.handleDelete(e, key, data.id, index)}}}>Delete</button>
            </div>
          </div>
        )
      }
    
      render(){
        return(
          <div>
            <div className="row">
              <div className="col-md-10 form-wrapper">
                <form onSubmit={(e) => this.handleSubmit(e)}>
                  <div className="form-row align-items-center">
                    <div className="col-md-8">
                      <input name="collection" ref={(input) => this.collection= input} type="text" className='form-control' placeholder="Add New Collection"/>
                    </div>
                    <div className="col-md-2">
                      <button type="submit" className="btn btn-primary">Submit</button>
                    </div>
                  </div>
                </form>
                <form>
    
                  {
                    Object
                      .keys(this.state.collections)
                      .map(this.renderDisplay)
                  }
                </form>
              </div>
            </div>
          </div>
        )
      }
}