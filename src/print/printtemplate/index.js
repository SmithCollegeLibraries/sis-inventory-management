import React, {Component} from 'react'
import Load from '../../util/load'
import { NODATA } from 'dns';
import electron from 'electron'
const fs = window.require('fs');
const path = window.require('path');
const pagingFileName = 'paging.json';
const returnFileName = 'return.json';
const pagingDataLocation = path.resolve(__dirname, '..', '..','data', pagingFileName);
const returnDataLocation = path.resolve(__dirname, '..', '..','data', returnFileName)

export default class Print extends Component {

  state = {
      slips: this.props.slips,
      data: {}
  }

  componentDidMount = () => {
    let results = Load.loadFromFile(pagingDataLocation)
    if(this.props.slips === 'returns'){
        results = Load.loadFromFile(returnDataLocation)
    }
    this.setState({
       data: results
   })
  }

  renderDisplay = (key) => {
      const data = this.state.data[key]
      return (
        <tr key={key}>
          <td>{data.barcode}</td>
          <td>{data.call_number}</td>
          <td>{data.tray_barcode}</td>
          <td>{data.shelf ? data.shelf.row : ''}</td>
          <td>{data.shelf ? data.shelf.side : ''}</td>
          <td>{data.shelf ? data.shelf.ladder: ''}</td>
          <td>{data.shelf ? data.shelf.shelf_number: ''}</td>
          <td>{data.shelf ? data.shelf.shelf_depth : ''}</td>
          <td>{data.shelf ? data.shelf.shelf_position: ''}</td>
          <td>{data.stream}</td>
          <td>{data.old_location}</td>
      </tr>
      )
  }


  render(){
    const data = this.state.data
    return(
      <table className="table table-striped">
        <thead>
        <tr>
          <th>Barcode</th>
          <th>Call Number</th>
          <th>Tray</th>
          <th>Row</th>
          <th>Side</th>
          <th>Ladder</th>
          <th>Shelf</th>
          <th>Depth</th>
          <th>Position</th>
          <th>Collection</th>
          <th>Old Location</th>
        </tr>
        </thead>
        <tbody>
      {
        Object.keys(data).map(this.renderDisplay)
      }
      </tbody>
      </table>
    )
  }
}
