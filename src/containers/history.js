import React, { Component } from 'react'
import ContentSearch from '../util/search'
import DatePicker from 'react-datepicker';
import moment from 'moment';
import Alerts from '../components/alerts'

const style = {
    navBarStyle: {
        'backgroundColor': 'fff'
    }
}


export default class History extends Component {

    state = {
        data: {},
        startDate: moment()
    }

    componentDidMount = async () => {
        const response = await ContentSearch.getHistory()
        this.setState({
            data: response
        })
    }

    handleSearch = async (query) => {
        const search = await ContentSearch.searchHistory(query)
        if(search && !search.length){ Alerts.info('No search results found')}
        this.setState({
            data: search ? search : ''
        })
    }
    
    handleChange = (date) => {
        this.setState({
            startDate: date
        }, () => {
            this.handleSearch(date.format('YYYY-MM-DD'))
        })
    }

    handleSubmit = (e) => {
        e.preventDefault()
        this.handleSearch(this.search.value)
    }

    renderDisplay = (key) => {
        const data = this.state.data[key]
        return(
            <tr key={key}>
                <td>{data.action}</td>
                <td>{data.item}</td>
                <td>{data.status_change}</td>
                <td>{data.timestamp}</td>
            </tr>
        )
    }

    render(){
        return(
            <span>
                <nav className="navbar navbar-expand-lg navbar-light bg-light" style={style.navBarStyle}>
                <ul className="navbar-nav mr-auto">
                <li className="nav-item">
                <DatePicker
                    selected={this.state.startDate}
                    onChange={this.handleChange}
                />
                </li>
                </ul>
                <form className="form-inline my-2 my-lg-0" onSubmit={(e) => this.handleSubmit(e)}>
                    <input className="form-control mr-sm-2" ref={(input) => this.search = input} type="search" name="search" placeholder="Search" aria-label="Search"/>
                    <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
                </form>
            </nav>
            <table className="table table-hover tray-table">
                <thead>
                    <tr>
                        <th>Action</th>
                        <th>Item</th>
                        <th>Status Change</th>
                        <th>Timestamp</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(this.state.data).map(this.renderDisplay)}
                </tbody>    
            </table>  
            </span>
        )
    }
}