import Load from '../util/load'

const electron = window.require('electron');
const fs = window.require('fs');
const path = window.require('path');
const fileName = 'config.json';
const dataLocation = path.resolve(__dirname, '..','data', fileName);
const items = fs.readFileSync(dataLocation, 'utf8')
let result
try {
   result = JSON.parse(items);
 } catch(error) {
   result = {};
 }

const base = result.serverAddress
export const collections = base + "collection-api/"
export const inserttrays = base + "tray-api/barcode-insert/"
export const insertshelf = base + "shelf-api/shelf-insert/"
export const searchaleph = base + "tray-api/search-barcode/"
export const traysearch  = base + "tray-api/search-tray/"
export const shelfsearch = base + "shelf-api/search-shelf/"
export const shelfsearchall = base + "shelf-api/search-all-shelf/"
export const titlesearch = base + "tray-api/search-title/"
export const oclcsearch = base + "tray-api/search-oclc/"
export const callnumbersearch = base + "tray-api/search-call/"
export const managetray = base + "/tray-api/search-tray-id/"
export const managetrayupdate = base + "tray-api/"
export const shelfmanagement = base + "shelf-api/search-shelf-id/"
export const shelfmanagementupdate = base + "shelf-api/"
export const pagingslips = base + 'tray-api/paging-slips/'
export const internalrequests = base + 'internal-requests/'
export const internalrequestscomments = base + 'internal-requests-comments/'
export const statistics = base + 'statistics/'
export const history = base + 'history/'