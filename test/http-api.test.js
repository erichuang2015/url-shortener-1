let yank = require('supertest'),
    expect = require('chai').expect,
    mongoose = require('mongoose'),
    rewire = require('rewire');

// let chance = new require('chance')();

let app = rewire('../app');

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
                expect(res.body).to.have.property('href', 'google.com');
            })
            .end(done);
    });

    it('не выполняется, если это дубль');
    it('не выполняется, если алиас уже занят');
    it('не выполняется, если алиас содержит странные символы');
    it('не выполняется, если сжимаемая ссылка слишком длинная');
    it('не выполняется, если сжимаемая ссылка пустая');
    it('не выполняется, если имя алиаса пустое');
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
