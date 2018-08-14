import React, { Component } from 'react'
import ContentSearch from '../util/search'
import _ from 'lodash'
import { month } from '../config/config'
import { remove_duplicates_es6 } from '../util/helpers'

export default class Reports extends Component {

    state = {
        data: {},
        display: 'daily',
        month: '',
        year: '',
        collection: '',
        reportName: ''
    }

    componentDidMount(){
        this.search('daily-statistics', '')
    }

    search = async (endpoint, query) => {
        const search = await ContentSearch.reports(endpoint, query)
        this.setState({ data: search })
    }

    handleChange = (e) => {
        this.setState({ display: e.currentTarget.value }, (e) => { this.handleInitialDisplaySearch()})
    }

    handleInitialDisplaySearch = () => {
        switch(this.state.display){
            case 'daily': 
                return (this.search('daily-statistics', ''))
            break
            case 'trays':
                this.setState({ reportName: 'Items linked to trays'})
                return (this.search('find-all-items', ''))
            break
            case 'shelf': 
                this.setState({ reportName: 'Trays linked to shelves'})
                return(this.search('find-all-shelf', ''))
            break 
            case 'collections':
                this.setState({ reportName: 'Items in each collection'})
                return(this.search('find-all-collections', ''))   
            break  
            case 'missing':
                this.setState({ reportName: 'Missing Report'})
                return(this.search('missing-report', ''))   
             break     
        }
    }

    filterItems = (e, type) => {
        const value = e.currentTarget.value
        switch(type){
            case 'month':
                this.setState({month: value})
            break
            case 'year': 
                this.setState({year: value}) 
            break
            case 'collection':
                this.setState({collection: value})
            break  
            default:
            break        
        }
    }


    handleDisplay = () => {
        switch(this.state.display){
            case 'daily':
                return ( 
                    <DailyDisplay 
                        data={this.state.data}
                    /> 
                )    
            break
            case 'trays':
            case 'shelf':
                return(
                    <Tray 
                        data={this.state.data}
                        state={this.state}
                        filterItems={this.filterItems}
                        reportName={this.state.reportName}
                    />    
                )
            break; 
            case 'collections':
            return(
                <Collections
                    data={this.state.data}
                    state={this.state}
                    filterItems={this.filterItems}
                    reportName={this.state.reportName}
                />    
            ) 
            case 'missing':
            return (
                <Missing
                    data={this.state.data}
                    state={this.state}
                    filterItems={this.filterItems}
                    reportName={this.state.reportName}
            />     
            )
            default:
                return (
                    <DailyDisplay 
                        data={this.state.data}
                    /> 
                )    
            break    
        }
    }

    render(){
        return(
            <div>
                <div className="row">
                    <div className="col-md-10 form-wrapper">
                        <nav className="navbar fixed-top navbar-light bg-light justify-content-end">
                            <div className="col-md-2">
                            <select className="form-control pickDisplaySort" onChange={(e) => this.handleChange(e)}>
                                <option value="daily">Daily</option>
                                <option value="trays">Trays</option>
                                <option value="shelf">Shelf</option>
                                <option value="collections">Collections</option>
                                <option value="missing">Missing</option>
                            </select>
                            </div>
                        </nav>
                        <div className="slips-display">
                            {this.handleDisplay()}
                        </div>      
                    </div>
                </div>        
            </div>   
        )
    }
}

class DailyDisplay extends Component {

    render(){
        const { data } = this.props || {}
        return(
            <span>
                <h1 className="display-4">Daily report for {data.today}</h1>
                <table className="table table-hover tray-table">
                    <thead className="thead-light">
                        <tr>
                            <th>Type</th>
                            <th>Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Items added to trays</td>
                            <td>{data.items ? data.items[0].count : 0}</td>
                        </tr>
                        <tr>
                            <td>Trays added to shelves</td>
                            <td>{data.shelf ? data.shelf[0].count : 0}</td>
                        </tr>  
                        <tr>
                            <td>Missing Items</td>
                            <td>{data.missing && data.missing[0] ? data.missing[0].count : 0}</td>
                        </tr>    
                    </tbody>
                </table>
                <br />
                <h2>Items checked out of the Annex</h2>
                <table className="table table-hover tray-table">
                    <thead className="thead-light">
                        <tr>
                            <th>Location</th>
                            <th>Count</th>
                         </tr>       
                     </thead> 
                     <tbody>
                            {data.offcampus 
                                ? Object.keys(data.offcampus).map(key => {
                                    return <tr key={key}>
                                        <td>{data.offcampus[key].collection}</td>
                                        <td>{data.offcampus[key].count}</td>
                                   </tr>
                                })
                                : ''
                            }
                      </tbody>     
                </table>   
          </span>
        )
    }
}

class Tray extends Component {

    render(){
        let filteredItems = this.props.data;
        const state = this.props.state;
        const yearAll = Object.keys(this.props.data).map(key => {
            return this.props.data[key].year
        })
        const year = remove_duplicates_es6(yearAll);
        
        ["month", "year"].forEach(filterBy => {
            let filterValue = state[filterBy]
            if(filterValue) {
                filteredItems = filteredItems.filter((item) => {
                    return item[filterBy] ===filterValue
                })
            }
        });
        return(
            <div className="container">
            <h1 className="display-4">{this.props.reportName}</h1>
            <form className="form-inline">
                <div className="input-group-prepend">
                    <span className="input-group-text">Filter options</span>
                </div>
                <select className="custom-select" onChange={(e) => this.props.filterItems(e, 'month')}>
                    <option value="">Month</option>
                    <option value="">All</option>
                    {Object.keys(month).map(key => {
                        return <option value={key} key={key}>{month[key]}</option>
                    })}
                </select>    
                <select className="custom-select"  onChange={(e) => this.props.filterItems(e, 'year')}>
                    <option value="">Year</option>
                    <option value="">All</option>
                    {year.map((date,index) => {
                        return  <option value={date} key={index}>{date}</option>
                    })}
                </select>  
            </form>         
            <table className="table table-hover tray-table">
                <thead>
                    <tr>
                        <th>Month</th>
                        <th>Year</th>
                        <th>Count</th>
                    </tr>
                 </thead>
                <tbody>
                    {Object.keys(filteredItems).map(key => {
                        return (
                            <tr key={key}>
                                <td>{month[filteredItems[key].month]}</td>
                                <td>{filteredItems[key].year}</td>
                                <td>{filteredItems[key].count}</td>
                            </tr>
                        )          
                    })
                    }
                </tbody>
            </table> 
            </div>       
        )
    }
}

class Collections extends Component {

    render(){
        let filteredItems = this.props.data;
        const state = this.props.state;
        
        ["collection"].forEach(filterBy => {
            let filterValue = state[filterBy]
            if(filterValue) {
                filteredItems = filteredItems.filter((item) => {
                    return item[filterBy] ===filterValue
                })
            }
        });
        return(
            <div className="container">
            <h1 className="display-4">{this.props.reportName}</h1>
            <form className="form-inline">
                <div className="input-group-prepend">
                    <span className="input-group-text">Filter options</span>
                </div>
                <select className="custom-select" onChange={(e) => this.props.filterItems(e, 'collection')}>
                    <option value="">Collection</option>
                    <option value="">All</option>
                    {Object.keys(this.props.data).map(key => {
                        return <option value={this.props.data[key].collection} key={key}>{this.props.data[key].collection}</option>
                    })}
                </select>    
            </form>         
            <table className="table table-hover tray-table">
                <thead>
                    <tr>
                        <th>Collection</th>
                        <th>Count</th>
                    </tr>
                 </thead>
                <tbody>
                    {Object.keys(filteredItems).map(key => {
                        return (
                            <tr key={key}>
                                <td>{filteredItems[key].collection}</td>
                                <td>{filteredItems[key].count}</td>
                            </tr>
                        )          
                    })
                    }
                </tbody>
            </table> 
            </div>       
        )
    }
}

class Missing extends Component {
    

    render(){

        let filteredItems = this.props.data;
        const state = this.props.state;

        const collectionAll = Object.keys(this.props.data).map(key => {
            return this.props.data[key].collection
        })
        const collections = remove_duplicates_es6(collectionAll);

        
        ["collection"].forEach(filterBy => {
            let filterValue = state[filterBy]
            if(filterValue) {
                filteredItems = filteredItems.filter((item) => {
                    return item[filterBy] ===filterValue
                })
            }
        });
        return(
            <div className="container">
            <h1 className="display-4">{this.props.reportName}</h1>    
            <form className="form-inline">
                <div className="input-group-prepend">
                    <span className="input-group-text">Filter options</span>
                </div>
                <select className="custom-select" onChange={(e) => this.props.filterItems(e, 'collection')}>
                    <option value="">Collection</option>
                    <option value="">All</option>
                    {collections.map((collection, index) => {
                        return <option value={collection} key={index}>{collection}</option>
                    })}
                </select>    
            </form>       
            <table className="table table-hover tray-table">
                <thead>
                    <tr>
                        <th>id</th>
                        <th>Tray</th>
                        <th>Barcode</th>
                        <th>Collection</th>
                        <th>Status</th>
                        <th>Added</th>
                        <th>Updated</th>
                    </tr>
                 </thead>
                <tbody>
                    {Object.keys(filteredItems).map(key => {
                        return (
                            <tr key={key}>
                                <td>{filteredItems[key].id}</td>
                                <td>{filteredItems[key].boxbarcode}</td>
                                <td>{filteredItems[key].barcode}</td>
                                <td>{filteredItems[key].collection}</td>
                                <td>{filteredItems[key].status}</td>
                                <td>{filteredItems[key].added}</td>
                                <td>{filteredItems[key].timestamp}</td>
                            </tr>
                        )          
                    })
                    }
                </tbody>
            </table> 
            </div>        
        )
    }
}