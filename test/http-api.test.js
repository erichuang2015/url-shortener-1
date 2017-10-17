let yank = require('supertest'),
    expect = require('chai').expect,
    mongoose = require('mongoose'),
    rewire = require('rewire'),
    chance = new require('chance')();

let app = rewire('../app');

// Первым делом роняем базу
before((ready) => {
    mongoose.connection.dropDatabase(() => {
        ready();
    });
});

describe('Добавление новой ссылки', () => {
    it('выполняется, если это первая ссылка в базе', (done) => {
        yank(app)
            .post('/api/v1/aliases')
            .send({
                'name': 'first',
                'href': 'google.com'
            })
            .expect(200)
            .expect((res) => {
                expect(res.body).to.have.property('name', 'first');
                expect(res.body).to.have.property('href', 'http://google.com');
            })
            .end(done);
    });

    it('не выполняется, если это дубль', (done) => {
        yank(app)
            .post('/api/v1/aliases')
            .send({
                'name': 'first',
                'href': 'google.com'
            })
            .expect(400)
            .end(done);
    });

    it('не выполняется, если алиас слишком длинный', (done) => {
        yank(app)
            .post('/api/v1/aliases')
            .send({
                'name': chance.word({ length: 300 }),
                'href': 'google.com'
            })
            .expect(400)
            .end(done);
    });

    it('не выполняется, если алиас содержит странные символы', (done) => {
        yank(app)
            .post('/api/v1/aliases')
            .send({
                'name': '@asasd',
                'href': 'google.com'
            })
            .expect(400)
            .end(done);
    });

    it('не выполняется, если сжимаемая ссылка слишком длинная', (done) => {
        yank(app)
            .post('/api/v1/aliases')
            .send({
                'name': chance.word({ length: 5 }),
                'href': chance.word({ length: 3000 })
            })
            .expect(400)
            .end(done);
    });

    it('не выполняется, если сжимаемая ссылка пустая', (done) => {
        yank(app)
            .post('/api/v1/aliases')
            .send({
                'name': chance.word({ length: 5 }),
                'href': ''
            })
            .expect(400)
            .end(done);
    });

    it('не выполняется, если алиас не передан', (done) => {
        yank(app)
            .post('/api/v1/aliases')
            .send({
                'name': '',
                'href': chance.word({ length: 40 })
            })
            .expect(400)
            .end(done);
    });
});

describe('Редактирование ссылки', () => {
    it('не выполняется, если ссылки с таким именем нет');
    it('не выполняется, если пользователь не авторизован');
    it('не выполняется, если новое содержимое слишком длинное');
    it('не выполняется, если новое содержимое не передано');
    it('выполняется, если пользователь авторизован');
});

describe('Удаление ссылки', () => {
    it('не выполняется, если новое содержимое не передано');
    it('не выполняется, если пользователь не авторизован');
    it('не выполняется, если имя не передано');
    it('не выполняется, если такая не найдена');
    it('выполняется, если пользователь авторизован');
});

describe('Аналитика ссылки', () => {
    it('недоступна, если пользователь не авторизован');
    it('доступна, если пользователь авторизован');
});
