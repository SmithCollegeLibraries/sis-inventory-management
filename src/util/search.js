import { collections, managetray, pagingslips, searchaleph, shelfsearchall, statistics, titlesearch, oclcsearch, callnumbersearch, traysearch, internalrequests, history, shelfmanagement } from '../config/endpoints'
import Load from '../util/load'
import Alerts from '../components/alerts'
const electron = window.require('electron');
const fs = window.require('fs');
const path = window.require('path');
const fileName = 'config.json';
const dataLocation = path.resolve(__dirname, '..','data', fileName);
const items = fs.readFileSync(dataLocation, 'utf8')
const settings = Load.loadFromFile(dataLocation)

class ContentSearch {

    collections = async () => {
        let search = await this.search(`${collections}?access-token=${settings.serverToken}`)
        console.log(search)
        return search
    }

    traymanagement = async (value) => {
        let search = await this.search(`${managetray}?query=${value}&access-token=${settings.serverToken}`)
        return search
    }

    shelfmanagement = async (value) => {
        let search = await this.search(`${shelfsearchall}?query=${value}&access-token=${settings.serverToken}`)
        return search
    }

    traySearch = async (value) => {
        let search = await this.search(`${traysearch}?query=${value}&access-token=${settings.serverToken}`)
        return search
    }

    pagingSlips = async (day) => {
        let search = await this.search(`${pagingslips}?day=${day}&access-token=${settings.serverToken}`)
        return search
    }

    recordData = async (barcodes) => {
        let search = await this.search(`${searchaleph}?${barcodes}&access-token=${settings.serverToken}`)
        return search
    }

    reports = async (endpoint, query) => {
        let search = await this.search(`${statistics}${endpoint}${query}?access-token=${settings.serverToken}`)
        return search
    }

    searchAleph = async (data) => {
        let search = await this.search(`${searchaleph}?barcode=${data}&access-token=${settings.serverToken}`)
        return search
    }

    getInternalRequests = async (completed) => {
        let search = await this.search(`${internalrequests}status?completed=${completed}&access-token=${settings.serverToken}`)
        return search
    }

    trayShelfSearch = async (value) => {
        let search = await this.search(`${shelfmanagement}?query=${value}&access-token=${settings.serverToken}`)
        return search
    }

    ill = async (type, query) => {
        let search = await this.search(`${titlesearch}?query=${query}&access-token=${settings.serverToken}`)
        switch(type){
            case 'title': 
                search = await this.search(`${titlesearch}?query=${query}&access-token=${settings.serverToken}`)
            break;
            case 'oclc':
                search = await this.search(`${oclcsearch}?query=${query}&access-token=${settings.serverToken}`)
            break;
            case 'callnumber':
                search = await this.search(`${callnumbersearch}?query=${query}&access-token=${settings.serverToken}`)    
            break;
            default:
            break;    
        }
        return search
    }

    getHistory = async () => {
        const search = await this.search(`${history}?access-token=${settings.serverToken}`)
        return search
    }

    searchHistory = async query => {
        const search = await this.search(`${history}search?query=${query}&access-token=${settings.serverToken}`)
        return search
    }


    search = async (string) => {
        try {
            let response = await fetch(string);
            return this.responseHandling(response) 
        } catch (e) {
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
                return await this.catchError('Bad Request', response.statusText)    
            break;
            case 401:
            case 403:
                return await this.catchError('Authentication failed', response.statusText)
            break;
            case 404:
                return await this.catchError("Doesn't exist", response.statusText)
            break;
            case 405: 
                return await this.catchError('Method not allowed', response.statusText)
            break;
            case 422:
                return await this.catchError('Data Validation Fail', response.statusText)
            break;
            case 500:
                return await this.catchError('Internal Server error', response.statusText)
            break;
            default:
                return await this.catchError('There was an error.  Check your internet connection', '')                      
        }
    }

    catchError = (value, e) => {
        const error = {
            name: value,
            message: e
        }
        return Alerts.error(error)
    }

}

const contentSearch= new ContentSearch()
export default contentSearch