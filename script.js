window.onload = function() {
    Math.seedrandom(Math.floor(new Date().getTime() / 86400000));

    ymaps.ready(function() {
        var url;

        function parseUrl () {
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

        function success (position) {
            var bounds = position.geoObjects.get(0).properties.get('boundedBy'),
                $container = $('map'),
                mapState = ymaps.util.bounds.getCenterAndZoom(
                    bounds,
                    [$container.width(), $container.height()]
                ),
                pos = {
                    lat: mapState.center[0].toFixed(4),
                    lng: mapState.center[1].toFixed(4)
                };

            Cookies.remove("lat");
            Cookies.remove("lng");
            Cookies.set('lat', pos.lat, { expires: 7 });
            Cookies.set('lng', pos.lng, { expires: 7 });
            draw(pos);
        };

        function takeGeoFromCookies () {
            console.log("Trying to take geo from cookies");
            var pos = {
                    lat: Cookies.get("lat"),
                    lng: Cookies.get("lng")
                }
            
            if (pos.lat != undefined && pos.lng != undefined) {
                draw(pos);
            }
        }

        function draw (pos) {
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

            $("#share").html("<p>Посилання для друзів: http://zonzujiro.github.io/yidlo/" + userPosition);
            window.location = window.location.pathname + userPosition;
            map.controls.add(searchControl);
            map.geoObjects.add(user);

            $.getJSON("https://search-maps.yandex.ru/v1/?text=%D0%93%D0%B4%D0%B5%20%D0%BF%D0%BE%D0%B5%D1%81%D1%82%D1%8C&type=biz&lang=uk_UA&ll=" + pos.lng + "," + pos.lat + "&spn=0.013583%2C0.005685&apikey=" + apiKey, {}, function(data) {
                searchControl.search(data.features[Math.floor(Math.random() * data.features.length)].properties.name);
            });
        }

        url = parseUrl();

        if (url.lat != undefined && url.lng != undefined) {
            console.log("Position in url founded");
            var pos = {
                lat: url.lat,
                lng: url.lng
            }
            draw(pos);
        } else if (navigator.geolocation) {
            console.log("Searching user's geolocation");
            ymaps.geolocation.get().then(success, takeGeoFromCookies);
        } else {
            takeGeoFromCookies();
        }
    });
};
