import React, { Component } from 'react'
import SideBar from './sidebar'
import DisplayComponent from '../util/display'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBox, faStream, faColumns, faChartBar, faBook, faBookOpen, faQuestionCircle, faSchool, faSearch, faPlusCircle, faEdit, faListAlt, faMinusSquare, faPlusSquare } from '@fortawesome/free-solid-svg-icons'
library.add(faBox, faStream, faColumns, faChartBar, faBook, faBookOpen, faQuestionCircle, faSchool, faSearch, faPlusCircle, faEdit, faListAlt, faMinusSquare, faPlusSquare)


export default class Main extends Component {

    state = {
        display: "tray"
    }

    handleDisplayUpdate = (action) => {
        this.setState({display: action})
    }

    render(){
        return(
            <div className="container-fluid">
                <div className="row">
                <SideBar 
                    updateDisplay={this.handleDisplayUpdate}
                />
                <main className="col-sm-9 ml-sm-auto col-md-10 pt-3" role="main">
                        <DisplayComponent 
                            tag={this.state.display} 
                        />
                    </main>
                 </div>         
            </div>
        )
    }
}