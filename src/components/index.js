import React from 'react';
import './App.css';
import { TextField  } from 'office-ui-fabric-react/lib/TextField';
import getPopupContent from './PopUp'

const App = props => {
    const { position, venue } = props
    const { DG } = window

    const companyMeta = venue.properties.CompanyMetaData;

    DG.then(() => {
        const map = DG.map('map', {
            center: [position.lat, position.lng],
            zoom: 15,
            closePopupOnClick: false
        });

        DG.marker([position.lat, position.lng], {
            label: 'Вы тут. Не узнаете себя?'
        }).addTo(map);

        DG.popup([venue.geometry.coordinates[1], venue.geometry.coordinates[0]])
            .setLatLng([venue.geometry.coordinates[1], venue.geometry.coordinates[0]])
            .setHeaderContent(`<h3>${companyMeta.name}</h3>`)
            .setContent(getPopupContent(venue.properties))
            .openOn(map)
    })

     return (
        <div className="App">
            <div id='map' />
            <div className='infobox'>
                <h1 className='logo ms-font-su'>Yidlo</h1>
                <TextField 
                    value={`${window.location}`}
                    description='Отправьте ссылку, чтобы поделиться с друзьями'
                />
            </div>
        </div>
    ); 
}

export default App;
