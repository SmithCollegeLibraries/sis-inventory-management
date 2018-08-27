import React, { Component } from 'react'

class Messages extends Component {

    response = (message, type) => {
        switch(type){
            case 'success':
                return this.success(message)
            break;
            case 'error':
                return this.error(message)
            break;
            default:
            break;        
        }
    }

    success = (message) => {
            return(
                <div className="alert alert-success primary-alert" role="alert">
                    {message}
               </div>
            )
        }

     error = (message) => {
        return (
            <div className="alert alert-danger primary-alert fade show" role="alert">
                {message}
            </div>
        )
     }   
}

const displayMessages = new Messages()
export default displayMessages