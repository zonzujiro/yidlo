window.onload = function() {
    var elem = document.getElementById("result");
    var apiKey = "007d1580-2af8-4055-ac77-d4e07172b230";

    navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };

        var $container = $('map'),
            bounds = res.geoObjects.get(0).properties.get('boundedBy'),
            mapState = ymaps.util.bounds.getCenterAndZoom(
                bounds, [$container.width(), $container.height()]
            ),
            map = new ymaps.Map('map', {
                center: mapState.center,
                zoom: 16,
                controls: []
            }),
            user = new ymaps.GeoObject({
                geometry: {
                    type: "Point",
                    coordinates: mapState.center
                }
            });

        $.getJSON("https://search-maps.yandex.ru/v1/?text=%D0%93%D0%B4%D0%B5%20%D0%BF%D0%BE%D0%B5%D1%81%D1%82%D1%8C&type=biz&lang=uk_UA&ll=" + mapState.center[1] + "," + mapState.center[0] + "&spn=0.013583%2C0.005685&apikey=" + apiKey, {}, function (data) {
            var lunch = data.features[Math.floor(Math.random() * data.features.length)];
            
            elem.innerHTML = "<h1>" + lunch.properties.name + "</h1>";
            map.geoObjects
                    .add(user)
                    .add(new ymaps.Placemark([lunch.geometry.coordinates[1], lunch.geometry.coordinates[0]], {
                        balloonContent: lunch.properties.name
                    }, {
                        preset: 'islands#circleIcon',
                        iconColor: '#3caa3c'
                    }));
        });
    }, function() {
        console.log("Navigator geolocation error");
    });

    function init() {       
        ymaps.geolocation.get().then(function (res) {
            var $container = $('map'),
                bounds = res.geoObjects.get(0).properties.get('boundedBy'),
                mapState = ymaps.util.bounds.getCenterAndZoom(
                    bounds, [$container.width(), $container.height()]
                ),
                map = new ymaps.Map('map', {
                    center: mapState.center,
                    zoom: 16,
                    controls: []
                }),
                user = new ymaps.GeoObject({
                    geometry: {
                        type: "Point",
                        coordinates: mapState.center
                    }
                });

            $.getJSON("https://search-maps.yandex.ru/v1/?text=%D0%93%D0%B4%D0%B5%20%D0%BF%D0%BE%D0%B5%D1%81%D1%82%D1%8C&type=biz&rspn=1&lang=uk_UA&ll=" + mapState.center[1] + "," + mapState.center[0] + "&spn=0.013583%2C0.005685&apikey=" + apiKey, {}, function (data) {
                if (data.features.length == 0) {
                    elem.innerHTML = "<h1>Вибачь, проте поруч не має навіть вшивого генделя. Йти нікуди.</h1>";
                    return;
                }

                var lunch = data.features[Math.floor(Math.random() * data.features.length)];
                
                elem.innerHTML = "<p>" + lunch.properties.name + "</p>";
                console.log(lunch.properties);
                map.geoObjects
                        .add(user)
                        .add(new ymaps.Placemark([lunch.geometry.coordinates[1], lunch.geometry.coordinates[0]], {
                           balloonContentBody: [
                                '<address>',
                                '<strong>' + lunch.properties.name + '</strong>',
                                '<br/>',
                                'Адрес: '+ lunch.properties.description +';',
                                '<br/>',
                                'Время работы: ' + lunch.properties.CompanyMetaData.Hours.text,
                                '<br/>',
                                'Телефон: ' + lunch.properties.CompanyMetaData.Phones[0].formatted,
                                '</address>'
                            ].join('')
                        }, {
                            preset: 'islands#circleIcon',
                            iconColor: '#3caa3c'
                        }));

            });
        }, function(e) {
            console.log(e);
        });
    }

    Math.seedrandom(Math.floor(new Date().getTime() / 86400000));
    ymaps.ready(init);
};

