window.onload = function () {
    Math.seedrandom(Math.floor(new Date().getTime() / 86400000));
    
    ymaps.ready(function () {
        var url;

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

            return urlParam;
        };

        function getCookie(name) {
            var matches = document.cookie.match(new RegExp(
                "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
            ));
            return matches ? decodeURIComponent(matches[1]) : undefined;
        }

        function deleteCookie(name) {
          setCookie(name, "", {
            expires: -1
          })
        }

        function setCookie(name, value, options) {
          options = options || {};

          var expires = options.expires;

          if (typeof expires == "number" && expires) {
            var d = new Date();
            d.setTime(d.getTime() + expires * 1000);
            expires = options.expires = d;
          }
          if (expires && expires.toUTCString) {
            options.expires = expires.toUTCString();
          }

          value = encodeURIComponent(value);

          var updatedCookie = name + "=" + value;

          for (var propName in options) {
            updatedCookie += "; " + propName;
            var propValue = options[propName];
            if (propValue !== true) {
              updatedCookie += "=" + propValue;
            }
          }

          document.cookie = updatedCookie;
        }

        function success (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            }
            deleteCookie("lat");
            deleteCookie("lng");
            document.cookie = "lat=" + pos.lat;
            document.cookie = "lng=" + pos.lng;
            console.log(document.cookie);
            draw(pos);
        };

        function error () {
            console.log("Navigator geolocation error");
            var pos = {
                lat: 50.46999,
                lng: 30.515630
            }
            deleteCookie("lat");
            deleteCookie("lng");
            document.cookie = "lat=" + pos.lat;
            document.cookie = "lng=" + pos.lng;
            draw(pos);
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
            console.log(getCookie("lat"));

            $.getJSON("https://search-maps.yandex.ru/v1/?text=%D0%93%D0%B4%D0%B5%20%D0%BF%D0%BE%D0%B5%D1%81%D1%82%D1%8C&type=biz&lang=uk_UA&ll=" + pos.lng + "," + pos.lat + "&spn=0.013583%2C0.005685&apikey=" + apiKey, {}, function (data) {
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
            navigator.geolocation.getCurrentPosition(success, error);
        } else {
            var pos = {
                lat: getCookie("lat"),
                lng: getCookie("lng")
            }

            if (pos.lat != undefined && pos.lng != undefined) {
                draw(pos);
            } else {
                error();
            }
        } 
    });
};

