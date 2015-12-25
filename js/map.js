window.onload = function() {
    ymaps.ready(function() {
        var url = parseUrl();

        function parseUrl() {
            var urlParam = {},
                match,
                pl = /\+/g,
                search = /([^&=]+)=?([^&]*)/g,
                decode = function(s) { return decodeURIComponent(s.replace(pl, " ")); },
                query = window.location.hash.substring(1);

            while (match = search.exec(query)) {
                urlParam[decode(match[1])] = decode(match[2]);
            }

            return urlParam;
        };

        function success(position) {
            var pos = {
                lat: position.coords.latitude.toFixed(5),
                lng: position.coords.longitude.toFixed(5)
            };

            savePositionToLocalStorage(pos);
            drawMap(pos);
        };

        function getPositionFromLocalStorage() {
            console.log("Trying to take geo from the local storage");
            var pos = {
                lat: localStorage.getItem("lat"),
                lng: localStorage.getItem("lng")
            };

            if (pos.lat != undefined && pos.lng != undefined) {
                drawMap(pos);
            }
        }

        function getPositionFromGoogleGeo() {
            console.log("Trying to find geo with help of Google API");
            $.post("https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyC43aIoS8meiBAY_ADc95dA6p4C1GkZ8WU", {}, function(result) {
                var pos = {
                        lat: result.location.lat,
                        lng: result.location.lng
                    };

                savePositionToLocalStorage(pos);
                drawMap(pos);
            });
        }

        function searchLunch(position) {
            var config = {
                    apiKey: 'H3RYBO0RBLHCPXZRBHFCOWP1WY2KMHD5LCS3R1CSAZJN0CYG',
                    authUrl: 'https://foursquare.com/',
                    apiUrl: 'https://api.foursquare.com/'
                };

            function doAuthRedirect() {
                var redirect = window.location.href.replace(window.location.hash, '');
                var url = config.authUrl + 'oauth2/authenticate?response_type=token&client_id=' + config.apiKey +
                    '&redirect_uri=' + encodeURIComponent(redirect) + '&state=users/self';
                window.location.href = url;
            };

            doAuthRedirect();
            console.log(123);

            var token = url.access_token;

            console.log(token);

            $.getJSON(config.apiUrl + 'v2/venues/explore?ll=' + position.lat + ',' + position.lng + '&oauth_token=' + token + '&v=20140601', {}, function (data) {
                console.log(data);
            })
        }

        function drawMap(pos) {
            var map = new ymaps.Map('map', {
                    center: [pos.lat, pos.lng],
                    zoom: 17,
                    controls: []
                }),
                user = new ymaps.GeoObject({
                    geometry: {
                        type: "Point",
                        coordinates: [pos.lat, pos.lng]
                    }
                }),
                searchControl = new ymaps.control.SearchControl({
                    options: {
                        provider: 'yandex#search'
                    }
                }),
                apiKey = "007d1580-2af8-4055-ac77-d4e07172b230",
                userPosition = "#lat=" + pos.lat + "&lng=" + pos.lng;

            $("#share").html('<p>Посилання друзям: </p><input id="url" type="text" class = "form-control" value="http://zonzujiro.github.io/yidlo' + userPosition + '" readonly="readonly" type="text" id="show" onclick="this.select()">');

            // window.location = window.location.pathname + userPosition;

            map.controls.add(searchControl);
            map.geoObjects.add(user);

            searchLunch(pos);

            // $.getJSON("https://search-maps.yandex.ru/v1/?text=%D0%93%D0%B4%D0%B5%20%D0%BF%D0%BE%D0%B5%D1%81%D1%82%D1%8C&type=biz&lang=uk_UA&ll=" + pos.lng + "," + pos.lat + "&spn=0.013583%2C0.005685&apikey=" + apiKey, {}, function(data) {
            //     Math.seedrandom(Math.floor(new Date().getTime() / 86400000));
            //     searchControl.search(data.features[Math.floor(Math.random() * data.features.length)].properties.name);
            // });
        }

        function savePositionToLocalStorage(pos) {
            localStorage.removeItem("lat");
            localStorage.removeItem("lng");
            localStorage.setItem('lat', pos.lat);
            localStorage.setItem('lng', pos.lng);
        }

        // window.onhashchange = function() {
        //     var url = parseUrl(),
        //         pos = {
        //             lat: url.lat,
        //             lng: url.lng
        //         };

        //     if (pos.lat != undefined && pos.lng != undefined) {
        //         $("#map").html("");
        //         savePositionToLocalStorage(pos);
        //         drawMap(pos);
        //     }
        // }

        if (url.lat != undefined && url.lng != undefined) {
            var pos = {
                    lat: url.lat,
                    lng: url.lng
                };

            console.log("Position in url founded");
            savePositionToLocalStorage(pos);
            drawMap(pos);
        } else if (navigator.geolocation) {
            console.log("Searching user's geolocation");
            navigator.geolocation.getCurrentPosition(success, getPositionFromGoogleGeo);
        } else {
            getPositionFromLocalStorage();
            // getPositionFromGoogleGeo();
        }
    });
};