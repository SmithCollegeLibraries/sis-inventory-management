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
        'action': 'manage',
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
            },
            'trayShelfManagement' : {
                'display': "Tray/Shelf",
                'action': "trayShelfManagement",
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
        'action': 'paging',
        'display': "Paging",
        'icon': 'book-open',
        'sub' : {
            'addPaging' : {
                'display': 'Add',
                'action' : 'addPaging',
                'icon' : 'check-circle'
            },
            'pagingDisplay' : {
                'display': 'Pick',
                'action': 'pagingDisplay',
                'icon': 'list-alt'
            }
        }
    },
    'returns': {
        'action': 'return',
        'display': "Return",
        'icon': 'book',
        'sub' : {
            'addReturn' : {
                'display': 'Add',
                'action' : 'addReturn',
                'icon' : 'check-circle'
            },
            'returnDisplay' : {
                'display': 'Return',
                'action': 'return',
                'icon': 'list-alt'
            }
        }
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

