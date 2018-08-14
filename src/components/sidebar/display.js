import React from 'react'

export const Trays = (props) => {
  return(
    <li className="nav-item">
        <a
          className={props.active === 'trays' ? "nav-link active" : "nav-link"}
          href="#"
          onClick={() => props.getDisplay('trays')}>Trays
        </a>
    </li>
  )
}

export const Shelf = (props) => {
  return(
    <li className="nav-item">
        <a className={props.active === 'shelf' ? "nav-link active" : "nav-link"}
        href="#"
        onClick={() => props.getDisplay('shelf')}>Shelf
        </a>
    </li>
  )
}

export const Manage = (props) => {
  return(
  <li className="nav-item">
    {props.active === 'manage'
      ?
      <span>
        <a className="nav-link" href="#" onClick={() => props.getDisplay('manage', 'tray_manage')}>Manage</a>
        <ul className="nav-pills flex-column sub-menu">
          <li className="nav-item">
            <a className={props.subMenu === 'tray_manage' ? "nav-link active" : "nav-link"}
            href="#" onClick={() => props.getDisplay('manage', 'tray_manage')}>Tray</a>
            <a className={props.subMenu === 'shelf_manage' ? "nav-link active" : "nav-link"}
            href="#" onClick={() => props.getDisplay('manage', 'shelf_manage')}>Shelf - Tray Search</a>
            <a className={props.subMenu === 'shelf_manage_shelf' ? "nav-link active" : "nav-link"}
            href="#" onClick={() => props.getDisplay('manage', 'shelf_manage_shelf')}>Shelf - Shelf Search</a>
            <a className={props.subMenu === 'collection_manage' ? "nav-link active" : "nav-link"}
            href="#" onClick={() => props.getDisplay('manage', 'collection_manage')}>Collection</a>
            {/*<a className={props.subMenu === 'transfer' ? "nav-link active" : "nav-link"}
            href="#" onClick={() => props.getDisplay('manage', 'transfer')}>Transfer</a>*/}
          </li>
        </ul>
      </span>
      :
      <a className="nav-link" href="#" onClick={() => props.getDisplay('manage', 'tray_manage')}>Manage</a>
    }
  </li>
  )
}

export const Reports = (props) => {
  return(
    <li className="nav-item">
        <a className={props.active === 'reports' ? "nav-link active" : "nav-link"} href="#" onClick={() => props.getDisplay('reports')}>Reports</a>
    </li>
  )
}

export const Paging = (props) => {
  return(
    <li className="nav-item">
      {props.active === 'paging'
        ?
          <span>
          <a className="nav-link" href="#"
            onClick={() => props.getDisplay('paging', 'paging_search')}>Paging ({props.pagingCount})</a>
          <ul className="nav-pills flex-column sub-menu">
            <li className="nav-item justify-content-between">
              <a className={props.submenu === 'paging_search' ? "nav-link active" : "nav-link"} href="#" onClick={() => props.getDisplay('paging', 'paging_search')}>Paging Search</a>
              <a className={props.submenu === 'paging_display' ? "nav-link active" : "nav-link"} href="#"onClick={() => props.getDisplay('paging', 'paging_display')}>Paging Display ({props.pagingCount})</a>
            </li>
          </ul>
          </span>
        :  <a className="nav-link" href="#"
            onClick={() => props.getDisplay('paging', 'paging_search')}>Paging ({props.pagingCount})</a>
      }
    </li>
  )
}

export const Returns = (props) => {
  return(
    <li className="nav-item">
      {props.active === 'return'
        ?
          <span>
          <a className="nav-link" href="#"
            onClick={() => props.getDisplay('return', 'return_search')}>Return ({props.returnCount})</a>
          <ul className="nav-pills flex-column sub-menu">
            <li className="nav-item justify-content-between">
              <a className={props.submenu === 'return_search' ? "nav-link active" : "nav-link"} href="#" onClick={() => props.getDisplay('return', 'return_search')}>Return Search</a>
              <a className={props.submenu === 'return_display' ? "nav-link active" : "nav-link"} href="#" onClick={() => props.getDisplay('return', 'return_display')}>Return Display ({props.returnCount})</a>
            </li>
          </ul>
          </span>
        :  <a className="nav-link" href="#"
            onClick={() => props.getDisplay('return', 'return_search')}>Return ({props.returnCount})</a>
      }
    </li>
  )
}

export const Search = (props) => {
  return(
    <li className="nav-item">
      {props.active === 'search'
        ?
            <span>
            <a className="nav-link" href="#" onClick={() => props.getDisplay('search', 'single_search')}>Search</a>
            <ul className="nav-pills flex-column sub-menu">
              <li className="nav-item">
                <a className={props.submenu === 'single_search' ? "nav-link active" : "nav-link"} href="#" onClick={() => props.getDisplay('search', 'single_search')}>Single Barcode Search</a>
                <a className={props.submenu === 'tray_search' ? "nav-link active" : "nav-link"}  href="#" onClick={() => props.getDisplay('search', 'tray_search')}>Tray Search</a>
                {/*<a className={props.submenu === 'shelf_search' ? "nav-link active" : "nav-link"} href="#" onClick={() => props.getDisplay('search', 'shelf_search')}>Shelf Search</a>*/}
                <a className={props.submenu === 'title_search' ? "nav-link active" : "nav-link"} href="#" onClick={() => props.getDisplay('search', 'title_search')}>Title Search</a>
                <a className={props.submenu === 'multi_barcode_search' ? "nav-link active" : "nav-link"} href="#" onClick={() => props.getDisplay('search', 'multi_barcode_search')}>Multi Barcode Search</a>
              </li>
            </ul>
            </span>
        : <a className="nav-link" href="#" onClick={() => props.getDisplay('search', 'single_search')}>Search </a>
      }
    </li>
  )
}

export const Request = (props) => {
  return(
    <li className="nav-item">
        <a
          className={props.active === 'request' ? "nav-link active" : "nav-link"}
          href="#"
          onClick={() => props.getDisplay('request')}>Internal Request ({props.internalCount})
        </a>
    </li>
  )
}

export const ILL = (props) => {
  return(
    <li className="nav-item">
        <a
          className={props.active === 'ill' ? "nav-link active" : "nav-link"}
          href="#"
          onClick={() => props.getDisplay('ill')}>ILL Requests
        </a>
    </li>
  )
}