import React, { Component } from 'react'
import Tray from '../containers/trays'
import Shelf from '../containers/shelf'
import ILL from '../containers/ill'
import Internal from '../containers/internal'
import Reports from '../containers/reports'
import Return from '../containers/return'
import Search from '../containers/search'
import TrayManagement from '../containers/trayManagement'
import ShelfManagement from '../containers/shelfManagement'
import CollectionManagement from '../containers/collectionManagement'
import PagingDisplay from '../containers/pagingDisplay'

class DisplayComponents extends Component {
    components = {
        tray: Tray,
        shelf: Shelf,
        ill: ILL,
        internal: Internal,
        report: Reports,
        return: Return,
        search: Search,
        trayManagement: TrayManagement,
        shelfManagement: ShelfManagement,
        collectionManagement: CollectionManagement,
        pagingDisplay: PagingDisplay
    };
    render() {
       const TagName = this.components[this.props.tag || 'tray'];
       return <TagName />
    }
}
export default DisplayComponents;