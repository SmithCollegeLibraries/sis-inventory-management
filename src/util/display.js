import React, { Component } from 'react'
import Welcome from '../containers/welcome'
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
import History from '../containers/history'

class DisplayComponents extends Component {
    components = {
        welcome: Welcome,
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
        pagingDisplay: PagingDisplay,
        history: History
    };
    render() {
       const TagName = this.components[this.props.tag || 'welcome'];
       return <TagName 
                    display={this.props.tag}
                    updateDisplay={this.props.updateDisplay}
                    settings={this.props.settings}
                    collections={this.props.collections}
                    updateCollections={this.props.updateCollections}
                />
    }
}
export default DisplayComponents;