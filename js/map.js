window.onload = function() {
    ymaps.ready(function() {
        var url = parseUrl();

        function parseUrl() {
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

        function searchUserPosition () {
            var navigatorPosition = {},
                googleGeoPosition = {};

            var search = new Promise(function (resolve, reject) {
                var askNavigator = new Promise(function (resolve, reject) {
                        navigator.geolocation.getCurrentPosition(function (result) {
                            var position = {
                                    lat: result.coords.latitude.toFixed(5),
                                    lng: result.coords.longitude.toFixed(5),
                                    accuracy: result.accuracy
                                };
                            resolve(position);
                        });                
                    }),
                    askGoogle = new Promise(function (resolve, reject) {
                        $.post("https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyC43aIoS8meiBAY_ADc95dA6p4C1GkZ8WU", {}, function (result) {
                            var position = {
                                    lat: result.location.lat.toFixed(5),
                                    lng: result.location.lng.toFixed(5),
                                    accuracy: result.accuracy
                                };
                            resolve(position);
                        });                
                    });

                askNavigator.then(function (pos) {
                    navigatorPosition = pos;
                });

                askGoogle.then(function (pos) {
                    googleGeoPosition = pos;
                    resolve();
                })    
            });
            
            search.then(function () {
                if (navigatorPosition.accuracy == undefined) {
                    drawMap(googleGeoPosition);
                } else if (navigatorPosition.accuracy < googleGeoPosition.accuracy) {
                    drawMap(navigatorPosition);
                } else {
                    drawMap(googleGeoPosition);
                }
            });
        }

        // function success(position) {
        //     var pos = {
        //             lat: position.coords.latitude.toFixed(5),
        //             lng: position.coords.longitude.toFixed(5)
        //         };

        //     savePositionToLocalStorage(pos);
        //     drawMap(pos);
        // };

        function getPositionFromLocalStorage() {
            console.log("Trying to take geo from the local storage");
            var pos = {
                    lat: localStorage.getItem("lat"),
                    lng: localStorage.getItem("lng")
                };

            if (pos.lat != undefined && pos.lng != undefined) {
                drawMap(pos);
            }
        }

        // function getPositionFromGoogleGeo() {
        //     console.log("Trying to find geo with help of Google API");
        //     $.post("https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyC43aIoS8meiBAY_ADc95dA6p4C1GkZ8WU", {}, function(result) {
        //         var pos = {
        //                 lat: result.location.lat,
        //                 lng: result.location.lng
        //             };

        //         savePositionToLocalStorage(pos);
        //         drawMap(pos);
        //     });
        // }

        function searchLunch (position) {
            var result, 
                client = {
                    id: "client_id=H3RYBO0RBLHCPXZRBHFCOWP1WY2KMHD5LCS3R1CSAZJN0CYG",
                    secret: "client_secret=EGDRPYC3SKAZMJJPU2XODXUEZLFGUFYIB5X3KIEZOSQLTXU1"
                };

            $.getJSON('https://api.foursquare.com/v2/venues/explore?ll=' + position.lat + ',' + position.lng + '&' + client.id + '&' + client.secret + '&v=20140601&section=food', {}, function (data) {
                Math.seedrandom(Math.floor(new Date().getTime() / 86400000));
                result = data.response.groups[0].items[Math.floor(Math.random() * data.response.groups[0].items.length)].venue;
            });
            
            return result;
        }

        function drawMap(pos) {
            var map = new ymaps.Map('map', {
                    center: [pos.lat, pos.lng],
                    zoom: 17,
                    controls: [],
                    behaviors: ['default', 'scrollZoom']
                }),
                user = new ymaps.GeoObject({
                    geometry: {
                        type: "Point",
                        coordinates: [pos.lat, pos.lng]
                    }
                }),
                client = {
                    id: "client_id=H3RYBO0RBLHCPXZRBHFCOWP1WY2KMHD5LCS3R1CSAZJN0CYG",
                    secret: "client_secret=EGDRPYC3SKAZMJJPU2XODXUEZLFGUFYIB5X3KIEZOSQLTXU1"
                },
                apiKey = "007d1580-2af8-4055-ac77-d4e07172b230",
                userPosition = "#lat=" + pos.lat + "&lng=" + pos.lng;

            $("#share").html('<p>Посилання друзям: </p><input id="url" type="text" class = "form-control" value="http://zonzujiro.github.io/yidlo' + userPosition + '" readonly="readonly" type="text" id="show" onclick="this.select()">');

            window.location = window.location.pathname + userPosition;

            map.geoObjects.add(user);

            $.getJSON('https://api.foursquare.com/v2/venues/explore?ll=' + pos.lat + ',' + pos.lng + '&' + client.id + '&' + client.secret + '&v=20140601&section=food', {}, function (data) {
                Math.seedrandom(Math.floor(new Date().getTime() / 86400000));
                var venue = data.response.groups[0].items[Math.floor(Math.random() * data.response.groups[0].items.length)].venue,
                    MyBalloonLayout = ymaps.templateLayoutFactory.createClass(
                        '<div class="popover top">' +
                            '<a class="close" href="#">&times;</a>' +
                            '<div class="arrow"></div>' +
                            '<div class="popover-inner">' +
                            '$[[options.contentLayout observeSize minWidth=235 maxWidth=235 maxHeight=350]]' +
                            '</div>' +
                            '</div>', {
                            /**
                             * Строит экземпляр макета на основе шаблона и добавляет его в родительский HTML-элемент.
                             * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/layout.templateBased.Base.xml#build
                             * @function
                             * @name build
                             */
                            build: function () {
                                this.constructor.superclass.build.call(this);
                                this._$element = $('.popover', this.getParentElement());
                                this.applyElementOffset();
                                this._$element.find('.close').on('click', $.proxy(this.onCloseClick, this));
                            },

                            /**
                             * Удаляет содержимое макета из DOM.
                             * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/layout.templateBased.Base.xml#clear
                             * @function
                             * @name clear
                             */
                            clear: function () {
                                this._$element.find('.close').off('click');
                                this.constructor.superclass.clear.call(this);
                            },

                            /**
                             * Метод будет вызван системой шаблонов АПИ при изменении размеров вложенного макета.
                             * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/IBalloonLayout.xml#event-userclose
                             * @function
                             * @name onSublayoutSizeChange
                             */
                            onSublayoutSizeChange: function () {
                                MyBalloonLayout.superclass.onSublayoutSizeChange.apply(this, arguments);

                                if (!this._isElement(this._$element)) {
                                    return;
                                }

                                this.applyElementOffset();

                                this.events.fire('shapechange');
                            },

                            /**
                             * Сдвигаем балун, чтобы "хвостик" указывал на точку привязки.
                             * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/IBalloonLayout.xml#event-userclose
                             * @function
                             * @name applyElementOffset
                             */
                            applyElementOffset: function () {
                                this._$element.css({
                                    left: -(this._$element[0].offsetWidth / 2),
                                    top: -(this._$element[0].offsetHeight + this._$element.find('.arrow')[0].offsetHeight)
                                });
                            },

                            /**
                             * Закрывает балун при клике на крестик, кидая событие "userclose" на макете.
                             * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/IBalloonLayout.xml#event-userclose
                             * @function
                             * @name onCloseClick
                             */
                            onCloseClick: function (e) {
                                e.preventDefault();

                                this.events.fire('userclose');
                            },

                            /**
                             * Используется для автопозиционирования (balloonAutoPan).
                             * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/ILayout.xml#getClientBounds
                             * @function
                             * @name getClientBounds
                             * @returns {Number[][]} Координаты левого верхнего и правого нижнего углов шаблона относительно точки привязки.
                             */
                            getShape: function () {
                                if(!this._isElement(this._$element)) {
                                    return MyBalloonLayout.superclass.getShape.call(this);
                                }

                                var position = this._$element.position();

                                return new ymaps.shape.Rectangle(new ymaps.geometry.pixel.Rectangle([
                                    [position.left, position.top], [
                                        position.left + this._$element[0].offsetWidth,
                                        position.top + this._$element[0].offsetHeight + this._$element.find('.arrow')[0].offsetHeight
                                    ]
                                ]));
                            },

                            /**
                             * Проверяем наличие элемента (в ИЕ и Опере его еще может не быть).
                             * @function
                             * @private
                             * @name _isElement
                             * @param {jQuery} [element] Элемент.
                             * @returns {Boolean} Флаг наличия.
                             */
                            _isElement: function (element) {
                                return element && element[0] && element.find('.arrow')[0];
                            }
                        }),

                // Создание вложенного макета содержимого балуна.
                    MyBalloonContentLayout = ymaps.templateLayoutFactory.createClass(
                        '<h3 class="popover-title">$[properties.balloonHeader]</h3>' +
                            '<div class="popover-content">$[properties.balloonContent]</div>'
                    ),

                // Создание метки с пользовательским макетом балуна.
                    myPlacemark = window.myPlacemark = new ymaps.Placemark([venue.location.lat, venue.location.lng], {
                        balloonHeader: venue.name,
                        balloonContent: venue.categories[0].name
                    }, {
                        balloonShadow: false,
                        balloonLayout: MyBalloonLayout,
                        balloonContentLayout: MyBalloonContentLayout,
                        balloonPanelMaxMapArea: 0,
                        // Не скрываем иконку при открытом балуне.
                        hideIconOnBalloonOpen: false
                        // И дополнительно смещаем балун, для открытия над иконкой.
                        // balloonOffset: [3, -40]
                    });

                console.log(MyBalloonLayout);
                map.geoObjects.add(myPlacemark);
            });
        }

        function savePositionToLocalStorage(pos) {
            localStorage.removeItem("lat");
            localStorage.removeItem("lng");
            localStorage.setItem('lat', pos.lat);
            localStorage.setItem('lng', pos.lng);
        }

        window.onhashchange = function() {
            var url = parseUrl(),
                pos = {
                    lat: url.lat,
                    lng: url.lng
                };

            if (pos.lat != undefined && pos.lng != undefined) {
                $("#map").html("");
                savePositionToLocalStorage(pos);
                drawMap(pos);
            }
        }

        if (url.lat != undefined && url.lng != undefined) {
            var pos = {
                    lat: url.lat,
                    lng: url.lng
                };

            console.log("Position in url founded");
            savePositionToLocalStorage(pos);
            drawMap(pos);
        } else {
            console.log("Searching user's geolocation");
            // navigator.geolocation.getCurrentPosition(success, getPositionFromGoogleGeo);
            searchUserPosition();
        }
    });
};