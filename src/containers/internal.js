import React, { Component } from 'react'
import ContentSearch from '../util/search'
import Updates from '../util/updates'
import Load from '../util/load'
import Alerts from '../components/alerts'
import { getFormattedDate } from '../util/date'

export default class Internal extends Component {

    state = {
        display: 'requests',
        data: {},
        archive: {}
    }

    componentDidMount = async () => {
        const search = await ContentSearch.getInternalRequests('false')
        const archive = await ContentSearch.getInternalRequests('true')
        this.setState({
            data: search,
            archive: archive
        })
    }

    handleDisplay = (e, show) => {
        e.preventDefault()
        this.setState({
          display: show
        })
      }

    handleUpdate = (values) => {
        const update = this.state.data
        update[`internal${Date.now()}`] = values
        this.setState({ update}, () => {
            Load.insertInternalRequest(values)
        })
    }

    archiveRequest = (id, key) => {
        this.setState((prevState) => ({
            data: prevState.data.filter((_, i) => i != key)
          }), async () => 
          await Load.archiveInternalRequests(id)
        );
    }

    addComment = (comment, key) => {
        const set = this.state.data[key]
        const commentCheck = 'internalRequestsComments' in set
        if(commentCheck === false){
            set["internalRequestsComments"] = {}
            this.setState({
                set
            }, () => {
                set["internalRequestsComments"][`comment${Date.now()}`] = comment
                this.setState({ set }, () => {
                    console.log(set)
                })
            })
        } else {
        set["internalRequestsComments"][`comment${Date.now()}`] = comment
        this.setState({ set }, () => {set})
        }
        Load.insertInternalRequestComment(comment)
    }

    render(){
        return(
          <div>
            <div className="row">
              <div className="col-md-3 bg-light form-wrapper">
                  <RequestInternalForm
                    data={this.state.data}
                    updateDisplay={this.props.getRequests}
                    handleUpdate={this.handleUpdate}
                  />
              </div>
            </div>
            <div className="row">
              <div className="col-md-8 content-wrapper">
              <ul className="nav nav-tabs">
                <li className="nav-item">
                  <a className={this.state.display === 'requests' ? "nav-link active" : "nav-link"} href="/internalrequests" onClick={(e) => this.handleDisplay(e, 'requests')}>Requests</a>
                </li>
                <li className="nav-item">
                  <a className={this.state.display === 'archive' ? "nav-link active" : "nav-link"}  href="#" onClick={(e) => this.handleDisplay(e, 'archive')}>Archive</a>
                </li>
              </ul>
              {this.state.display === 'requests'
                ?
                <RequestInternalDisplay
                    data={this.state.data}
                    comment={this.state.comment}
                    archiveRequest={this.archiveRequest}
                    addComment={this.addComment}
                    settings={this.props.settings}
                />
                : <RequestInternalArchive
                    data={this.state.archive}
                />
              }
              </div>
            </div>
          </div>
        )
      }
}

class RequestInternalForm extends Component {

      state = {
          title: '',
          call_number: '',
          stream: '',
          tray_barcode: '',
          shelf_barcode: '',
      }

      search = async (e) => {
         const results = await ContentSearch.searchAleph(e.target.value.trim())
         this.setState({
             title: results[0].title,
             call_number: results[0].call_number,
             stream: results[0].stream,
             tray_barcode: results[0].tray_barcode,
             shelf_barcode: results[0].shelf_barcode
         })
      }

      handleSubmit = (e) => {
          e.preventDefault()
          const values = {
              name: this.name.value,
              material: this.material.value,
              barcode: this.barcode.value,
              title: this.title.value,
              call_number: this.call_number.value,
              volume: this.volume.value,
              collection: this.collection.value,
              tray: this.tray.value,
              shelf: this.shelf.value,
              notes: this.notes.value,
              timestamp: getFormattedDate(),
              comment: {}
          }
          this.props.handleUpdate(values)
          this.requestForm.reset()
      }
    
      render(){
        const {data} = this.props
        return(
          <div>
          <form ref={(input) => this.requestForm = input} id="internal_request" name="internal_request" className="form-horizontal" onSubmit={(e) => this.handleSubmit(e)}>
          <div className='form-group'>
              <label className="col-lg-2 control-label">Name</label>
              <div className="col-lg-10">
                  <input 
                    ref={(input) => this.name = input} 
                    className="form-control" 
                    name="name" 
                    required 
                   />
              </div>
          </div>
          <div className="form-group">
            <label className="col-lg-2 control-label">Material</label>
            <div className="col-lg-10">
              <select ref={(input) => this.material = input} className="form-control" name="material">
                  <option value="Periodical">Periodical</option>
                  <option value="Book">Book</option>
                  <option value="VHS">VHS</option>
              </select>
            </div>
          </div>
          <div className='form-group'>
              <label className="col-lg-2 control-label">Barcocde</label>
              <div className="col-lg-10">
                  <input 
                    ref={(input) => this.barcode = input} 
                    onChange={(e) => this.search(e)} 
                    className="form-control" 
                    name="barcode"
                    />
              </div>
          </div>
          <div className='form-group'>
          <label className="col-lg-2 control-label">Title</label>
          <div className="col-lg-10">
              <input 
                ref={(input) => this.title = input} 
                value={this.state.title} 
                onChange={(e) => this.setState({ title: e.target.value })} 
                className="form-control" 
                name="title"
                />
          </div>
      </div>
      <div className='form-group'>
          <label className="col-lg-2 control-label">Call Number</label>
          <div className="col-lg-10">
              <input 
                ref={(input) => this.call_number = input} 
                value={this.state.call_number} 
                onChange={(e) => this.setState({ call_number: e.target.value })}
                className="form-control" 
                name="call_number"
                />
          </div>
      </div>
      <div className='form-group'>
          <label className="col-lg-2 control-label">Volume/Year</label>
          <div className="col-lg-10">
              <input 
                ref={(input) => this.volume = input} 
                className="form-control" 
                name="volume_year"
                />
          </div>
      </div>
      <div className='form-group'>
          <label className="col-lg-2 control-label">Collection</label>
          <div className="col-lg-10">
              <input 
                ref={(input) => this.collection = input} 
                value={this.state.stream} 
                onChange={(e) => this.setState({ stream: e.target.value })}
                className="form-control" 
                name="collection"
                />
          </div>
      </div>
      <div className='form-group'>
          <label className="col-lg-2 control-label">Tray</label>
          <div className="col-lg-10">
              <input 
                ref={(input) => this.tray = input} 
                value={this.state.tray_barcode} 
                onChange={(e) => this.setState({ tray_barcode: e.target.value })}
                className="form-control" 
                name="tray"
                />
          </div>
      </div>
      <div className='form-group'>
          <label className="col-lg-2 control-label">Shelf</label>
          <div className="col-lg-10">
              <input 
                ref={(input) => this.shelf = input} 
                value={this.state.shelf_barcode} 
                onChange={(e) => this.setState({ shelf_barcode: e.target.value })}
                className="form-control" 
                name="shelf"
                />
          </div>
      </div>
      <div className='form-group'>
          <label className="col-lg-2 control-label">Notes</label>
          <div className="col-lg-10">
              <textarea 
                ref={(input) => this.notes = input} 
                className="form-control" 
                name="notes" 
                rows="10">
               </textarea>
          </div>
      </div>
      <div className="form-group">
          <div className="col-lg-10 col-lg-offset-2">
            <button id="submit" type="submit" className="btn btn-primary">Submit</button>
          </div>
      </div>
      </form>
      </div>
        )
      }
}

class RequestInternalDisplay extends Component {

    renderDisplay = (key) => {
        const data = this.props.data[key];
        return(
          <div className="card" key={key}>
            <div className="card-body">
             <div className="row card-text">
              <div className="col">
              <dl className="row">
                <dt className="col-sm-4">Name</dt>
                <dd className="col-sm-7"><strong>{data.name}</strong></dd>
                <dt className="col-sm-4">Material</dt>
                <dd className="col-sm-7">{data.material}</dd>
                <dt className="col-sm-4">Barcode</dt>
                <dd className="col-sm-7">{data.barcode}</dd>
                <dt className="col-sm-4">Tray</dt>
                <dd className="col-sm-7">{data.tray}</dd>
                <dt className="col-sm-4">Shelf</dt>
                <dd className="col-sm-7">{data.shelf}</dd>
              </dl>
              </div>
              <div className="col">
              <dl className="row">
                <dt className="col-sm-4">Title</dt>
                <dd className="col-sm-7">{data.title}</dd>
                <dt className="col-sm-4">Call Number</dt>
                <dd className="col-sm-7">{data.call_number}</dd>
                <dt className="col-sm-4">Volume/Year</dt>
                <dd className="col-sm-7">{data.volume_year}</dd>
                <dt className="col-sm-4">Notes</dt>
                <dd className="col-sm-7">{data.notes}</dd>
              </dl>
              </div>
              </div>
              {data.internalRequestsComments ? 
                Object.keys(data.internalRequestsComments).map((items, index) => {
                    return <p className="alert alert-secondary" key={index}>
                        {data.internalRequestsComments[items].name} : {data.internalRequestsComments[items].comment}
                    </p>
                })
                :  ''
              }
              <button className="btn btn-primary btn option-button" onClick={(e) => this.props.archiveRequest(data.id, key)}>Finished</button>
            </div>
                <Comments
                    handleComment={this.props.addComment}
                    index={key}
                    data={this.props.data[key]}
                    settings={this.props.settings}
                />
          </div>
        )
      }
    
    
      render(){
        const { data } = this.props  
        return(
          <div>
            {
              Object.keys(data).map(this.renderDisplay)
            }
          </div>
        )
      }
}

class Comments extends Component {

    handleSubmit = (e, key) => {
        e.preventDefault()
        const comments = {
            id: '',
            request_id: this.props.data["id"],
            comment: this.comment.value,
            name: this.props.settings["name"],
            timestamp: getFormattedDate()
        }
        this.props.handleComment(comments, key)
        this.commentForm.reset()
    }


    render(){
        const {index} = this.props
        return(
            <form ref={(input) => this.commentForm = input} onSubmit={(e) => this.handleSubmit(e, index)}>
                <div className='form-group'>
                    <label className="col-lg-4 control-label">Add Comment</label>
                        <div className="col-lg-12">
                            <textarea ref={(input) => this.comment = input} className="form-control" name="notes" rows="3"></textarea>
                        </div>
                </div>
                <div className="form-group">
                    <div className="col-lg-12 col-lg-offset-2">
                        <button id="submit" type="submit" className="btn btn-primary">Submit</button>
                    </div>
                </div>
            </form> 
        )
    }
}

class RequestInternalArchive extends Component {

    renderDisplay = (key) => {
        const data = this.props.data[key];
        return(
          <div className="card" key={key}>
            <div className="card-body">
             <div className="row card-text">
              <div className="col">
              <dl className="row">
                <dt className="col-sm-4">Name</dt>
                <dd className="col-sm-7"><strong>{data.name}</strong></dd>
                <dt className="col-sm-4">Material</dt>
                <dd className="col-sm-7">{data.material}</dd>
                <dt className="col-sm-4">Barcode</dt>
                <dd className="col-sm-7">{data.barcode}</dd>
                <dt className="col-sm-4">Tray</dt>
                <dd className="col-sm-7">{data.tray}</dd>
                <dt className="col-sm-4">Shelf</dt>
                <dd className="col-sm-7">{data.shelf}</dd>
              </dl>
              </div>
              <div className="col">
              <dl className="row">
                <dt className="col-sm-4">Title</dt>
                <dd className="col-sm-7">{data.title}</dd>
                <dt className="col-sm-4">Call Number</dt>
                <dd className="col-sm-7">{data.call_number}</dd>
                <dt className="col-sm-4">Volume/Year</dt>
                <dd className="col-sm-7">{data.volume_year}</dd>
                <dt className="col-sm-4">Notes</dt>
                <dd className="col-sm-7">{data.notes}</dd>
              </dl>
              </div>
              </div>
              {data.internalRequestsComments ? 
                Object.keys(data.internalRequestsComments).map((items, index) => {
                    return <p className="alert alert-secondary" key={index}>
                        {data.internalRequestsComments[items].name} : {data.internalRequestsComments[items].comment}
                    </p>
                })
                :  ''
              }
            </div>
          </div>
        )
      }
    
    
      render(){
        const { data } = this.props  
        return(
          <div>
            {
              Object.keys(data).map(this.renderDisplay)
            }
          </div>
        )
      }
}