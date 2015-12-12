window.onload = function () {
    var elem = document.getElementById("result");
    function init(){
        ymaps.geolocation.get().then(function (res) {
            var yKey = "007d1580-2af8-4055-ac77-d4e07172b230";

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

            var lat = bounds[0][0],
                lng = bounds[1][0];

                navigator.geolocation.getCurrentPosition(function(data) {
                    var lat = data.coords.latitude;
                    var lng = data.coords.longitude;
                    console.log(lat, lng);

                    var map = new L.Map('map_canvas')
                      .setView(new L.LatLng(lat, lng), 15);

                    console.log(map);
                    var mapboxUrl = 'http://a.tiles.mapbox.com/v3/foursquare.map-b7qq4a62.jsonp';
                        
                        wax.tilejson(mapboxUrl, function(tilejson) {
                            map.addLayer(new wax.leaf.connector(tilejson));
                        });
                });

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
                console.log($.getJSON("https://search-maps.yandex.ru/v1/?/apikey=" + yKey + "&text=где%20поесть&lang=uk_UA&ll=" + lat + "," + lng + "sspn=0.006791"));
                
                map.geoObjects.add(myGeoObject);
            }, function (e) {
                console.log(e);
            });
        }

    Math.seedrandom(Math.floor(new Date().getTime() / 86400000));
    elem.innerHTML = "<h1>" + ["Salateira", "McDonalds", "Wokkery", "Пелотка", "Пузата Хата"][Math.floor(Math.random() * 5)] + "</h1>";
    ymaps.ready(init);
};

