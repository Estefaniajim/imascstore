import React from 'react';
import {Map, GoogleApiWrapper} from 'google-maps-react';
import axios from 'axios';

import './Map.scss';

function MapContainer(props) {
    return(
        <div className="Map">
            <Map style= {{
                    width: '100%',
                    height: '80vh'
                    }}
                containerStyle = {{
                    position: 'relative',
                    width: '100%',
                    height: '80vh'
                    }
                }
                google={props.google}
                zoom={14}
                initialCenter={props.location!=null?{lat:props.location.latitude, lng:props.location.longitude}: {lat:0, lng:0}}
                onClick={props.onMapClicked}
            >
                {props.children}
            </Map>
        </div>
    )
}

export default GoogleApiWrapper(
        async (props) => {
            console.log(props);
            try{
                let a = await axios.get(`/mapspoint`).data.key;
                console.log(a);
                return {
                    apiKey: a,
                }
            }
            catch(ex){
                return {
                    apiKey: "",
                }
            }

        }
    )(MapContainer);
