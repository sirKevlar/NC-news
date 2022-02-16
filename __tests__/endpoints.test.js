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

  describe('GET /api/article/:article_id', () => {
    test('status 200: responds with article object', () => {
      return request(app)
        .get('/api/article/2')
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
          });
        });
    });
    test('status 400: invalid id responds with msg Bad request', () => {
      return request(app)
        .get('/api/article/not-a-number')
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Bad request');
        });
    });
    test.only('status 404: valid but non-existent id responds with msg ID not found', () => {
      return request(app)
        .get('/api/article/7777777')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('ID not found');
        });
    });
  });
});
