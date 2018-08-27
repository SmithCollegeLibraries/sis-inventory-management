import React, { Component } from 'react'
import Load from '../util/load'
import Updates from '../util/updates'
import ContentSearch from '../util/search'
const electron = window.require('electron');
const fs = window.require('fs');
const path = window.require('path');
const fileName = 'config.json';
const dataLocation = path.resolve(__dirname, '..','data', fileName);

export default class Welcome extends Component {

    state = {
        settings: {},
    }

    componentDidMount = () => {
        const results = Load.loadFromFile(dataLocation)
        this.setState({
            settings: results
        })
    }

    updateConfig = (e) => {
        const config = this.state.settings;
        config[e.target.name] = e.target.value;
        this.setState({ config });
    }

    handleSubmit = e => {
        e.preventDefault()
        const results = Load.createNewCollection(this.collection.value)
    }

    componentDidUpdate = () => {
        Updates.writeToFile(dataLocation, this.state.settings)
    }

    render(){
        return(
            <div className="container">
                <h1 className="display-4 text-center">Welcome to the Smith Inventory Software</h1>
                <h2 className="display-5 text-center">
                    Set up your config file below                     
                </h2>
                <div className="form-group">
                        <form onSubmit={(e) => this.handleSubmit(e)}>
                            <label className="col-lg-10 control-label">Add a collection</label>
                            <div className="col-lg-10">
                                <input ref={(input) => this.collection = input} type="text" className='form-control' placeholder="Add New Collection"/>
                            </div>
                            <br />
                            <div className="col-md-2">
                                <button type="submit" className="btn btn-primary">Submit</button>
                             </div>
                         </form>    
                    </div>
                <div>
                    {Object.keys(this.state.settings).map(key => (
                    <Settings 
                        key={key}
                        index={key}
                        data={this.state.settings}
                        updateConfig={this.updateConfig}
                    />
                    ))}
                    <div className="form-group">
                        <div className="col-md-2">
                            <button className="btn btn-info" onClick={() => this.props.updateDisplay(this.state.settings.startScreen)}>Finish</button>    
                        </div>     
                    </div>    
                </div>   
            </div>    
        )
    }
}

class Settings extends Component {

    render(){
        const {data, index} = this.props
        return(
            <div className="form-group">
                <label className="col-lg-2 control-label">{index}</label>
                <div className="col-lg-10">
                    <input 
                        type="text"
                        className={this.props.data[index] ? "form-control is-valid" : "form-control"} 
                        name={index} 
                        onChange={this.props.updateConfig} 
                        value={this.props.data[index]}
                    />
                </div>
            </div>
        )
    }
}