const request = require('supertest');
const app = require('../server');

describe('API Health Check', () => {
  it('should return 200 and a success message', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Server is running!');
  });
});