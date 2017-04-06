import React, { Component } from 'react';
import { default as AppComponent } from '../components/';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            position: {},
            venue: {}
        };

        this.getNearestYandexVenues = this.getNearestYandexVenues.bind(this)
    }

    getNearestYandexVenues(position) {
        const apiKey = `7c778ce0-d085-4944-9f47-615d321f860f`;

        return fetch(`https://search-maps.yandex.ru/v1/?apikey=${apiKey}&text=Где поесть&lang=ru-RU&ll=${position.lng},${position.lat}&spn=0.032315,0.011276`)
            .then(res => {
                if (!res.ok || res.status !== 200) {
                    return Promise.reject(res)
                };
                
                return res.json().then(venues => {
                    return {
                        position,
                        venues: venues.features
                    }
                })
            })
    }

    selectVenue(newState) {
        const { venues, position } = newState

        Math.seedrandom(Math.floor(new Date().getTime() / 86400000));
        return Promise.resolve({
            position,
            venue: venues[Math.floor(Math.random() * venues.length)]
        });
    }

    useNavigatorGeo() {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                geo => resolve(processGeoData(geo)), 
                error => reject(error)
            )
        })

        function processGeoData(geo) {
            return {
                lat: geo.coords.latitude.toFixed(5),
                lng: geo.coords.longitude.toFixed(5),
                accuracy: geo.coords.accuracy
            };
        }
    }

    useGoogleGeo() {
        const apiKey = 'AIzaSyAPQiX8tq16C2QoPRJqifTb-zQbQ8EhEzM';

        return fetch(`https://www.googleapis.com/geolocation/v1/geolocate?key=${apiKey}`, {
                method: 'POST'
            })
            .then(res => {
                if (!res.ok) {
                    return Promise.reject(res.statusText)
                }

                return res.json().then(processGeoData);
            })

        function processGeoData(geo) {
            return {
                lat: geo.location.lat.toFixed(5),
                lng: geo.location.lng.toFixed(5),
                accuracy: geo.accuracy
            };
        }
    }

    getHash(hash) {
        let urlParam = {},
            match,
            pl = /\+/g,
            search = /([^&=]+)=?([^&]*)/g,
            decode = s => decodeURIComponent(s.replace(pl, ' ')),
            query = hash.substring(1);

        while (match = search.exec(query)) {
            urlParam[decode(match[1])] = decode(match[2]);
        }

        return urlParam;
    }

    findUserPosition() {
        const position = this.getHash(window.location.hash)

        if (position.hasOwnProperty('lat') && position.hasOwnProperty('lng')) {
            return Promise.resolve(position)
        
        } else {
            return this.useGoogleGeo()
        }
    }

    componentDidMount() {
        this.findUserPosition()
            .then(this.getNearestYandexVenues)
            .then(this.selectVenue)
            .then(newState => {
                const { position } = newState;

                window.history.pushState({}, '', `#lat=${position.lat}&lng=${position.lng}`)
                this.setState(newState)
            })
    }
    
    render() {
        const {
            position,
            venue
        } = this.state

        if (Object.keys(position).length) {
            return (
                <AppComponent 
                    position={position} 
                    venue={venue}
                />
            );
        
        } else {
            return <div />
        }

    }
}

export default App;
