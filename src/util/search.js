import { collections, managetray, pagingslips, searchaleph, shelfsearchall, statistics } from '../config/endpoints'

class ContentSearch {

    collections = async () => {
        let search = await this.search(collections)
        return search
    }

    traymanagement = async (value) => {
        let search = await this.search(`${managetray}?query=${value}`)
        return search
    }

    shelfmanagement = async (value) => {
        let search = await this.search(`${shelfsearchall}?query=${value}`)
        return search
    }

    pagingSlips = async (day) => {
        let search = await this.search(`${pagingslips}?day=${day}`)
        return search
    }

    recordData = async (barcodes) => {
        let search = await this.search(`${searchaleph}?${barcodes}`)
        return search
    }

    reports = async (endpoint, query) => {
        let search = await this.search(`${statistics}${endpoint}${query}`)
        return search
    }



    search = async (string) => {
        try {
            let response = await fetch(string);
            return await response.json()
        } catch (e) {
            return(
                console.log(e)
            )
        }
    }


}

const contentSearch= new ContentSearch()
export default contentSearch