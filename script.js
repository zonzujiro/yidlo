window.onload = function () {
    var elem = document.getElementById("result");
    var apiKey = "007d1580-2af8-4055-ac77-d4e07172b230";
    var pos;

    Math.seedrandom(Math.floor(new Date().getTime() / 86400000));
    
    ymaps.ready(function () {
        var pos;

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

            if (urlParam["pos"] != undefined) {
                pos = urlParam["pos"];
            }
        };

        parseUrl();

        console.log(pos);

        if (pos == undefined) {
            alert(true);
        }

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                }
            }, function() {
                console.log("Navigator geolocation error");
                pos = {
                    lat: 50.46999,
                    lng: 30.515630
                }
            });
        } else {
            pos = {
                lat: 50.46999,
                lng: 30.515630
            }
        }

        
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

        $.getJSON("https://search-maps.yandex.ru/v1/?text=%D0%93%D0%B4%D0%B5%20%D0%BF%D0%BE%D0%B5%D1%81%D1%82%D1%8C&type=biz&lang=uk_UA&ll=" + pos.lng + "," + pos.lat + "&spn=0.013583%2C0.005685&apikey=" + apiKey, {}, function (data) {
            var lunch = data.features[Math.floor(Math.random() * data.features.length)];
            searchControl.search(lunch.properties.name);
            
            // elem.innerHTML = "<p>" + lunch.properties.name + "</p>";
                map.geoObjects
                    .add(user);
        //             .add(new ymaps.Placemark([lunch.geometry.coordinates[1], lunch.geometry.coordinates[0]], {
        //                balloonContentBody: [
        //                     '<address>',
        //                     '<strong>' + lunch.properties.name + '</strong>',
        //                     '<br/>',
        //                     'Адрес: '+ lunch.properties.description +';',
        //                     '<br/>',
        //                     'Время работы: ' + lunch.properties.CompanyMetaData.Hours.text,
        //                     '<br/>',
        //                     'Телефон: ' + lunch.properties.CompanyMetaData.Phones[0].formatted,
        //                     '</address>'
        //                 ].join('')
        //             }, {
        //                 preset: 'islands#circleIcon',
        //                 iconColor: '#3caa3c'
        //             }));
        });
    })
};

