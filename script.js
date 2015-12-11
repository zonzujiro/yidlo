window.onload = function () {
    var elem = document.getElementById("result");
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
		        
				map.geoObjects.add(myGeoObject);
		}, function (e) {
		    console.log(e);
		});
    }
    
    elem.innerHTML = "<h1>" + ["Salateira", "McDonalds", "Wokkery", "Пелотка", "Пузата Хата"][Math.seedrandom(Math.floor(new Date().getTime() / 86400000))] + "</h1>";
    ymaps.ready(init);
};

