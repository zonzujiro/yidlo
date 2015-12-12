window.onload = function () {
    var elem = document.getElementById("result");
    var lat, lng;
    var yKey = "007d1580-2af8-4055-ac77-d4e07172b230";

    navigator.geolocation.getCurrentPosition(function(data) {
        lat = data.coords.latitude;
        lng = data.coords.longitude;
    });

    $.getJSON("https://search-maps.yandex.ru/v1/?text=где%20поесть&type=biz&lang=uk_UA&ll=" + lat + "%2C" + lng + "&sspn=0.06791&apikey=" + yKey, {}, function (data) {
        console.log(data);
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
                    zoom: 17
                }),
                myGeoObject = new ymaps.GeoObject({
                    geometry: {
                        type: "Point",
                        coordinates: mapState.center
                   }
                });
                // lat = bounds[0][0],
                // lng = bounds[1][0];

                // $.getJSON(config.apiUrl + 'v2/venues/explore?ll=' + lat + ',' + lng + '&oauth_token=' + window.token + '&v=20140601', {}, function(data) {
                //     venues = data['response']['groups'][0]['items'];
                //     /* Place marker for each venue. */
                //     for (var i = 0; i < venues.length; i++) {
                //     /* Get marker's location */
                //         var latLng = new L.LatLng(
                //             venues[i]['venue']['location']['lat'],
                //             venues[i]['venue']['location']['lng']
                //         );
                //         /* Build icon for each icon */
                //         var fsqIcon = venues[i]['venue']['categories'][0]['icon'];
                //         var leafletIcon = L.Icon.extend({
                //             iconUrl: fsqIcon['prefix'] + '32' + fsqIcon['suffix'],
                //             shadowUrl: null,
                //             iconSize: new L.Point(32,32),
                //             iconAnchor: new L.Point(16, 41),
                //             popupAnchor: new L.Point(0, -51)
                //         });
                //         var icon = new leafletIcon();
                //         var marker = new L.Marker(latLng, {icon: icon})
                //             .bindPopup(venues[i]['venue']['name'], { closeButton: false })
                //             .on('mouseover', function(e) { this.openPopup(); })
                //             .on('mouseout', function(e) { this.closePopup(); });
                //         map.addLayer(marker);
                //     }
                // })

                map.geoObjects.add(myGeoObject);
            }, function (e) {
                console.log(e);
            });
        }

    Math.seedrandom(Math.floor(new Date().getTime() / 86400000));
    elem.innerHTML = "<h1>" + ["Salateira", "McDonalds", "Wokkery", "Пелотка", "Пузата Хата"][Math.floor(Math.random() * 5)] + "</h1>";
    ymaps.ready(init);
};
