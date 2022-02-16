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
        .then(({body})=>{
          expect(body.msg).toBe("Path not found")
        })
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
});
