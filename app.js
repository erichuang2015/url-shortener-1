// Подключаем зависимости
let express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser');

// И логгер
let debug = require('debug')('url-short:main');

// Настраиваем переменные окружения
process.env.PORT = 8080;
let env = process.env.NODE_ENV || 'production';

debug(`Node environment is set to "${env}"`);

// Создаем экземпляр приложения на Express
let app = express();

// Конфигурируем парсеры
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Прописываем заголовки для ответа
app.use((req, res, next) => {
    res.set({
        'Access-Control-Allow-Origin': '*',
        'X-Powered-By': 'None of your business'
    });

    next();
});

// Настраиваем роутинг
let api = require('./api/routers'),
    gui = require('./gui/routers');

app.use('/api/v1', api);
app.use('/', gui);

// Раздаем из публичной директории GUI статику
app.use(express.static(path.join(__dirname, 'gui/public')));

// Указываем движок Pug для рендеринга вьюх и место, где их брать
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'gui/views'));

// Ловим ошибку формата JSON и передаем дальше
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        let err = new Error('Bad JSON');
        err.status = 400;
    }

    next(err);
});

// Ловим 404 и передаем обработчику ошибок и передаем дальше
app.use((req, res, next) => {
    let err = new Error('Not Found');
    err.status = 404;

    next(err);
});

// Обработчик ошибок
app.use((err, req, res) => {
    // Кидаем ошибку только в окружении development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // Рендерим страницу с ошибкой
    res.status(err.status || 500);
    res.render('error');
});

// Получаем порт
let port = process.env.PORT;

// Слушаем на порт 'port'
app.listen(port);

debug('Listening on port ' + port);

module.exports = app;
