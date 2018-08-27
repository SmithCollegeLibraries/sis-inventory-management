import React, { Component } from 'react'
import Load from '../util/load'
import Messages from '../util/messages'
import Alerts from '../components/alerts'
import ContentSearch from '../util/search'
import {getFormattedDate} from '../util/date'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default class CollectionManagement extends Component {

    state = {
        collections: {},
        message: false,
    }

    componentDidMount(){
      this.setState({
          collections: this.props.collections
      })
    }

    handleDelete = (e, key, id, index) =>{
        e.preventDefault()
        const values = this.state.collections[key]
        this.setState((prevState) => ({
          collections: prevState.collections.filter((_, i) => i != index)
        }), async () => {
            const results = await Load.deleteCollection(values, id)
            Alerts.success('Collection deleted successfully')
            this.props.updateCollections() 
        });
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
        const results = Load.updateCollection(this.state.collections[index], this.state.collections[index].id)
        Alerts.success('Item updated successfully')
        this.props.updateCollections() 
    }

    handleSubmit = async (e) => {
        e.preventDefault()
        // const values = {
        //   name: this.collection.value
        // }
        // this.setState(prevState => ({
        //   collections: [...prevState.collections, values]
        // }))
        const results = await Load.createNewCollection(this.collection.value)
        Alerts.success('Collection created successfully')
        const search = await ContentSearch.collections()
        this.setState({ collections: search })
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
                onClick={(e) => {if(confirm('Delete this item?')) {this.handleDelete(e, key, data.id, index)}}}>Delete</button>
            </div>
          </div>
        )
      }
    
      render(){
        return(
          <div>
            {this.state.message ? Messages.response(this.state.messageText, this.state.messageType) : ''}
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