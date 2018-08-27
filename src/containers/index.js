import React, { Component } from 'react'
import Welcome from './welcome'
import SideBar from './sidebar'
import DisplayComponent from '../util/display'
import ContentSearch from '../util/search'
import Load from '../util/load'
import { settings } from '../config/config'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Alert from 'react-s-alert';
import { faBox, faStream, faColumns, faChartBar, faBook, faBookOpen, faQuestionCircle, faSchool, faSearch, faPlusCircle, faEdit, faListAlt, faMinusSquare, faPlusSquare, faCog, faHistory } from '@fortawesome/free-solid-svg-icons'
library.add(faBox, faStream, faColumns, faChartBar, faBook, faBookOpen, faQuestionCircle, faSchool, faSearch, faPlusCircle, faEdit, faListAlt, faMinusSquare, faPlusSquare, faCog, faHistory)

const electron = window.require('electron');
const fs = window.require('fs');
const path = window.require('path');
const fileName = 'config.json';
const dataLocation = path.resolve(__dirname, '..','data', fileName);

export default class Main extends Component {

    state = {
        display: "welcome",
        settings: {},
        collections: {},
        internal: ''
    }

    componentDidMount = async () => {
         const results = await Load.loadFromFile(dataLocation)

         this.collections()
         let display = 'welcome'
         if(results.welcomeScreen === 'true'){
             display = 'welcome'
         } else {
             display = results.startScreen
         }    
        this.setState({
            display: display,
            settings: results ? results : {},
        }, async () => {
            const internal = await ContentSearch.getInternalRequests('false')
            this.setState({ internal : internal ? internal.length : 0 })
        })
        
    }

    handleDisplayUpdate = (action) => {
        this.setState({display: action})
    }

    update = display => {
        this.setState({
            display: display
        })
    }

    updateCollections = () => {
        this.collections()
    }

    collections = async () => {
        const search = await ContentSearch.collections()
        this.setState({ collections: search })
    }

    render(){
        return(
            <div className="container-fluid">
                <div className="row">
                    <SideBar 
                        updateDisplay={this.handleDisplayUpdate}
                        settings={this.state.settings}
                        internal={this.state.internal}
                        active={this.state.display}
                    />
                    <main className="col-sm-9 ml-sm-auto col-md-10 pt-3" role="main">
                        <DisplayComponent 
                            tag={this.state.display}
                            updateDisplay={this.update}
                            settings={this.state.settings}
                            collections={this.state.collections}
                            updateCollections={this.updateCollections}
                        />
                    </main>
                </div>  
                    <Alert stack={{limit: 3}} />  
            </div>
        )
    }
}