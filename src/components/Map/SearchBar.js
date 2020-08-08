import React from 'react';

const SearchBar = function (props) {
  return (
    <div className="pm-map-search-wrp" id="pm-map-search-wrp">
      <form id="pm-map-search" onSubmit={props.submitCallback}>
        <span className="pm-map-menu-icon">
          <div id="pm-map-drawer-menu" onClick={props.drawerMenuClickCallBack}>
            <i className="material-icons">menu</i>
          </div>
        </span>
        <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
          <input className="mdl-textfield__input pm-autocomplete" placeholder="Search"
              id="map-search-text" name="map-search-text" aria-controls="map-search-text-helptext" type="text"
          />
        </div>
        <span className="pm-map-search-icon">
          <button className="mdl-button mdl-js-button mdl-button--icon" type="submit">
            <i className="material-icons">search</i>
          </button>
        </span>
      </form>
    </div>
  );
}

export default SearchBar;
