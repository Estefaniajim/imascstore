import React, {useState, useEffect} from 'react';
import './App.css';
import 'materialize-css'
import { Navbar, NavItem, Icon, Table } from 'react-materialize';
import Searchbar from './components/Searchbar/Searchbar';
import Map from './components/Map/Map';
import { geolocated } from "react-geolocated";
import { Marker, InfoWindow } from 'google-maps-react';
import ModalForm from './components/ModalForm';
import axios from 'axios';
import '../node_modules/materialize-css/dist/css/materialize.min.css'



function App(props) {
  const [searchResults, setSearchResults] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedPlace, setSelectedPlace] = useState({});
  const [showingInfoWindow, setShowingInfoWindow] = useState(true);
  const [addStoreModal, setAddStoreModal] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const requestData = (area) => {
    let params = {}
    if (area!=null)
      params = {
        area: area
      }
    axios.get(`/stores`, params)
    .then(res => {
      console.log(res.data)
      setSearchResults(res.data)
    }).catch(ex => {
        console.log(ex);
        setSearchResults([
          {"_id":1, "storeId": 1 , "address" : "direccion 1" , "lat":"20.685950", "long":"-103.377770", "inventory" : {"maskType": [1],"quantity": [20],"price":[5]} },
          {"_id":2, "storeId": 2 , "address" : "direccion 2" , "lat":"20.660874", "long":"-103.350021", "inventory" : {"maskType": [1,5],"quantity": [1,2],"price":[1,2]} },
          {"_id":4, "storeId": 3 , "address" : "direccion 3" , "lat":"20.679046", "long":"-103.371433", "inventory" : {"maskType": [20],"quantity": [100],"price":[200]} },
        ])
    })
  }
  useEffect(()=>{
    requestData();
    setShowingInfoWindow(true);
  }, []);

  const onPlaceClick = (storeId) => {
    if(storeId === -1){
      return (_p, _marker, e) => {
        setSelectedPlace({address:"Your position"});
        setShowingInfoWindow(true);
      }
    }
    return (_p, _marker, e) => {
      const place = stores[storeId+""];
      console.log(place);
      setSelectedPlace(place);
      setShowingInfoWindow(true);
    }
  }

  let userMarker = {};
  if(props.coords){
    userMarker = <Marker title={'Your location'}
            name={'YOU'}
            position={{lat: props.coords.latitude, lng: props.coords.longitude}} onClick={onPlaceClick(-1)}/>;

  }
  else {
    userMarker = <Marker title={'Your location'}
            name={'YOU'}
            position={{lat: 0, lng: 0}} onClick={onPlaceClick(-1)}/>;
  }

  const onMapClicked = (props) => {
    if (showingInfoWindow) {
      setShowingInfoWindow(false);
    }
  };

  const stores = {};
  for(let i = 0; i < searchResults.length; i++){
      const r = searchResults[i];
      if(!stores[r.storeId]){
          stores[r.storeId] = {
              "storeId":  r.storeId,
              "address" : r.address ,
              "lat":r.lat,
              "long":r.long,
              "maskType" : [r.maskType],
              "quantity": [r.quantity],
              "marker": (<Marker key={r.storeId} name={r.address} onClick={onPlaceClick(r.storeId)} position={{lat: r.lat, lng: r.long}}/>)
          }
      }
      else {
          stores[r.storeId].maskType.push(r.maskType);
          stores[r.storeId].quantity.push(r.quantity);
      }
  }

  return (
    <div className="App">
      <Navbar
        className="navbar"
        alignLinks="right"
        brand={<a className="brand-logo" href="#"><img src="/static/imgs/logo.png" style={{height:"6vh"}}/></a>}
        id="mobile-nav"
        menuIcon={<Icon>menu</Icon>}
        options={{
          draggable: true,
          edge: 'left',
          inDuration: 250,
          onCloseEnd: null,
          onCloseStart: null,
          onOpenEnd: null,
          onOpenStart: null,
          outDuration: 200,
          preventScrolling: true
        }}
      >
        <NavItem href="#" onClick={()=>{setAddStoreModal(true)}}>
          Add store
        </NavItem>
      </Navbar>
      <div className="MapContainer">
        <Searchbar setSearchValue={setSearchValue} searchValue={searchValue}/>
        <Map location={props.coords} searchResults={searchResults} stores={stores} onMapClicked={onMapClicked} apiKey={apiKey}>
          {Object.keys(stores).map((k)=>stores[k].marker)}
          {userMarker}
          <InfoWindow position={{lat: selectedPlace.lat, lng: selectedPlace.long}} visible={showingInfoWindow}><div>{selectedPlace.address}</div> </InfoWindow>
        </Map>
      </div>
      <div className="results">
        <Table>
          <thead>
            <tr>
              <th data-field="id">
                Location
              </th>
              <th data-field="name">
                Mask Type
              </th>
              <th data-field="price">
                Qty
              </th>
              <th data-field="price">
                Price
              </th>
            </tr>
          </thead>
          <tbody>
            { searchResults.map((row)=>(
              <tr key={row._id} onClick={onPlaceClick(row.storeId)} className="clickable">
                <td>
                  {row.address}
                </td>
                <td>
                  {row.inventory.maskType.reduce((acc, curr)=> acc+", "+curr)}
                </td>
                <td>
                  {row.inventory.quantity.reduce((acc, curr)=> acc+", "+curr)}
                </td>
                <td>
                  {row.inventory.price.reduce((acc, curr)=> acc+", "+curr)}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

      </div>
      <ModalForm visible={addStoreModal} setVisible={setAddStoreModal}/>
    </div>
  );
}

export default geolocated({
    positionOptions: {
        enableHighAccuracy: false,
    },
    userDecisionTimeout: 5000,
})(App);
