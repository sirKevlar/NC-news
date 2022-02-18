const request = require('supertest');
const app = require('../app');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data');
const db = require('../db/connection');

afterAll(() => db.end());

beforeEach(() => seed(data));

describe('Endpoints', () => {
  describe('ERR Invalid Path', () => {
    test('status 404: responds with message path not found', () => {
      return request(app)
        .get('/api/not-a-valid-path')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('Path not found');
        });
    });
  });
  /*-------TOPICS-------*/
  describe('GET /api/topics', () => {
    test('status 200: responds with array of topic objects', () => {
      return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({ body: { topics } }) => {
          expect(topics).toHaveLength(3);
          expect(topics[0]).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
    });
  });
  /*-------USERS-------*/
  describe('GET /api/users', () => {
    test('status 200: responds with array of user objects', () => {
      return request(app)
        .get('/api/users')
        .expect(200)
        .then(({ body: { users } }) => {
          expect(users).toHaveLength(4);
          expect(users[0]).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
    });
  });
  /*-------ARTICLES-------*/
  describe('GET /api/articles', () => {
    test('status 200: responds with array of article objects', () => {
      return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toHaveLength(12);
          expect(articles[0]).toEqual(
            expect.objectContaining({
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
            })
          );
        });
    });
  });

  describe('GET /api/articles/:article_id', () => {
    test('status 200: responds with article object', () => {
      return request(app)
        .get('/api/articles/2')
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).toEqual({
            article_id: 2,
            title: 'Sony Vaio; or, The Laptop',
            topic: 'mitch',
            author: 'icellusedkars',
            body: 'Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.',
            created_at: '2020-10-16T05:03:00.000Z',
            votes: 0,
            comment_count: '0',
          });
        });
    });
    test('status 400: invalid id responds with msg Bad request', () => {
      return request(app)
        .get('/api/articles/not-a-number')
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Bad request');
        });
    });
    test('status 404: valid but non-existent id responds with msg ID not found', () => {
      return request(app)
        .get('/api/articles/7777777')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('ID not found');
        });
    });
  });

  describe('PATCH /api/articles/:article_id', () => {
    test('status 201: article patched', () => {
      return request(app)
        .patch('/api/articles/1')
        .send({ inc_votes: 7 })
        .expect(201)
        .then(({ body }) => {
          expect(body.article).toEqual({
            article_id: 1,
            title: 'Living in the shadow of a great man',
            topic: 'mitch',
            author: 'butter_bridge',
            body: 'I find this existence challenging',
            created_at: '2020-07-09T20:11:00.000Z',
            votes: 107,
          });
        });
    });
    test('status 400: invalid id responds with msg Bad request', () => {
      return request(app)
        .patch('/api/articles/not-a-number')
        .send({ inc_votes: 7 })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Bad request');
        });
    });
    test('status 404: valid but non-existent id responds with msg ID not found', () => {
      return request(app)
        .patch('/api/articles/7777777')
        .send({ inc_votes: 7 })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('ID not found');
        });
    });
    test('status 400: Bad request patch body key not greenlisted', () => {
      return request(app)
        .patch('/api/articles/1')
        .send({ wrong_key: 100 })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Bad patch body');
        });
    });
    test('status 400: Bad request patch body value not valid', () => {
      return request(app)
        .patch('/api/articles/1')
        .send({ inc_votes: 'not-a-number' })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Bad request');
        });
    });
  });

  describe('POST /api/articles/:article_id/comments', () => {
    test('status 201: comment created', () => {
      return request(app)
        .post('/api/articles/2/comments')
        .send({ username: 'icellusedkars', body: 'So good it hurts' })
        .expect(201)
        .then(({ body: { comment } }) => {
          expect(comment[0]).toEqual(
            expect.objectContaining({
              body: 'So good it hurts',
              votes: 0,
              author: 'icellusedkars',
              article_id: 2,
              created_at: expect.any(String),
            })
          );
        });
    });
  });
  test('status 400: invalid id responds with msg Bad request', () => {
    return request(app)
      .post('/api/articles/nan/comments')
      .send({ username: 'icellusedkars', body: 'So good it hurts' })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad request');
      });
  });
  test('status 404: valid but non-existent id responds with msg ID not found', () => {
    return request(app)
      .post('/api/articles/222/comments')
      .send({ username: 'icellusedkars', body: 'So good it hurts' })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Id not found');
      });
  });
  test('status 400: invalid body key', () => {
    return request(app)
      .post('/api/articles/2/comments')
      .send({ badKey: 'icellusedkars', body: 'So good it hurts' })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad request');
      });
  });
  test('status 400: invalid body value', () => {
    return request(app)
      .post('/api/articles/2/comments')
      .send({ username: 1, body: 'So good it hurts' })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad request');
      });
  });
});
