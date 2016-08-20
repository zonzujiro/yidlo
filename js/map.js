var pos = {};
var map, url = parseUrl();
var venue = {};

if (url.lat && url.lng) {
    pos = url;
    getNearestYandexVenues().then(chooseAndDrawVenue);
    window.addEventListener('load', drawMap);

} else {
    searchUser().then(getNearestYandexVenues).then(chooseAndDrawVenue);
    window.addEventListener('hashchange', drawMap);
}

function drawMap() {
    DG.then(function() {
        map = DG.map('map', {
            center: [pos.lat, pos.lng],
            zoom: 14
        });

        var company = venue.properties.CompanyMetaData;

        DG.marker([pos.lat, pos.lng]).addTo(map).bindPopup('Вы тут. Не узнаете себя?');
        console.log(company);
        // DG.marker([venue.geometry.coordinates[1], venue.geometry.coordinates[0]]).addTo(map).bindPopup(venue.properties.name);
        var popUp = DG.popup()
                .setLatLng([venue.geometry.coordinates[1], venue.geometry.coordinates[0]])
                .setHeaderContent('<h4>' + company.name + '</h4>')
                .setContent('<adress class="callout__address">' + venue.properties.description + '</adress>' + 
                    '<div class="callout__phone">' + company.Phones[0].formatted + '</div>' + 
                    '</br>' + 
                    '<div class="callout__workhours">' + company.Hours.text + '</div>')
                .openOn(map);
    });
}

function chooseAndDrawVenue(venues) {
    function createPopup() {


        var popUp = DG.popup()
                .setLatLng([venue.geometry.coordinates[1], venue.geometry.coordinates[0]])
                .setHeaderContent('<h1>' + venue.CompanyMetaData.name + '</h1>')
                .setContent('<adress>' + venue.CompanyMetaData.description + '</adress>');
    }


    Math.seedrandom(Math.floor(new Date().getTime() / 86400000));
    venue = venues[Math.floor(Math.random() * venues.length)];

    // var popup = DG.popup().setCont
}

function getNearestYandexVenues() {
    return new Promise(function(resolve, reject) {
        console.log(pos);
        var url = 'https://search-maps.yandex.ru/v1/?apikey=007d1580-2af8-4055-ac77-d4e07172b230&text=Где поесть&lang=ru-RU&ll=' + pos.lng + ',' + pos.lat + '&spn=0.032315,0.011276';
        var xhr = new XMLHttpRequest();

        xhr.open('GET', url, true);

        xhr.onload = function() {
            var result = JSON.parse(this.response);
            
            if (this.status == 200) {
                resolve(result.features);

            } else {
                var error = new Error(this.statusText);
                error.code = this.status;
                reject(error);
            }
        };

        xhr.onerror = function() {
            reject(new Error("Network Error"));
        };

        xhr.send();
    });
}

function parseUrl() {
    var urlParam = {},
        match,
        pl = /\+/g,
        search = /([^&=]+)=?([^&]*)/g,
        decode = function(s) {
            return decodeURIComponent(s.replace(pl, " "));
        },
        query = window.location.hash.substring(1);

    while (match = search.exec(query)) {
        urlParam[decode(match[1])] = decode(match[2]);
    }

    return urlParam;
}

function searchUser() {
    return Promise.all([useNavigatorGeo(), useGoogleGeo()]).then(processGeoData).catch(function(error) {
        getPositionFromLocalStorage();
        throw new Error(error);
    });
}

function processGeoData(location) {
    var choosedPosition,
        navigatorPosition = location[0],
        googlePosition = location[1];

    if (!navigatorPosition) {
        choosedPosition = googlePosition;
    } else if (navigatorPosition.accuracy < googlePosition.accuracy) {
        choosedPosition = navigatorPosition;
    } else {
        choosedPosition = googlePosition;
    }

    pos = {
        lat: choosedPosition.lat, 
        lng: choosedPosition.lng
    };

    updateUrl();
}

function useNavigatorGeo() {
    return new Promise(function(resolve, reject) {
            function succes(result) {
                var position = {
                        lat: result.coords.latitude.toFixed(5),
                        lng: result.coords.longitude.toFixed(5),
                        accuracy: result.coords.accuracy
                    };

                resolve(position);
            }

            function error(error) {
                console.error(error);
                resolve(undefined);
            }

            navigator.geolocation.getCurrentPosition(succes, error);
        });
}

function useGoogleGeo() {
    return new Promise(
        function(resolve, reject) {
            var url = "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyC43aIoS8meiBAY_ADc95dA6p4C1GkZ8WU";
            var xhr = new XMLHttpRequest();

            xhr.open('POST', url, true);

            xhr.onload = function() {
                var result = JSON.parse(this.response);
                
                if (this.status == 200) {
                    var position = {
                        lat: result.location.lat.toFixed(5),
                        lng: result.location.lng.toFixed(5),
                        accuracy: result.accuracy
                    };
                    resolve(position);

                } else {
                    var error = new Error(this.statusText);
                    error.code = this.status;
                    reject(error);
                }
            };

            xhr.onerror = function() {
                reject(new Error("Network Error"));
            };

            xhr.send();
        });
}

function updateUrl() {
    var userPosition = "#lat=" + pos.lat + "&lng=" + pos.lng;
    var share = document.getElementById('share');
    share.innerHTML = '<p>Ссылка для друзей: </p><input id="url" type="text" class = "form-control" value="http://zonzujiro.github.io/yidlo' + userPosition + '" readonly="readonly" type="text" id="show" onclick="this.select()">';
    window.location = window.location.pathname + userPosition;
}

function getPositionFromLocalStorage() {
    var lat = localStorage.getItem('lat'),
        lng = localStorage.getItem('lng');

    if (lat && lng) {
        pos = {
            lat: lat,
            lng: lng
        };
    }
}
>>>>>>> fca403e4990fa555696df41d2c739b9adecf02e5
