import { inserttrays, managetrayupdate, shelfmanagementupdate, insertshelf, collections, internalrequests, internalrequestscomments ,history } from '../config/endpoints'
import Alerts from '../components/alerts'
import { getFormattedDate } from '../util/date'

const electron = window.require('electron');
const fs = window.require('fs');
const path = window.require('path');
const fileName = 'config.json';
const dataLocation = path.resolve(__dirname, '..','data', fileName);
const items = fs.readFileSync(dataLocation, 'utf8')

class Load {

    
    loadFromFile = (location) => {
        const items = fs.readFileSync(location, 'utf8')
        let result
        try {
           result = JSON.parse(items);
         } catch(error) {
           result = {};
         }
        return result 
    }

    loadCollections = async (id, data) => {
        const update = await this.handleUpdate(`${collections}update/${id}`, 'PUT', data)
        return update
    }

    createNewCollection = async (data) => {
        const values = {
            name: data
        }
        const historyItems = {
            action: 'created new collection',
            item: data,
            status_change: 'created',
            timestamp: getFormattedDate()
        }
        this.handleUpdate(`${history}create/`, 'POST', historyItems)
        const update = await this.handleUpdate(`${collections}create/`, 'POST', values)
        return update
    }

    updateCollection = async (data, id) => {
        const historyItems = {
            action: 'updated collection',
            item: data,
            status_change: 'updated',
            timestamp: getFormattedDate()
        }
        this.handleUpdate(`${history}create/`, 'POST', historyItems)
        const update = await this.handleUpdate(`${collections}update/${id}`, 'PUT', data)
        return update
    }

    deleteCollection = async (data, id) => {
        console.log(data)
        const historyItems = {
            action: 'deleted collection',
            item: data.name,
            status_change: 'deleted',
            timestamp: getFormattedDate()
        }
        this.handleUpdate(`${history}create/`, 'POST', historyItems)
        this.handleUpdate(`${collections}delete/${id}`, 'DELETE', data)
    }

   insertTrays = async (data) => {
       const historyItems = {
           action: 'inserted new tray',
           item: data.boxbarcode,
           status_change: 'created',
           timestamp: getFormattedDate()
       }
       this.handleUpdate(`${history}create/`, 'POST', historyItems)
       return await this.handleUpdate(inserttrays, 'POST', data)
    }

    updateTrays = async (data, id) => {
        const historyItems = {
            action: 'updated tray',
            item: data.boxbarcode,
            status_change: 'updated',
            timestamp: getFormattedDate()
        }
        this.handleUpdate(`${history}create/`, 'POST', historyItems)
        const update = await this.handleUpdate(`${managetrayupdate}update/${id}`, 'PUT', data)
        return update
    }

    deleteTrays = async (data, id) => {
        const historyItems = {
            action: 'deleted tray',
            item: data.boxbarcode,
            status_change: 'deleted',
            timestamp: getFormattedDate()
        }
        this.handleUpdate(`${history}create/`, 'POST', historyItems)
        const update = await this.handleUpdate(`${managetrayupdate}delete/${id}`, 'DELETE', data)
        return update
    }

    processBarcodes = async (id, barcode, data) => {
        const historyItems = {
            action: 'item status updated',
            item: barcode,
            status_change: data.status,
            timestamp: getFormattedDate()
        }
        this.handleUpdate(`${history}create/`, 'POST', historyItems)
        const update = await this.handleUpdate(`${managetrayupdate}update/${id}`, 'PUT', data)
        return update
    }

    insertShelf = async (data) => {
        const historyItems = {
            action: 'tray added to shelf',
            item: data.shelfbarcode,
            status_change: 'created',
            timestamp: getFormattedDate()
        }
        this.handleUpdate(`${history}create/`, 'POST', historyItems)
        const update = await this.handleUpdate(insertshelf, 'POST', data)
        return update
    }

    updateShelf = async (data, id) => {
        const historyItems = {
            action: 'shelf updated',
            item: data.shelf,
            status_change: 'updated',
            timestamp: getFormattedDate()
        }
        this.handleUpdate(`${history}create/`, 'POST', historyItems)
        const update = await this.handleUpdate(`${shelfmanagementupdate}update/${id}`, 'PUT', data)
        return update
    }

    deleteShelf = async (data, id) => {
        const historyItems = {
            action: 'tray added to shelf',
            item: data.shelfbarcode,
            status_change: 'deleted',
            timestamp: getFormattedDate()
        }
        this.handleUpdate(`${history}create/`, 'POST', historyItems)
        this.handleUpdate(`${shelfmanagementupdate}delete/${id}`, 'DELETE', data)
    }

    insertInternalRequest = async (data) => {
        const historyItems = {
            action: 'internal request created',
            item: data.name,
            status_change: 'created',
            timestamp: getFormattedDate()
        }
        this.handleUpdate(`${history}create/`, 'POST', historyItems)
        const update = this.handleUpdate(`${internalrequests}create/`, 'POST', data)
        return update
    }

    insertInternalRequestComment = async (data) => {
        const historyItems = {
            action: 'internal request comment created',
            item: data.name,
            status_change: 'created',
            timestamp: getFormattedDate()
        }
        this.handleUpdate(`${history}create/`, 'POST', historyItems)
        const update = this.handleUpdate(`${internalrequestscomments}create/`, 'POST', data)
        return update
    }
    
    archiveInternalRequests = async (id) => {
        const values = {
            completed: 'true'
        }
        const historyItems = {
            action: 'internal request archived',
            item: id,
            status_change: 'archived',
            timestamp: getFormattedDate()
        }
        this.handleUpdate(`${history}create/`, 'POST', historyItems)
        const update = this.handleUpdate(`${internalrequests}update/${id}`, 'PUT', values)
        return update
    }

    handleUpdate = async (string, method, data) => {
        const settings = this.loadFromFile(dataLocation)
        try {
            let response = await fetch(`${string}?access-token=${settings.serverToken}`, {
                method: `${method}`,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin':'*'
                },
                body: JSON.stringify(data)
            })
           return this.responseHandling(response)
        } catch(e) {
            this.catchError('', e)
        }
    }


    responseHandling = async response => {
        switch(response.status){
            case 200: 
            case 201:
            case 304:
                return await response.json()
            break;
            case 204:
                return {}
            case 400:
                this.catchError('Bad Request', response.statusText)    
            break;
            case 401:
            case 403:
                this.catchError('Authentication failed', response.statusText)
            break;
            case 404:
                this.catchError("Doesn't exist", response.statusText)
            break;
            case 405: 
                this.catchError('Method not allowed', response.statusText)
            break;
            case 422:
                this.catchError('Data Validation Fail', response.statusText)
            break;
            case 500:
                this.catchError('Internal Server error', response.statusText)
            break;
            default:
                this.catchError('There was an error.  Check your internet connection', '')                      
        }
    }

    catchError = (value, e) => {
        const error = {
            name: value,
            message: e
        }
        Alerts.error(error)
    }
}
const load = new Load()
export default load
