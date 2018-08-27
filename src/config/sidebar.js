export const display = {
    "trays": {
        'action': 'tray',
        'display' : 'Trays',
        'icon': 'box'
    },
    "shelf": {
        'action': 'shelf',
        'display': "Shelf",
        'icon': 'stream'
    },
    "manage" : {
        'action': '',
        'display': 'Manage',
        'icon': 'columns',
        'sub' : {
            'trayManagement' : {
                'display': "Tray",
                'action': 'trayManagement',
                'icon': 'edit'
            },
            'shelfyManagement' : {
                'display': "Shelf",
                'action': 'shelfManagement',
                'icon': 'edit'
            },
            'collectionManagement' : {
                'display': "Collection",
                'action': 'collectionManagement',
                'icon': 'edit'
            }
        }
    },
    "reports" : {
        'action': 'report',
        'display': "Reports",
        'icon': 'chart-bar'
    },
    'paging': {
        'action': 'pagingDisplay',
        'display': "Paging",
        'icon': 'book-open',
    },
    'returns': {
        'action': 'return',
        'display': "Return",
        'icon': 'book'
    },
    'internal': {
        'action': 'internal',
        'display': 'Internal',
        'icon': 'question-circle'
    },
    'ill': {
        'action': 'ill',
        'display': 'ILL',
        'icon': 'school'
    },
    'search': {
        'action': 'search',
        'display': 'Search',
        'icon': 'search',
        // 'sub' : {
        //     'singleBarcode' : {
        //         'display': "Single Barcode",
        //         'action' : 'search',
        //         'icon': ''
        //     }, 
        //     'traySearch' : {
        //         'display': "Tray",
        //         'action': 'search',
        //         'icon': ''
        //     },
        //     'titleSearch' : {
        //         'display': "Title",
        //         'action': 'search',
        //         'icon': ''
        //     },
        //     'multiBarcode' : {
        //         'display' : "MultiBarcode",
        //         'action': 'search',
        //         'icon': ''
        //     }
        // }
    },
    'settings' : {
        'action': 'welcome',
        'display': 'Settings',
        'icon': 'cog'
    },
    'history' : {
        'action' : 'history',
        'display': 'History',
        'icon': 'history'
    }
}

