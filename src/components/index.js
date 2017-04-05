import React from 'react';
import './App.css';
import { TextField  } from 'office-ui-fabric-react/lib/TextField';
import PopUp from './PopUp'

const App = props => {
    const { position, venue } = props
    const { DG } = window

    const companyMeta = venue.properties.CompanyMetaData;

    const popUp = DG.popup()
        .setHeaderContent('<h3>' + companyMeta.name + '</h3>')
        .setContent(<PopUp venue={venue} />);

    DG.then(() => {
        const map = DG.map('map', {
            center: [position.lat, position.lng],
            zoom: 15
        });

        DG.marker([position.lat, position.lng])
            .addTo(map).bindPopup('Вы тут. Не узнаете себя?');

        DG.marker([venue.geometry.coordinates[1], venue.geometry.coordinates[0]])
            .addTo(map).bindPopup(popUp)
    })

     return (
        <div className="App">
            <div id='map' />
            <div className='infobox'>
                <h1 className='logo ms-font-su'>Yidlo</h1>
                <TextField 
                    description='Copy link to share with your friends'
                />
            </div>
        </div>
    ); 
}

export default App;
