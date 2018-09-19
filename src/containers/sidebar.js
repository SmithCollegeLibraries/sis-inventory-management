import React, { Component } from 'react'
import {display} from '../config/sidebar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default class Sidebar extends Component {

    state = {
        manage: false
    }

    handleChange = (e, display) => {
        e.preventDefault()
        this.props.updateDisplay(display)
    }

    handleMore = (item) => {
        console.log(item)
        this.setState(prevState => ({
            [item]: !prevState[item]
        }));
    }

    render(){
        console.log(this.props.active)
        return(
            <nav className="col-sm-2 col-md-2 d-none d-md-block bg-dark sidebar">
                <div className="sidebar-sticky">
                {this.props.settings.name ?
                    <ul className="nav flex-column">
                        <li className="nav-item">
                            <a href="#" className="nav-link">Hi, {this.props.settings.name}
                            </a>
                        </li>
                    </ul>
                    : ''
                } 
                <ul className="nav flex-column">
                {
                    Object.keys(display).map(key => 
                        <li className="nav-item" key={key}>
                            <a href="#" className={this.props.active === display[key].action ? "nav-link active" : "nav-link"}
                                onClick={(e) => display[key].sub ? this.handleMore(display[key].action) : this.handleChange(e, display[key].action)}
                            >
                                <span className="icon">
                                    <FontAwesomeIcon icon={display[key].icon} />
                                </span>
                                {display[key].display} 
                                {display[key].display === 'Internal' 
                                    ? <span className="more"><span className="badge badge-light">{this.props.internal}</span></span>
                                    : ''
                                }
                                {display[key].sub 
                                    ? <span className="more" onClick={() => this.handleMore(display[key].action)}><FontAwesomeIcon icon="plus-circle" /></span> 
                                    : ''
                                } 
                            </a>
                            {display[key].sub && this.state[display[key].action] 
                                ? Object.keys(display[key].sub).map(items => 
                                    <a href="#" className="nav-link sub" key={items}  
                                        onClick={(e) => this.handleChange(e, display[key].sub[items].action)}>
                                        <span className="icon"><FontAwesomeIcon icon={display[key].sub[items].icon} /></span>
                                        {display[key].sub[items].display} 
                                    </a>
                                    )
                                : '' 
                            }  
                        </li>
                    )
                }
                </ul>        
                </div>
            </nav>       
        )
    }
}