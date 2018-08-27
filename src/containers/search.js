import React, { Component } from 'react'
import ContentSearch from '../util/search'
import Alerts from '../components/alerts'
import queryString from 'query-string'

export default class Search extends Component {

    state = {
        searchResults: {},
        searchObject: {},
        loading: false,
        searchDisplay: 'title'
    }

    handleSearch = async (values) => {
        const item = values.items
        this.setState({ searchResults: {}, loading: true }) 
        let search
        switch(this.state.searchDisplay){
            case 'title':
                search = await ContentSearch.ill('title', item) 
                if(search && !search.length){ Alerts.info('No search results found')}
            break;
            case 'single' : 
                search = await ContentSearch.searchAleph(item)
                if(search && !search.length){ Alerts.info('No search results found')}
            break    
            case 'multi':
                await this.handleMulti(values)
            break
            case 'tray':
                search = await ContentSearch.traySearch(item)
                if(search && !search.length){ Alerts.info('No search results found')}
            break   
            case 'shelf':
                search = await ContentSearch.shelfmanagement(item)
            default:
            break;  
        }
        if(this.state.display !== 'multi'){
        this.setState({
            searchResults: search ? search : {},
            loading: false
        })
    }
    }

    handleMulti = slip => {
        let string = this.state.searchObject
        let slips = Object.keys(slip).map(key => {
            return slip[key]
        });
        let set = slips.join(',')
        console.log(set)
        let update = {...string, 'barcode' : set}
        this.setState({
          searchObject: update
        }, async () => {
          await this.getRecords()
        })
      }
  
      getRecords = async () => {
        this.setState({ loading: true }) 
        const search = await ContentSearch.recordData(queryString.stringify(this.state.searchObject))
        this.setState({
            searchResults: search ? search : {},
            loading: false
        })
      }

      handleDisplay = display => {
          this.setState({
              searchDisplay: display.target.value
          })
      }


    render(){
        console.log(this.state.searchDisplay)
        return(
            <div>
                <div className="row">
                    <div className="col-md-3 bg-light form-wrapper">
                        <SearchForm 
                            handleSearch={this.handleSearch}
                            searchDisplay={this.state.searchDisplay}
                            handleDisplay={this.handleDisplay}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-8 content-wrapper">
                        <SearchDisplay
                            searchResults={this.state.searchResults}
                            loading={this.state.loading}
                        />
                    </div>
                </div>
            </div>
        )
    }
}


class SearchForm extends Component {

    handleSearch = (e) => {
        e.preventDefault()
        const values = {
            items: this.item.value.trim(),
        }
      this.props.handleSearch(values)
    }

    render(){
        const {searchDisplay} = this.props
        return(
            <form onSubmit={(e) => this.handleSearch(e)}>
                 <select className="form-control pickDisplaySort" onChange={(e) => this.props.handleDisplay(e)}>
                    <option value="title">Search Options</option>
                    <option value="single">Barcode (single)</option>
                    <option value="multi">Barcode (multiple)</option>
                    <option value="title">Title</option>
                    <option value="tray">Tray</option>
                 </select>  
                 <br />
                 {searchDisplay === 'title' || searchDisplay === 'tray' || searchDisplay === 'single' || searchDisplay === 'shelf'
                    ?
                    <div className="form-group">
                        <input ref={(input) => this.item = input} className="form-control"/>
                    </div>
                    :
                    <fieldset>
                        <div className="form-group">
                            <textarea ref={(input) => this.item = input} className="form-control" rows="15" id="barcodes" name="barcodes" required></textarea>
                        </div>
                    </fieldset>
                 }    
                <button id="submit" type="submit" className="btn btn-primary">Search</button>
            </form>
        )
    }
}


class SearchDisplay extends Component {


    renderDisplay = (key) => {
        const data = this.props.searchResults[key];
        return(
          <div className="card" key={key}>
           {data.title ?
            <div className="card-body">
             <div className="row card-text">
              <div className="col">
              <dl className="row">
                <dt className="col-sm-3">Title</dt>
                <dd className="col-sm-9">{data.title}</dd>
                <dt className="col-sm-3">Status</dt>
                <dd className="col-sm-9">{data.status}</dd>
                <dt className="col-sm-3">Barcode</dt>
                <dd className="col-sm-9">{data.barcode}</dd>
                <dt className="col-sm-3">Tray Barcode</dt>
                <dd className="col-sm-9">{data.tray_barcode}</dd>
                <dt className="col-sm-3">Shelf Barcode</dt>
                <dd className="col-sm-9">{data.shelf_barcode}</dd>
                <dt className="col-sm-3">Collection</dt>
                <dd className="col-sm-9">{data.stream}</dd>
                <dt className="col-sm-3">Call Number</dt>
                <dd className="col-sm-9">{data.call_number}</dd>
                <dt className="col-sm-3">Description</dt>
                <dd className="col-sm-9">{data.description}</dd>
                <dt className="col-sm-3">Old Location</dt>
                <dd className="col-sm-9">{data.old_location}</dd>
                <dt className="col-sm-3">Last update</dt>
                <dd className="col-sm-9">{data.timestamp}</dd>
              </dl>
              </div>
              </div>
            </div>
            :
            <div className="card-body">
              <p>No Results Found</p>
            </div>
          }
          </div>
        )
    }

    render(){
        const { searchResults } = this.props 
        return(
          <div className="displayContent">
            {this.props.loading
              ?
              <div className="loading">Loading&#8230;</div>
              : ''
            }
            {
                    Object
                        .keys(searchResults)
                        .map(this.renderDisplay) 
                }
          </div>
        )
    }
}