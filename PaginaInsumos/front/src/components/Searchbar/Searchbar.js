import React, {useState} from 'react';
import './Searchbar.scss';


function SearchBar(props) {

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState(null);
  const searchButton = ()=>{
    if(props.searchValue===""){
      let current = !open;
      setOpen(current);
      if(current && input){
        input.focus();
      }
    } else {
      // TODO: request a search
      alert(props.searchValue);
    }
  }

  return (
    <div className="SearchBar">
        <div className={open?"search open": "search"}>
            <input type="search" className="browser-default search-box"
              ref={(input) => {setInput(input)}}
              value={props.searchValue}
              onChange={ev=>{props.setSearchValue(ev.target.value)}}/>
            <span className="search-button" onClick={searchButton}>
                <span className="search-icon"></span>
            </span>
        </div>
    </div>
  )
}

export default SearchBar;
