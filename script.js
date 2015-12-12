window.onload = function () {
    var elem = document.getElementById("result");
    var apiKey = "007d1580-2af8-4055-ac77-d4e07172b230";

    navigator.geolocation.getCurrentPosition(function(data) {
        $.getJSON("https://search-maps.yandex.ru/v1/?text=где%20поесть&type=biz&lang=uk_UA&ll=" + data.coords.latitude + "%2C" + data.coords.longitude + "&sspn=0.06791&apikey=" + apiKey, {}, function (data) {
            console.log(data);
        });
    });

    function init(){
        ymaps.geolocation.get().then(function (res) {
            var $container = $('map'),
                bounds = res.geoObjects.get(0).properties.get('boundedBy'),
                mapState = ymaps.util.bounds.getCenterAndZoom(
                    bounds,
                    [$container.width(), $container.height()]
                ),
                map = new ymaps.Map('map', {
                    center: mapState.center,
                    zoom: 16
                }),
                myGeoObject = new ymaps.GeoObject({
                    geometry: {
                        type: "Point",
                        coordinates: mapState.center
                   }
                });
                
                map.geoObjects.add(myGeoObject);
        }, function (e) {
            console.log(e);
        });
    }

    Math.seedrandom(Math.floor(new Date().getTime() / 86400000));
    elem.innerHTML = "<h1>" + ["Salateira", "McDonalds", "Wokkery", "Пелотка", "Пузата Хата"][Math.floor(Math.random() * 5)] + "</h1>";
    ymaps.ready(init);
};
