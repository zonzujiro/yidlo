window.onload = function() {
    ymaps.ready(function() {
        var map, url = parseUrl();

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
        };

        function searchUserPosition() {
            var search = [
                new Promise(function(resolve, reject) {
                    function succes(result) {
                        var position = {
                                lat: result.coords.latitude.toFixed(5),
                                lng: result.coords.longitude.toFixed(5),
                                accuracy: result.coords.accuracy
                            };

                        resolve(position);
                    };

                    function error(error) {
                        console.error(error);
                        resolve(undefined);
                    };

                    navigator.geolocation.getCurrentPosition(succes, error);
                }),
                new Promise(function(resolve, reject) {
                    $.post("https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyC43aIoS8meiBAY_ADc95dA6p4C1GkZ8WU", {}, function(result) {
                        var position = {
                                lat: result.location.lat.toFixed(5),
                                lng: result.location.lng.toFixed(5),
                                accuracy: result.accuracy
                            };

                        resolve(position);
                    });
                })
            ];

            Promise.all(search).then(function(location) {
                var choosedPosition,
                    navigatorPosition = location[0],
                    googlePosition = location[1];

                if (navigatorPosition == undefined) {
                    choosedPosition = googlePosition;
                } else if (navigatorPosition.accuracy < googlePosition.accuracy) {
                    choosedPosition = navigatorPosition;
                } else {
                    choosedPosition = googlePosition;
                }

                updateCurrentUrl(choosedPosition);
                drawMap(choosedPosition);
                drawPlaceForLunch(choosedPosition);
            }).catch(function(error) {
                console.error(error);
                getPositionFromLocalStorage();
            });
        }

        function getPositionFromLocalStorage() {
            // console.log("Trying to take geo from the local storage");
            var pos = {
                    lat: localStorage.getItem("lat"),
                    lng: localStorage.getItem("lng")
                };

            if (pos.lat != undefined && pos.lng != undefined) {
                updateCurrentUrl(pos);
                drawMap(pos);
                drawPlaceForLunch(pos);
            }
        }

        function drawPlaceForLunch(pos) {
            var BalloonContentLayout = ymaps.templateLayoutFactory.createClass(
                    '<div id="baloon">' +
                        '<div id="header">' +
                            '<h3>$[properties.name]</h3><br />' +
                        '</div>' + 
                        '<div id="photo">' +
                            '<img src="$[properties.photo]"><br />' +
                        '</div>' +
                        '<div id="info"><p>' +
                        // '<img src="{{properties.icon}}"><br />' +
                            '$[properties.category]<br />' +
                            '$[properties.hours]<br />' +
                            '$[properties.price]<br />' +
                            '$[properties.location] $[properties.metro]<br />' +
                            'Рейтинг на Foursquare: $[properties.rating]<br />' +
                            'Расстояние в метрах: $[properties.distance]<br />' +
                            '<a href="$[properties.url]">$[properties.url]</a><br />' +
                        '</p></div>' +
                    '</div>', {

                        build: function() {
                            BalloonContentLayout.superclass.build.call(this);
                        },
                    }),
                balloonOptions = {
                    balloonContentLayout: BalloonContentLayout,
                    hideIconOnBalloonOpen: false,
                    balloonOffset: [1, -15],
                    preset: "islands#blueCircleDotIcon"
                };

            var client = {
                    id: "client_id=H3RYBO0RBLHCPXZRBHFCOWP1WY2KMHD5LCS3R1CSAZJN0CYG",
                    secret: "client_secret=EGDRPYC3SKAZMJJPU2XODXUEZLFGUFYIB5X3KIEZOSQLTXU1"
                },
                searchPlaceForLunch = new Promise(function (resolve, reject) {
                     $.getJSON('https://api.foursquare.com/v2/venues/explore?ll=' + pos.lat + ',' + pos.lng + '&' + client.id + '&' + client.secret + '&v=20140601&section=food&radius=1000&openNow=1&price=1,2&venuePhotos=1', {}, function(data) {
                        if (!data.response.totalResults) {
                            reject();
                        } else {
                            Math.seedrandom(Math.floor(new Date().getTime() / 86400000));
                            var venue = data.response.groups[0].items[Math.floor(Math.random() * data.response.groups[0].items.length)].venue;
                            resolve(venue);
                        }
                    });
                });

                searchPlaceForLunch.then(function (venue) {
                    var lunch,
                        contentOptions = {
                            hours: venue.hours.status,
                            icon: venue.categories[0].icon.prefix + "bg_44" + venue.categories[0].icon.suffix,
                            name: venue.name,
                            rating: venue.rating,
                            category: venue.categories[0].name,
                            price: venue.price.message,
                            location: venue.location.address,
                            distance: venue.location.distance,
                            url: venue.url
                        };
                        
                    if (venue.photos.count > 0) {
                        contentOptions.photo = venue.photos.groups[0].items[0].prefix + "150x150" + venue.photos.groups[0].items[0].suffix;
                        lunch = new ymaps.Placemark([venue.location.lat, venue.location.lng], contentOptions, balloonOptions);   
                    } else {
                        lunch = new ymaps.Placemark([venue.location.lat, venue.location.lng], contentOptions, balloonOptions);   
                    }

                    map.geoObjects.add(lunch);
                    lunch.balloon.open();
                }).catch(function() {
                    $.getJSON('https://api.foursquare.com/v2/venues/explore?ll=' + pos.lat + ',' + pos.lng + '&' + client.id + '&' + client.secret + '&v=20140601&section=food&radius=1000&price=1,2&venuePhotos=1', {}, function(data) {
                        Math.seedrandom(Math.floor(new Date().getTime() / 86400000));
                        var lunch,
                            venue = data.response.groups[0].items[Math.floor(Math.random() * data.response.groups[0].items.length)].venue,
                            contentOptions = {
                                icon: venue.categories[0].icon.prefix + "bg_44" + venue.categories[0].icon.suffix,
                                name: venue.name,
                                rating: venue.rating,
                                category: venue.categories[0].name,
                                price: venue.price.message,
                                location: venue.location.address,
                                distance: venue.location.distance,
                                url: venue.url,
                                metro: venue.location.state
                            };
                        
                        if (venue.photos.count > 0) {
                            contentOptions.photo = venue.photos.groups[0].items[0].prefix + "150x150" + venue.photos.groups[0].items[0].suffix;
                            lunch = new ymaps.Placemark([venue.location.lat, venue.location.lng], contentOptions, balloonOptions);   
                        } else {
                            lunch = new ymaps.Placemark([venue.location.lat, venue.location.lng], contentOptions, balloonOptions);   
                        }

                        map.geoObjects.add(lunch);
                        lunch.balloon.open();
                    })
                });
        }

        function drawMap(pos) {
            var user = new ymaps.Placemark([pos.lat, pos.lng], {}, {
                    preset: "islands#geolocationIcon"
                });

            map = new ymaps.Map('map', {
                center: [pos.lat, pos.lng],
                zoom: 17,
                controls: ["zoomControl", "fullscreenControl"],
                behaviors: ['default', 'scrollZoom']
            });

            map.geoObjects.add(user);
        }

        function savePositionToLocalStorage(pos) {
            localStorage.removeItem("lat");
            localStorage.removeItem("lng");
            localStorage.setItem('lat', pos.lat);
            localStorage.setItem('lng', pos.lng);
        }

        function updateCurrentUrl(pos) {
            var userPosition = "#lat=" + pos.lat + "&lng=" + pos.lng;

            $("#share").html('<p>Ссылка для друзей: </p><input id="url" type="text" class = "form-control" value="http://zonzujiro.github.io/yidlo' + userPosition + '" readonly="readonly" type="text" id="show" onclick="this.select()">');
            window.location = window.location.pathname + userPosition;
        }

        window.onhashchange = function() {
            var url = parseUrl(),
                pos = {
                    lat: url.lat,
                    lng: url.lng
                };

            if (pos.lat != undefined && pos.lng != undefined) {
                $("#map").html("");
                savePositionToLocalStorage(pos);
                updateCurrentUrl(pos);
                drawMap(pos);
                drawPlaceForLunch(pos);
            };
        }

        if (url.lat != undefined && url.lng != undefined) {
            var pos = {
                    lat: url.lat,
                    lng: url.lng
                };

            // console.log("Position in url founded");
            updateCurrentUrl(pos);
            savePositionToLocalStorage(pos);
            drawMap(pos);
            drawPlaceForLunch(pos);
        } else {
            // console.log("Searching user's geolocation");
            searchUserPosition();
        }
    });
};