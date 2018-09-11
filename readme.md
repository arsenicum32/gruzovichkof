Сервер для тестового задания, который реализует метод поисковых подсказок.
Для установки сервера на хостинг потребуется nodeJS v 6.0.0+ и npm v 5.6.0+
Инструкция:
1. склонируйте ветку на свой хостинг
2. войдите в папку репозитория ```cd your-path```
3. выполните команду ```npm i```
4. запустите сервер ```npm start```
Ваш сервер доступен по адресу http://<your-server-ip>:3500

Серверные методы:

/api/q GET – получить список подсказок.
Запрос:
При получении следует передать параметр { string: <search-string> }
Ответ:
{ hints: [< массив подсказок >] , error: <true / false – произошла ли ошибка во время исполнения команды>, string: <заданная поисковая строка> }

Как оптимизировать при возрастающей нагрузке:

1. Сейчас данные кешируются только на сервере в файл cache.json, можно кешировать их и на клиенте: не отправляя лишний раз данные на сервер.

2. Вместо кеширования в файл поднять на другой виртуальной машине Redis BD и кешировать их в базу данных.
https://redis.io/documentation

3. Написать load-balance на nginx и с помощью pm2 создать несколько экземпляров сервера на разных портах и с помощью балансировки нагрузки отправлять их на разные сервера.

4. Использовать socket.io вместо REST API, чтобы снизить количество обращений к серверу.

Для оперативного масштабирования нагрузок я использую стандартные утилиты от digital ocean:
https://www.digitalocean.com/products/load-balancer/

на котором держу несколько VPS.
