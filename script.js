window.onload = function () {
    var elem = document.getElementById("result");
    var apiKey = "007d1580-2af8-4055-ac77-d4e07172b230";

    Math.seedrandom(Math.floor(new Date().getTime() / 86400000));
    
    ymaps.ready(function () {
        function success (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            }
            drawMap(pos);
        };

        function error () {
            console.log("Navigator geolocation error");
            var pos = {
                lat: 50.46999,
                lng: 30.515630
            }
            drawMap(pos);
        }

        function drawMap (pos) {
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
                    });

            map.controls.add(searchControl);
            map.geoObjects.add(user);

            $.getJSON("https://search-maps.yandex.ru/v1/?text=%D0%93%D0%B4%D0%B5%20%D0%BF%D0%BE%D0%B5%D1%81%D1%82%D1%8C&type=biz&lang=uk_UA&ll=" + pos.lng + "," + pos.lat + "&spn=0.013583%2C0.005685&apikey=" + apiKey, {}, function (data) {
                searchControl.search(data.features[Math.floor(Math.random() * data.features.length)].properties.name);          
            });
        }

        function parseUrl () {
            var urlParam = {},
                match,
                pl     = /\+/g,
                search = /([^&=]+)=?([^&]*)/g,
                decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
                query  = window.location.search.substring(1);

            while (match = search.exec(query)) {
               urlParam[decode(match[1])] = decode(match[2]);
            }

            console.log(urlParam);
        };

        parseUrl();

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(success, error);
        } else {
            error();
        }
    });
};

