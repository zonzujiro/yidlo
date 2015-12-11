window.onload = function () {
    var map;
    var elem = document.getElementById("result");
    elem.innerHTML = "<h1>" + ["Salateira", "McDonalds", "Wokkery", "Пелотка", "Пузата Хата"][Math.floor(Math.random() * 5)] + "</h1>";

    ymaps.ready(init);

    function init(){  
	    ymaps.geolocation.get().then(function (res) {
		    var $container = $('map'),
		        bounds = res.geoObjects.get(0).properties.get('boundedBy'),
		        mapState = ymaps.util.bounds.getCenterAndZoom(
		            bounds,
		            [$container.width(), $container.height()]
		        ),
		        map = new ymaps.Map('map', mapState);
		}, function (e) {
		    console.log(e);
		});
    }
};

