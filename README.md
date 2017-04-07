# [Yidlo](http://zonzujiro.github.io/yidlo/)
Пришло время обеда, все окрестные общепиты досконально изучены и вы с коллегами не можете выбрать куда пойти? Yidlo сделает это за вас!
Yidlo, исходя из текущего местонахождения пользователя, случайно выбирает одно из ближайших заведений и отображает его на карте.

## FAQ

> Что делать, если коллеге не понравится заведение и он выберет новое обновив страницу?

Он не выберет :) Дело в том, что случайный выбор осуществляется исходя из [зерна](https://en.wikipedia.org/wiki/Random_seed) которое генирируется раз в сутки, что дает стабильный результат выбора. Проще говоря - алгоритм будет постоянно случайно возвращать одно и то же заведение. Да, случайно и да, это считается :) 

Таким образом, ваш коллега может хоть дырку в своей клавиатуре проделать, но новое заведение ему не выпадет. Если он конечно не сменит свое местоположение.

> Ок, круто. Где фильтры?

Эээм... ну... их пока не будет. Не будет вот почему - есть три основных поставщика данных по организациям - 2GIS, Яндекс и Foursquare. И есть причина по которой я выбрал Яндекс.

Удобнее всех 2GIS, но они хотят денег, поэтому - сразу нет.

Далее, для того, чтобы получить отфильтрованный результат - необходимо сразу направлять запрос с параметрами. Яндекс такого не может. 

Foursquare может, но у него не детерминированные результаты выдачи. Т.е. при двух одинаковых запросах, Foursquare может вернуть два разных ответа. А может и не вернут. Такое... В такой ситуации идея с зерном не имеет смысла.

Потому остается Яндекс.

## Технологии
1. Create React App
2. [API Поиска по организациям Яндекса](https://tech.yandex.ru/maps/geosearch/)
3. [The Google Maps Geolocation API](https://developers.google.com/maps/documentation/geolocation/intro?hl=en)
4. [API 2GIS](http://api.2gis.ua/)
5. [Office UI Fabric](https://dev.office.com/fabric)

Код находится в ветке master
