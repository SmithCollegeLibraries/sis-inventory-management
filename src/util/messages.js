import React, { Component } from 'react'

class Messages extends Component {

    success = (message) => {
            return(
                <div className="alert alert-success primary-alert" role="alert">
                    {message}
               </div>
            )
        }

     error = (message, data) => {
        <div className="alert alert-danger primary-alert alert-dismissible fade show" role="alert">
            <button type="button" onClick={() => props.closeAlert()} className="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
            {this.state.alertMessage} {this.state.alertData}
        </div>
     }   
}

const displayMessages = new Messages()
export default displayMessages